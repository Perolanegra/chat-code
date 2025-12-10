import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebRTCService } from '../../../../../services/core/webRTC.service';
import { WebRTCConfig, WEBRTC_CONFIG } from '../../../../../services/core/webRTC.tokens';

@Component({
  selector: 'app-call-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="call-panel">
      <header class="call-panel__header">
        <h3>Voice / Video Call</h3>
        <span class="call-panel__room" *ngIf="roomId">Room: {{ roomId }}</span>
      </header>

      <section class="call-panel__videos">
        <div class="call-panel__video-container">
          <span class="call-panel__label">You</span>
          <video
            #localVideo
            class="call-panel__video call-panel__video--local"
            autoplay
            playsinline
            muted
          ></video>
        </div>

        <div class="call-panel__video-container">
          <span class="call-panel__label">Remote</span>
          <video
            #remoteVideo
            class="call-panel__video call-panel__video--remote"
            autoplay
            playsinline
          ></video>
        </div>
      </section>

      <footer class="call-panel__controls">
        <button
          type="button"
          class="call-panel__btn call-panel__btn--primary"
          (click)="handleStartCall(localVideo, remoteVideo)"
          [disabled]="inCall || loading || !roomId"
        >
          {{ inCall ? 'In Call' : 'Start Call' }}
        </button>

        <button
          type="button"
          class="call-panel__btn call-panel__btn--danger"
          (click)="handleEndCall(localVideo, remoteVideo)"
          [disabled]="!inCall"
        >
          End Call
        </button>

        <span class="call-panel__status" *ngIf="status">
          {{ status }}
        </span>
      </footer>
    </section>
  `,
  styles: [
    `
      .call-panel {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem;
        background-color: #1e1f22;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: #f2f3f5;
        font-size: 0.875rem;
      }

      .call-panel__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .call-panel__room {
        opacity: 0.75;
        font-size: 0.75rem;
      }

      .call-panel__videos {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.5rem;
      }

      .call-panel__video-container {
        position: relative;
        background-color: #2b2d31;
        border-radius: 6px;
        overflow: hidden;
        min-height: 120px;
      }

      .call-panel__label {
        position: absolute;
        top: 4px;
        left: 6px;
        padding: 2px 6px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      .call-panel__video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: #000;
      }

      .call-panel__controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.25rem;
      }

      .call-panel__btn {
        padding: 0.35rem 0.9rem;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .call-panel__btn--primary {
        background-color: #5865f2;
        color: #fff;
      }

      .call-panel__btn--primary[disabled] {
        background-color: rgba(88, 101, 242, 0.4);
        cursor: default;
      }

      .call-panel__btn--danger {
        background-color: #d83c3e;
        color: #fff;
      }

      .call-panel__btn--danger[disabled] {
        background-color: rgba(216, 60, 62, 0.4);
        cursor: default;
      }

      .call-panel__status {
        margin-left: auto;
        opacity: 0.8;
        font-size: 0.75rem;
      }
    `,
  ],
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

      const { remoteStream, unsub } = await this.webrtc.startCall(
        { roomId: this.roomId, localStream, role: 'caller' },
        this.cfg,
      );

      remoteVideo.srcObject = remoteStream;
      this.inCall = true;
      this.status = 'In call';

      // Keep reference to unsub if you want to react to signalling events
      this.cleanupSub = new Subscription();
      this.cleanupSub.add({ unsubscribe: unsub } as any);
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
