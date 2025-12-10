import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  CollectionReference,
  DocumentData,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit as fsLimit,
  startAfter as fsStartAfter,
  Timestamp,
  QueryDocumentSnapshot,
  QueryConstraint,
  doc,
  collectionData,
} from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface SendMessageOptions {
  type?: ChatMessage['type'];
  text?: string;
  senderId: string;
  // sem Storage, ignoramos file aqui; use sendExternalAttachment() se precisar
  file?: File | null;
}

import {
  makeAttachmentMessage,
  makeTextMessage,
} from '@core/app/factories/firestore/firestore.factory';
import {
  ChatMessage,
  ChatMessageAttachment,
  Pagination,
} from '@modules-chat-interfaces/chat-message/chat-message.interface';

export interface PaginatedMessages {
  messages: ChatMessage[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private readonly firestore = inject(Firestore);

  /**
   * Referência da subcoleção de mensagens de uma room.
   * Estrutura: rooms/{roomId}/messages/{messageId}
   */
  private messagesCol(roomId: string): CollectionReference<DocumentData> {
    return collection(this.firestore, `rooms/${roomId}/messages`);
  }

  // ---------------------------------------------------------------------------
  // Messages: list / paginate (one-shot)
  // ---------------------------------------------------------------------------

  /**
   * Carrega uma página de mensagens de uma room.
   * - Ordena por createdAt (desc) para histórico decrescente.
   * - Usa limit + startAfter para paginação.
   *
   * Use o `lastDoc` retornado como `pagination.startAfter` na próxima página.
   */
  listMessages(roomId: string, pagination: Pagination = {}): Observable<PaginatedMessages> {
    const { limit: pageSize = 50, startAfter } = pagination;

    const colRef = this.messagesCol(roomId);
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), fsLimit(pageSize)];
    if (startAfter) constraints.push(fsStartAfter(startAfter));

    const q = query(colRef, ...constraints);

