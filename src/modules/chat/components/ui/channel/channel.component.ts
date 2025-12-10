import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallPanelComponent, ChatViewComponent } from '@modules-chat-domain/';

@Component({
  selector: 'app-dm',
  standalone: true,
  imports: [CallPanelComponent, ChatViewComponent],
  template: `
    <section class="dm-page">
      <header class="dm-page__header">
        <!-- room info / user info -->
        <h2>DM - {{ roomId }}</h2>
      </header>

      <main class="dm-page__body">
        <section class="dm-page__chat">
          <app-chat-view [roomId]="roomId" [pageSize]="pageSize"> </app-chat-view>
        </section>

        <aside class="dm-page__call">
          <app-call-panel></app-call-panel>
        </aside>
      </main>
    </section>
  `,
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  // TODO: Igor
  roomId = 'general';
  pageSize = 50;

  ngOnInit() {
    // Example: /dm/messages/:roomId
    this.route.paramMap.subscribe((params) => {
      const id = params.get('roomId');
      if (id) {
        this.roomId = id;
      }
    });
  }
}
