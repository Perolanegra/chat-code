import { NgForOf } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../../../interfaces/chat-message/chat-message.interface';
import { FirestoreService } from '../../../../../core/firestore.service';

@Component({
  selector: 'app-chat-view',
  imports: [NgForOf],
  styleUrls: ['./chat-view.component.scss'],
  template: `
    <button (click)="loadMore()" [disabled]="loadingMore">Carregar mais</button>

    <ng-container *ngFor="let msg of history; trackBy: trackById">
      <div class="message">{{ render(msg) }}</div>
    </ng-container>

    <ng-container *ngFor="let msg of live; trackBy: trackById">
      <div class="message live">{{ render(msg) }}</div>
    </ng-container>
  `,
  standalone: true,
})
export class ChatViewComponent implements OnInit, OnDestroy {
  private readonly fs = inject(FirestoreService);

  @Input() roomId = 'general'; // 🔁 default, but can be overridden
  @Input() pageSize = 50;

  live: ChatMessage[] = [];
  history: ChatMessage[] = [];
  lastDoc: any = null;
  loadingMore = false;

  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.fs
      .listenLiveMessages(this.roomId, this.pageSize)
      .subscribe((msgs) => (this.live = msgs));

    this.fs
      .listMessages(this.roomId, { limit: this.pageSize })
      .subscribe(({ messages, lastDoc }) => {
        this.history = messages;
        this.lastDoc = lastDoc;
      });
  }

  async loadMore() {
    /* same as your current code */
  }

  trackById(_: number, msg: ChatMessage) {
    return msg.id;
  }
  render(msg: ChatMessage) {
    return msg.type === 'text' ? msg.text : `[${msg.type}]`;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
