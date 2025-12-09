import { Timestamp } from '@angular/fire/firestore';


export type MessageType = 'text' | 'image' | 'file';

export interface ChatMessage {
  id?: string;
  roomId: string;           // 🔗 relacionamento explícito
  type: MessageType;
  text?: string;
  senderId: string;
  createdAt: Timestamp;     // use o tipo concreto de Firestore
  attachment?: {
    name: string;
    path: string;
    contentType: string;
    size: number;
    downloadURL: string;
  };
}
export interface Pagination {
  limit?: number; // default 50
  startAfter?: any | null; // last doc from previous page
}


