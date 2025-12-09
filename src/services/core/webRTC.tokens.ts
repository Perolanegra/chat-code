
import { InjectionToken } from '@angular/core';

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

export const WEBRTC_CONFIG = new InjectionToken<WebRTCConfig>('WEBRTC_CONFIG');
