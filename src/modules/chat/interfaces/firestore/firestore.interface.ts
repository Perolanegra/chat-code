import type { Timestamp } from '@angular/fire/firestore'; // reexporta do SDK

export interface Room {
  id?: string;              // útil na UI
  name: string;
  members: string[];        // uids
  createdAt: Timestamp;
}

export type PresenceStatus = 'online' | 'typing' | 'in-call';

export interface PresenceDoc {
  id?: string;              // = userId na subcoleção
  roomId: string;           // 🔗 relacionamento explícito
  status: PresenceStatus;
  updatedAt: Timestamp;
}

export interface WebRTCOfferDoc {
  sdp: string;
  type: 'offer';
  createdAt: Timestamp;
  from?: string;     // opcional: quem publicou
}

export interface WebRTCAnswerDoc {
  sdp: string;
  type: 'answer';
  createdAt: Timestamp;
  from?: string;
}

export interface WebRTCIceCandidateDoc {
  candidate: RTCIceCandidateInit; // estrutura ICE do browser
  createdAt: Timestamp;
  from?: string;
}
