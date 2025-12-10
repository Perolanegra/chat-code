
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  addDoc,
} from '@angular/fire/firestore';

export type CallRole = 'caller' | 'callee';

export interface CallInitOptions {
  roomId: string;
  localStream: MediaStream;
  role: CallRole;
}

export interface StartCallResult {
  pc: RTCPeerConnection;
  remoteStream: MediaStream;
  // Funções para encerrar corretamente os listeners de Firestore
  unsubscribeAnswer?: () => void;
  unsubscribeRemoteCandidates?: () => void;
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[]; // ex.: STUN/TURN vindos do environment
}

@Injectable({ providedIn: 'root' })
export class WebRTCService {
  private readonly db = inject(Firestore);

  /**
   * Retorna um MediaStream do usuário (áudio/vídeo).
   * Ajuste os constraints conforme necessidade (screenshare é feito via getDisplayMedia).
   */
  async getMedia(
    constraints: MediaStreamConstraints = { audio: true, video: true },
  ): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  /**
   * Inicia uma chamada 1:1.
   * - caller: publica offer, escuta answer e candidates do callee
   * - callee: lê offer, publica answer e escuta candidates do caller
   */
  async startCall(
    opts: CallInitOptions,
    config: WebRTCConfig,
  ): Promise<StartCallResult> {
    const { roomId, localStream, role } = opts;
    const pc = new RTCPeerConnection({ iceServers: config.iceServers });

    // Adiciona mídia local
    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    // Monta remote stream
    const remoteStream = new MediaStream();
    pc.ontrack = (ev) => ev.streams[0]?.getTracks().forEach((t) => remoteStream.addTrack(t));

    // Sinalização (candidates locais)
    const candidatesCol = collection(this.db, `rooms/${roomId}/webrtc/candidates/${role}`);
    pc.onicecandidate = async (e) => {
      if (e.candidate) {
        await addDoc(candidatesCol, {
          candidate: e.candidate.toJSON() as RTCIceCandidateInit,
          createdAt: serverTimestamp(),
        });
      }
    };

    // Referências de offer/answer
    const offerRef = doc(this.db, `rooms/${roomId}/webrtc/offer`);
    const answerRef = doc(this.db, `rooms/${roomId}/webrtc/answer`);

    let unsubscribeAnswer: () => void | undefined;
    let unsubscribeRemoteCandidates: () => void | undefined;

    if (role === 'caller') {
      // 1) Criar offer
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await pc.setLocalDescription(offer);

      // 2) Publicar offer
      await setDoc(offerRef, {
        sdp: offer.sdp,
        type: offer.type,
        createdAt: serverTimestamp(),
      });

      // 3) Escutar answer e aplicar
      unsubscribeAnswer = onSnapshot(answerRef, async (snap) => {
        const data = snap.data();
        if (data?.['sdp'] && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription({ type: 'answer', sdp: data?.['sdp'] });
        }
      });

      // 4) Escutar candidatos remotos (do callee)
      const calleeCandCol = collection(this.db, `rooms/${roomId}/webrtc/candidates/callee`);
      unsubscribeRemoteCandidates = onSnapshot(calleeCandCol, async (snap) => {
        for (const change of snap.docChanges()) {
          if (change.type === 'added') {
            const { candidate } = change.doc.data() as { candidate: RTCIceCandidateInit };
            try {
              await pc.addIceCandidate(candidate);
            } catch (err) {
              console.error('[WebRTCService] addIceCandidate (caller) error', err);
            }
          }
        }
      });

      return { pc, remoteStream, unsubscribeAnswer, unsubscribeRemoteCandidates };
    }

    // role === 'callee'
    {
      // 1) Ler offer e aplicar
      const offerSnap = await getDoc(offerRef);
      const offerData = offerSnap.data();
      if (!offerData?.['sdp']) {
        throw new Error('Offer não encontrada para esta room. Abra como caller primeiro.');
      }
      await pc.setRemoteDescription({ type: 'offer', sdp: offerData?.['sdp'] });

      // 2) Criar answer e publicar
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await setDoc(answerRef, {
        sdp: answer.sdp,
        type: answer.type,
        createdAt: serverTimestamp(),
      });

      // 3) Escutar candidatos remotos (do caller)
      const callerCandCol = collection(this.db, `rooms/${roomId}/webrtc/candidates/caller`);
      unsubscribeRemoteCandidates = onSnapshot(callerCandCol, async (snap) => {
        for (const change of snap.docChanges()) {
          if (change.type === 'added') {
            const { candidate } = change.doc.data() as { candidate: RTCIceCandidateInit };
            try {
              await pc.addIceCandidate(candidate);
            } catch (err) {
              console.error('[WebRTCService] addIceCandidate (callee) error', err);
            }
          }
        }
      });

      // O callee não precisa escutar answer.
      return { pc, remoteStream, unsubscribeRemoteCandidates };
    }
  }

  /**
   * Encerra a chamada:
   * - Para tracks, fecha o RTCPeerConnection
   * - Remove listeners de Firestore (se foram fornecidos)
   * - Opcionalmente limpar documentos de sinalização
   */
  async hangup(
    roomId: string,
    pc: RTCPeerConnection,
    listeners?: { unsubscribeAnswer?: () => void; unsubscribeRemoteCandidates?: () => void },
    opts?: { clearSignaling?: boolean },
  ): Promise<void> {
    try {
      // parar mídia local/remota
      pc.getSenders().forEach((s) => s.track && s.track.stop());
      pc.getReceivers().forEach((r) => r.track && r.track.stop());
      pc.close();

      // desinscrever listeners de Firestore
      listeners?.unsubscribeAnswer?.();
      listeners?.unsubscribeRemoteCandidates?.();

      // opcionalmente limpar docs de sinalização (útil para ligações efêmeras)
      if (opts?.clearSignaling) {
        // Atenção: em calls simultâneas, limpar pode impactar outra sessão
        // Ajuste esta estratégia conforme sua UX (salas persistentes x efêmeras)
        const offerRef = doc(this.db, `rooms/${roomId}/webrtc/offer`);
        const answerRef = doc(this.db, `rooms/${roomId}/webrtc/answer`);
        // Não há deleteDoc reexportado aqui, podemos reusar via import se desejar
        // ou sobrescrever conteúdo com um payload mínimo. Aqui deixamos como TODO.
        // import { deleteDoc } from '@angular/fire/firestore';
        // await deleteDoc(offerRef); await deleteDoc(answerRef);
      }
    } catch (err) {
      console.error('[WebRTCService] hangup error', err);
    }
  }

  /**
   * Screen share: substitui a track de vídeo local por uma track de display.
   * Lembre de reverter ao encerrar (stop track de display e re-adicionar câmera).
   */
  async startScreenShare(pc: RTCPeerConnection): Promise<MediaStream | null> {
    if (!navigator.mediaDevices.getDisplayMedia) return null;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenTrack = displayStream.getVideoTracks()[0];

    const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
    if (sender && screenTrack) {
      await sender.replaceTrack(screenTrack);
      screenTrack.onended = async () => {
        // Quando o usuário para o share, idealmente voltamos para a câmera
        try {
          const cam = await this.getMedia({ video: true });
          const camTrack = cam.getVideoTracks()[0];
          if (camTrack) await sender.replaceTrack(camTrack);
        } catch (err) {
          console.error('[WebRTCService] restore camera after screenshare error', err);
        }
      };
    }
    return displayStream;
  }
}
