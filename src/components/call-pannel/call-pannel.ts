
import { Component, inject } from '@angular/core';
import { WebRTCService } from '../../services/core/webRTC.service';
import { WebRTCConfig, WEBRTC_CONFIG } from '../../services/core/webRTC.tokens';
@Component({
  selector: 'app-call-panel',
  standalone: true,
  template: `<!-- botões e vídeos -->`,
})
export class CallPanelComponent {
  private readonly webrtc = inject(WebRTCService);
  private readonly cfg: WebRTCConfig = inject(WEBRTC_CONFIG);

  async startCaller(roomId: string) {
    const localStream = await this.webrtc.getMedia({ audio: true, video: true });
    const result = await this.webrtc.startCall(
      { roomId, localStream, role: 'caller' },
      this.cfg,                     // 🔁 usa o provider injetado
    );
    // … lidar com remoteStream/pc/unsub
  }
}
