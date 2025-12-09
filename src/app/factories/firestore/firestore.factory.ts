
import { serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { ChatMessage } from '../../../modules/chat/interfaces/chat-message/chat-message.interface';

export function makeTextMessage(roomId: string, senderId: string, text: string): ChatMessage {
  return {
    roomId,
    type: 'text',
    text,
    senderId,
    createdAt: serverTimestamp() as unknown as Timestamp, // cast porque serverTimestamp retorna FieldValue
  };
}

export function makeAttachmentMessage(
  roomId: string, senderId: string, meta: ChatMessage['attachment'], type: 'image'|'file',
): ChatMessage {
  return {
    roomId,
    type,
    senderId,
    createdAt: serverTimestamp() as unknown as Timestamp,
    attachment: meta,
  };
}
