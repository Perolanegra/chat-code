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
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  doc,
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  ChatMessage,
  Pagination,
} from '../../modules/chat/interfaces/chat-message/chat-message.interface';
import { IFirestoreService } from '../../modules/chat/interfaces/firestore/firestore.interface';

export interface SendMessageOptions {
  type?: ChatMessage['type'];
  text?: string;
  senderId: string;
  // optional attachment file
  file?: File | null;
}

export interface PaginatedMessages {
  messages: ChatMessage[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService extends IFirestoreService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);

  /**
   * Reference to the messages subcollection of a given chat.
   *
   * Structure:
   *   chats/{chatId}/messages/{messageId}
   */
  private messagesCol(chatId: string): CollectionReference<DocumentData> {
    return collection(this.firestore, `chats/${chatId}/messages`);
  }

  // ---------------------------------------------------------------------------
  // Messages: list / paginate
  // ---------------------------------------------------------------------------

  /**
   * Load a page of messages for a given chat.
   *
   * - Ordered by createdAt (desc) for efficient querying.
   * - Uses limit + startAfter for pagination.
   *
   * Use the returned `lastDoc` as `pagination.startAfter` for the next page.
   */
  listMessages(chatId: string, pagination: Pagination = {}): Observable<PaginatedMessages> {
    const { limit: pageSize = 50, startAfter } = pagination;

    const colRef = this.messagesCol(chatId);

    const constraints: any[] = [orderBy('createdAt', 'desc'), fsLimit(pageSize)];
    if (startAfter) {
      constraints.push(fsStartAfter(startAfter));
    }

    const q = query(colRef, ...constraints);

    return from(getDocs(q)).pipe(
      map((snap) => {
        const messages: ChatMessage[] = snap.docs.map((d) => {
          const data = d.data() as ChatMessage;
          return {
            ...data,
            id: d.id,
          };
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

  // ---------------------------------------------------------------------------
  // Messages: send (text + attachment)
  // ---------------------------------------------------------------------------

  /**
   * Send a message.
   *
   * - If `file` is provided, uploads it to Storage and stores metadata in
   *   ChatMessage.attachment (URL, type, size, etc.).
   * - Uses serverTimestamp() for createdAt to support offline mode and
   *   proper server-time ordering.
   *
   * UI can create an optimistic local message with a "sending" status and
   * update based on success/error of this Observable.
   */
  sendMessage(chatId: string, options: SendMessageOptions): Observable<ChatMessage> {
    const { senderId, text, file } = options;

    if (!senderId) {
      return throwError(() => new Error('senderId is required'));
    }

    const type: ChatMessage['type'] =
      options.type ?? (file ? this.inferTypeFromFile(file) : 'text');

    const baseMessage: Partial<ChatMessage> = {
      type,
      text,
      senderId,
      createdAt: serverTimestamp(),
    };

    // No attachment: send simple text/file reference message.
    if (!file) {
      return from(addDoc(this.messagesCol(chatId), baseMessage as ChatMessage)).pipe(
        map((ref) => ({
          ...(baseMessage as ChatMessage),
          id: ref.id,
        })),
        catchError((error) => {
          console.error('[FirestoreService] sendMessage (no file) error', error);
          return throwError(() => error);
        }),
      );
    }

    // With attachment: upload to Storage first, then create Firestore doc.
    const storagePath = this.buildAttachmentPath(chatId, senderId, file);
    const storageRef = ref(this.storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Observable<ChatMessage>((observer) => {
      uploadTask.on(
        'state_changed',
        // progress callback (can be exposed in future if needed)
        () => {},
        (error) => {
          console.error('[FirestoreService] upload error', error);
          observer.error(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const messagePayload: ChatMessage = {
              ...(baseMessage as ChatMessage),
              attachment: {
                name: file.name,
                path: storagePath,
                contentType: file.type,
                size: file.size,
                downloadURL,
              },
            };

            const refDoc = await addDoc(this.messagesCol(chatId), messagePayload);

            observer.next({
              ...messagePayload,
              id: refDoc.id,
            });
            observer.complete();
          } catch (err) {
            console.error('[FirestoreService] sendMessage (with attachment) error', err);
            observer.error(err);
          }
        },
      );
    });
  }

  // ---------------------------------------------------------------------------
  // Messages: edit / delete
  // ---------------------------------------------------------------------------

  /**
   * Edit an existing message's text and/or type.
   * Does not modify attachment by design (can be extended later).
   */
  editMessage(
    chatId: string,
    messageId: string,
    updates: Partial<Pick<ChatMessage, 'text' | 'type'>>,
  ): Observable<void> {
    const messageRef = doc(this.firestore, `chats/${chatId}/messages/${messageId}`);

    const safeUpdates: { [key: string]: any } = {};
    if (typeof updates.text === 'string') {
      safeUpdates['text'] = updates.text;
    }

    if (updates.type) {
      safeUpdates['type'] = updates.type;
    }

    if (!Object.keys(safeUpdates).length) {
      return throwError(() => new Error('No editable fields provided'));
    }

    return from(updateDoc(messageRef, safeUpdates as { [x: string]: any })).pipe(
      catchError((error) => {
        console.error('[FirestoreService] editMessage error', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Delete a message.
   * (Note: does not delete the attachment file from Storage; that can be added
   * as a follow-up if required.)
   */
  deleteMessage(chatId: string, messageId: string): Observable<void> {
    const messageRef = doc(this.firestore, `chats/${chatId}/messages/${messageId}`);

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

  /**
   * Build a deterministic storage path for attachments.
   * Example:
   *   chats/{chatId}/{senderId}/{timestamp}-{rand}.{ext}
   */
  private buildAttachmentPath(chatId: string, senderId: string, file: File): string {
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `chats/${chatId}/${senderId}/${timestamp}-${random}.${ext}`;
  }

  /**
   * Guess ChatMessage.type from the File's contentType.
   */
  private inferTypeFromFile(file: File | null | undefined): ChatMessage['type'] {
    if (!file) {
      return 'file';
    }
    if (file.type && file.type.startsWith('image/')) {
      return 'image';
    }
    return 'file';
  }

  /**
   * Sometimes createdAt might not be a Firestore Timestamp (e.g., offline cache,
   * or a Date/millis). This helper allows callers to normalize it if needed.
   */
  normalizeCreatedAt(message: ChatMessage): ChatMessage {
    const createdAt = message.createdAt;

    if (createdAt instanceof Timestamp) {
      return message;
    }

    if (createdAt && typeof (createdAt as any).toDate === 'function') {
      return message;
    }

    if (createdAt instanceof Date) {
      return {
        ...message,
        createdAt: Timestamp.fromDate(createdAt),
      };
    }

    if (typeof createdAt === 'number') {
      return {
        ...message,
        createdAt: Timestamp.fromMillis(createdAt),
      };
    }

    return message;
  }
}
