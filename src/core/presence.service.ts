
import { inject, Injectable, NgZone } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  serverTimestamp,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { Observable, Subject, interval, Subscription } from 'rxjs';

export type PresenceStatus = 'online' | 'typing' | 'in-call';

export interface PresenceDoc {
  status: PresenceStatus;
  updatedAt: any; // Firestore Timestamp
}

/**
 * PresenceService
 * - Seta presença do usuário na room (online/typing/in-call) com heartbeat.
 * - Escuta presença de todos os membros da room.
 */
@Injectable({ providedIn: 'root' })
export class PresenceService {
  private readonly db = inject(Firestore);
  private readonly zone = inject(NgZone);

  /** Emite erros do serviço (opcional, para UI consumir) */
  public readonly errors$ = new Subject<unknown>();

  /** Heartbeat interno */
  private hbSub?: Subscription;

  /**
   * Atualiza a presença do usuário na room (merge), com updatedAt = serverTimestamp().
   */
  async setPresence(roomId: string, userId: string, status: PresenceStatus): Promise<void> {
    try {
      const ref = doc(this.db, `rooms/${roomId}/presence/${userId}`);
      await setDoc(ref, { status, updatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.error('[PresenceService] setPresence error', err);
      this.errors$.next(err);
    }
  }

  /**
   * Inicia um heartbeat para manter o usuário "online".
   * Chame ao entrar na room; encerre ao sair.
   *
   * @param intervalMs intervalo em ms (ex.: 25_000)
   */
  startHeartbeat(roomId: string, userId: string, intervalMs = 25_000): void {
    this.stopHeartbeat();

    // Use NgZone para evitar churn de detecção de mudanças
    this.zone.runOutsideAngular(() => {
      this.hbSub = interval(intervalMs).subscribe(async () => {
        try {
          const ref = doc(this.db, `rooms/${roomId}/presence/${userId}`);
          await setDoc(ref, { status: 'online', updatedAt: serverTimestamp() }, { merge: true });
        } catch (err) {
          console.error('[PresenceService] heartbeat error', err);
          this.errors$.next(err);
        }
      });
    });
  }

  /** Para o heartbeat */
  stopHeartbeat(): void {
    this.hbSub?.unsubscribe();
    this.hbSub = undefined;
  }

  /**
   * Escuta a presença da room (todos os docs em rooms/{roomId}/presence).
   * Retorna um Observable com um array tipado.
   */
  listenPresence(roomId: string): Observable<Array<PresenceDoc & { id: string }>> {
    const col = collection(this.db, `rooms/${roomId}/presence`);
    return collectionData(col, { idField: 'id' }) as Observable<Array<PresenceDoc & { id: string }>>;
  }
}
