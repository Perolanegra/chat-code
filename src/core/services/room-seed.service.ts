import { inject, Injectable } from '@angular/core';

import {
  Firestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { RoomSeedDTO } from '../dto/room-seed-dto.model';

export interface RoomSeedOptions {
  /**

   * Cria uma mensagem de boas-vindas em rooms/{roomId}/messages

   */

  seedWelcomeMessage?: boolean;

  /**

   * Define presença inicial dos membros como "online" (rooms/{roomId}/presence/{uid})

   */

  seedPresenceOnline?: boolean;

  /**

   * Limpa docs de sinalização WebRTC (offer/answer) e subcoleções candidates

   * — Útil para recomeçar testes de chamada.

   */

  clearWebRTCSignaling?: boolean;
}

@Injectable({ providedIn: 'root' })
export class RoomSeedService {
  private readonly db = inject(Firestore);

  /**

   * Cria/atualiza uma sala com name, members e createdAt (no create).

   * Opcionalmente: cria mensagem de boas-vindas, presença online e limpa sinalização.

   *

   * Agora recebe um RoomSeedDTO para garantir que todos os campos obrigatórios

   * sejam validados de forma consistente com o sistema de decorators.

   *
   * As opções de seed (seedWelcomeMessage, seedPresenceOnline, clearWebRTCSignaling)
   * são lidas diretamente do DTO.
   */

  async upsertRoom(dto: RoomSeedDTO): Promise<void> {
    const errors = RoomSeedDTO.validate(dto);

    if (errors) {
      throw new Error('[RoomSeedService] RoomSeedDTO is invalid: ' + JSON.stringify(errors));
    }

    const {
      roomId,
      name,
      members,
      welcomeSenderId,
      seedWelcomeMessage = true,
      seedPresenceOnline = true,
      clearWebRTCSignaling = false,
    } = dto;

    const roomRef = doc(this.db, `rooms/${roomId}`);

    const snap = await getDoc(roomRef);

    if (!snap.exists()) {
      // Create

      await setDoc(roomRef, {
        name,

        members,

        createdAt: serverTimestamp(),
      });
    } else {
      // Update (merge name/members sem sobrescrever createdAt)

      await updateDoc(roomRef, {
        name,

        members,
      });
    }

    // Seed (opcional) de mensagem de boas-vindas

    if (seedWelcomeMessage && welcomeSenderId) {
      const msgCollection = collection(this.db, `rooms/${roomId}/messages`);

      await addDoc(msgCollection, {
        type: 'text',

        text: `Welcome to ${name}!`,

        senderId: welcomeSenderId,

        createdAt: serverTimestamp(),
      });
    }

    // Seed (opcional) de presença online

    if (seedPresenceOnline) {
      const promises = members.map(async (uid) => {
        const presenceRef = doc(this.db, `rooms/${roomId}/presence/${uid}`);
        await setDoc(
          presenceRef,
          { status: 'online', updatedAt: serverTimestamp() },
          { merge: true },
        );
      });
      await Promise.all(promises);
    }

    // (Opcional) limpar sinalização de WebRTC

    if (clearWebRTCSignaling) {
      await this.clearWebRTC(roomId);
    }
  }

  /**
   * Adiciona um membro à um chat type channel (rooms/{roomId}.members)
   */
  async addMember(roomId: string, userId: string): Promise<void> {
    const roomRef = doc(this.db, `rooms/${roomId}`);
    await updateDoc(roomRef, {
      members: arrayUnion(userId),
    });
  }

  /**
   * Remove um membro da sala
   */
  async removeMember(roomId: string, userId: string): Promise<void> {
    const roomRef = doc(this.db, `rooms/${roomId}`);
    await updateDoc(roomRef, {
      members: arrayRemove(userId),
    });
    // Opcional: limpar presença desse usuário
    const presenceRef = doc(this.db, `rooms/${roomId}/presence/${userId}`);
    await deleteDoc(presenceRef).catch(() => void 0);
  }

  /**
   * Lista salas em que o usuário é membro
   */
  async listRoomsForUser(userId: string): Promise<Array<{ id: string; name: string }>> {
    // rooms onde members contém userId
    const roomsCol = collection(this.db, `rooms`);
    const q = query(roomsCol, where('members', 'array-contains', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, name: (d.data() as any).name }));
  }

  /**
   * Remove completamente uma sala (documento e subcoleções básicas).
   * Atenção: Firestore não apaga subcoleções automaticamente com deleteDoc.
   * Este método apaga manualmente subcoleções "conhecidas".
   */
  async deleteRoomHard(roomId: string): Promise<void> {
    // Apaga mensagens
    await this.deleteCollection(`rooms/${roomId}/messages`);
    // Apaga presença
    await this.deleteCollection(`rooms/${roomId}/presence`);
    // Apaga candidatos (caller/callee) e offer/answer
    await this.clearWebRTC(roomId);

    // Por fim, apaga o doc da room
    const roomRef = doc(this.db, `rooms/${roomId}`);
    await deleteDoc(roomRef);
  }

  // ---------------------------------------------------------------------------
  // Helpers de WebRTC
  // ---------------------------------------------------------------------------

  /**
   * Limpa sinalização WebRTC (offer/answer) e subcoleções candidates (caller/callee)
   */
  private async clearWebRTC(roomId: string): Promise<void> {
    const offerRef = doc(this.db, `rooms/${roomId}/webrtc/offer`);
    const answerRef = doc(this.db, `rooms/${roomId}/webrtc/answer`);
    await deleteDoc(offerRef).catch(() => void 0);
    await deleteDoc(answerRef).catch(() => void 0);

    await this.deleteCollection(`rooms/${roomId}/webrtc/candidates/caller`);
    await this.deleteCollection(`rooms/${roomId}/webrtc/candidates/callee`);
  }

  /**
   * Apaga todos os docs de uma coleção (caminho) — cuidado com custos de leitura
   */
  private async deleteCollection(path: string): Promise<void> {
    const col = collection(this.db, path);
    const snap = await getDocs(col);
    const deletions = snap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletions);
  }
}
