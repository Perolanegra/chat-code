export interface ChatMessage {
  id?: string;
  type: 'text' | 'image' | 'file';
  text?: string;
  senderId: string;
  createdAt: any; // firestore Timestamp | serverTimestamp()
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
