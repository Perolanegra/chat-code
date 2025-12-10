import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebRTCConfig, WebRTCService } from '@core/app/webrtc.service';
import { WEBRTC_CONFIG } from '@core/app/webrtc.tokens';

@Component({
  selector: 'app-call-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './call-pannel.component.html',
  styleUrls: ['./call-pannel.component.scss'],
})
export class CallPanelComponent implements OnDestroy {
  private readonly webrtc = inject(WebRTCService);
  private readonly cfg: WebRTCConfig = inject(WEBRTC_CONFIG);

  @Input() roomId = '';

  inCall = false;
  loading = false;
  status = '';

  private cleanupSub?: Subscription;
  private localStream?: MediaStream;

  async handleStartCall(localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    if (!this.roomId || this.inCall || this.loading) {
      return;
    }

    this.loading = true;
    this.status = 'Starting call…';

    try {
      const localStream = await this.webrtc.getMedia({ audio: true, video: true });
      this.localStream = localStream;

      // Attach local stream to video element
      localVideo.srcObject = localStream;

      const { remoteStream, unsubscribeAnswer, unsubscribeRemoteCandidates } =
        await this.webrtc.startCall({ roomId: this.roomId, localStream, role: 'caller' }, this.cfg);

      remoteVideo.srcObject = remoteStream;
      this.inCall = true;
      this.status = 'In call';

      // Keep reference to unsub if you want to react to signalling events
      this.cleanupSub = new Subscription();
      this.cleanupSub.add({ unsubscribe: unsubscribeAnswer } as any);
      this.cleanupSub.add({ unsubscribe: unsubscribeRemoteCandidates } as any);
    } catch (err: any) {
      this.status = 'Failed to start call';
      console.error('Error starting call', err);
    } finally {
      this.loading = false;
    }
  }

  handleEndCall(localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    if (!this.inCall) return;

    this.status = 'Call ended';
    this.inCall = false;

    // Stop local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = undefined;
    }

    // Clear video elements
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    // Cleanup signalling / listeners
    this.cleanupSub?.unsubscribe();
    this.cleanupSub = undefined;

    // If WebRTCService exposes explicit close/cleanup, call it here as well.
  }

  ngOnDestroy() {
    this.cleanupSub?.unsubscribe();
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
    }
  }
}