    return from(getDocs(q)).pipe(
      map((snap) => {
        const messages: ChatMessage[] = snap.docs.map((d) => {
          const data = d.data() as ChatMessage;
          const normalized = this.normalizeCreatedAt({ ...data, id: d.id });
          return normalized;
        });
        const lastDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
        return { messages, lastDoc };
      }),
      catchError((error) => {
        console.error('[FirestoreService] listMessages error', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Carrega próxima página (Promise), útil para "carregar mais" histórico.
   */

  async loadNextPage(
    roomId: string,
    lastDocSnap: QueryDocumentSnapshot<DocumentData>,
    page: Pagination = { limit: 50 },
  ): Promise<{ messages: ChatMessage[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const colRef = this.messagesCol(roomId);
    const q = query(
      colRef,
      orderBy('createdAt', 'desc'),
      fsStartAfter(lastDocSnap),
      fsLimit(page.limit ?? 50),
    );

    const snap = await getDocs(q);
    const messages = snap.docs.map((d) => {
      const data = d.data() as ChatMessage;
      return this.normalizeCreatedAt({ ...data, id: d.id });
    });
    const lastDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

    return { messages, lastDoc };
  }

  // ---------------------------------------------------------------------------
  // Messages: real-time stream (timeline)
  // ---------------------------------------------------------------------------

  /**
   * Escuta mensagens em tempo real (N últimas), ordenadas por createdAt.
   * Útil para a timeline ativa do chat.
   */
  listenLiveMessages(roomId: string, pageSize = 50): Observable<ChatMessage[]> {
    const colRef = this.messagesCol(roomId);
    const q = query(colRef, orderBy('createdAt', 'asc'), fsLimit(pageSize));
    return collectionData(q, { idField: 'id' }).pipe(
      map((msgs) => msgs.map((m) => this.normalizeCreatedAt(m as ChatMessage))),
      catchError((error) => {
        console.error('[FirestoreService] listenLiveMessages error', error);
        return throwError(() => error);
      }),
    ) as Observable<ChatMessage[]>;
  }

  // ---------------------------------------------------------------------------
  // Messages: send (texto) + (opcional) anexo externo
  // ---------------------------------------------------------------------------

  /**
   * Envia uma mensagem de texto.
   * Usa `serverTimestamp()` para `createdAt` (ordenação por tempo do servidor).
   */
  sendMessage(roomId: string, options: SendMessageOptions): Observable<ChatMessage> {
    const { senderId, text } = options;
    if (!senderId) return throwError(() => new Error('senderId is required'));

    const type: ChatMessage['type'] = options.type ?? 'text';
    const baseMessage = makeTextMessage(roomId, senderId, text || '', type);

    return from(addDoc(this.messagesCol(roomId), baseMessage as ChatMessage)).pipe(
      map((ref) => this.normalizeCreatedAt({ ...(baseMessage as ChatMessage), id: ref.id })),
      catchError((error) => {
        console.error('[FirestoreService] sendMessage (text) error', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * (Opcional) Envia uma mensagem com anexo externo (URL pública de outro provedor).
   * Mantém o mesmo formato de `attachment` sem usar Firebase Storage.
   */
  sendExternalAttachment(
    roomId: string,
    senderId: string,
    meta: ChatMessageAttachment,
    type: 'image' | 'file' = 'file',
  ): Observable<ChatMessage> {
    if (!senderId) return throwError(() => new Error('senderId is required'));

    const payload: ChatMessage = makeAttachmentMessage(roomId, senderId, meta, type);

    return from(addDoc(this.messagesCol(roomId), payload)).pipe(
      map((ref) => this.normalizeCreatedAt({ ...payload, id: ref.id })),
      catchError((error) => {
        console.error('[FirestoreService] sendExternalAttachment error', error);
        return throwError(() => error);
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Messages: edit / delete
  // ---------------------------------------------------------------------------

  /** Edita texto/tipo de uma mensagem (não altera anexo). */
  editMessage(
    roomId: string,
    messageId: string,
    updates: Partial<Pick<ChatMessage, 'text' | 'type'>>,
  ): Observable<void> {
    const messageRef = doc(this.firestore, `rooms/${roomId}/messages/${messageId}`);

    const safeUpdates: { [key: string]: any } = {};
    if (typeof updates.text === 'string') safeUpdates['text'] = updates.text;
    if (updates.type) safeUpdates['type'] = updates.type;

    if (!Object.keys(safeUpdates).length) {
      return throwError(() => new Error('No editable fields provided'));
    }

    return from(updateDoc(messageRef, safeUpdates)).pipe(
      catchError((error) => {
        console.error('[FirestoreService] editMessage error', error);
        return throwError(() => error);
      }),
    );
    // Nota: regras do Firestore devem validar autoria/campos.
  }

  /** Apaga a mensagem. */
  deleteMessage(roomId: string, messageId: string): Observable<void> {
    const messageRef = doc(this.firestore, `rooms/${roomId}/messages/${messageId}`);
    return from(deleteDoc(messageRef)).pipe(
      catchError((error) => {
        console.error('[FirestoreService] deleteMessage error', error);
        return throwError(() => error);
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** Infere ChatMessage.type a partir de contentType de um arquivo (caso use externo). */
  private inferTypeFromFile(file?: File | null): ChatMessage['type'] {
    if (!file) return 'file';
    if (file.type && file.type.startsWith('image/')) return 'image';
    return 'file';
  }

  /**
   * Normaliza `createdAt` em Timestamp, para evitar edge cases
   * (cache offline, Date/millis).
   */
  normalizeCreatedAt(message: ChatMessage): ChatMessage {
    const createdAt = message.createdAt;

    if (createdAt instanceof Timestamp) return message;
    if (createdAt && typeof (createdAt as any).toDate === 'function') return message;

    if ((createdAt as unknown) instanceof Date) {
      return { ...message, createdAt: Timestamp.fromDate(createdAt) };
    }
    if (typeof createdAt === 'number') {
      return { ...message, createdAt: Timestamp.fromMillis(createdAt) };
    }
    return message;
  }
}
