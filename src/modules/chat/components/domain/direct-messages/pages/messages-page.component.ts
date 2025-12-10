import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  NgForOf,
  NgIf,
  NgClass,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  SlicePipe,
  UpperCasePipe,
  DecimalPipe,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FirestoreService, PaginatedMessages, SendMessageOptions } from '../../../../../../services/core/firestore.service';
import { ChatMessage, Pagination } from '../../../../interfaces/chat-message/chat-message.interface';

@Component({
  selector: 'app-messages-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    SlicePipe,
    UpperCasePipe,
    DecimalPipe,
    FormsModule,
    MatIconModule,
  ],
  template: `
    <section class="dm-page">
      <!-- Header -->
      <header class="dm-page__header">
        <div class="dm-page__header-left">
          <mat-icon class="dm-page__header-icon">alternate_email</mat-icon>
          <div class="dm-page__header-text">
            <h1 class="dm-page__header-title">Direct Messages</h1>
            <p class="dm-page__header-subtitle">
              Simple demo chat wired to FirestoreService (local fake chat id:
              <code>{{ chatId }}</code
              >)
            </p>
          </div>
        </div>
      </header>

      <!-- Messages list -->
      <section class="dm-page__messages" *ngIf="messages.length; else emptyState">
        <div
          class="dm-page__message"
          *ngFor="let message of messages; trackBy: trackByMessageId"
          [ngClass]="{
            'dm-page__message--self': message.senderId === currentUserId,
          }"
        >
          <div class="dm-page__message-avatar">
            <span>{{ message.senderId | slice: 0 : 2 | uppercase }}</span>
          </div>

          <div class="dm-page__message-body">
            <header class="dm-page__message-header">
              <span class="dm-page__message-sender">
                {{ message.senderId === currentUserId ? 'You' : message.senderId }}
              </span>
              <span class="dm-page__message-time">
                {{ formatCreatedAt(message) }}
              </span>
            </header>

            <div class="dm-page__message-content">
              <ng-container [ngSwitch]="message.type">
                <p *ngSwitchCase="'text'">
                  {{ message.text }}
                </p>

                <div *ngSwitchCase="'image'" class="dm-page__attachment dm-page__attachment--image">
                  <img
                    *ngIf="message.attachment?.downloadURL as url"
                    [src]="url"
                    [alt]="message.attachment?.name || 'Image'"
                  />
                  <p *ngIf="message.text" class="dm-page__attachment-caption">
                    {{ message.text }}
                  </p>
                </div>

                <div *ngSwitchDefault class="dm-page__attachment dm-page__attachment--file">
                  <mat-icon class="dm-page__attachment-icon">attach_file</mat-icon>
                  <a
                    *ngIf="message.attachment?.downloadURL as url"
                    [href]="url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="dm-page__attachment-link"
                  >
                    {{ message.attachment?.name || 'Download file' }}
                  </a>
                  <span class="dm-page__attachment-meta" *ngIf="message.attachment?.size as size">
                    • {{ size | number }} bytes
                  </span>
                </div>
              </ng-container>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="dm-page__load-more"
          (click)="loadNextPage()"
          *ngIf="hasMore && !loading"
        >
          Load older messages
        </button>
      </section>

      <ng-template #emptyState>
        <section class="dm-page__empty">
          <div class="dm-page__empty-icon">💬</div>
          <h2 class="dm-page__empty-title">No messages yet</h2>
          <p class="dm-page__empty-text">
            Start the conversation by sending the first message below.
          </p>
        </section>
      </ng-template>

      <!-- Composer -->
      <footer class="dm-page__composer">
        <form (ngSubmit)="onSendMessage()" class="dm-page__composer-form">
          <button
            type="button"
            class="dm-page__icon-button dm-page__icon-button--left"
            title="Attachment (not wired in this demo)"
            disabled
          >
            <mat-icon>attach_file</mat-icon>
          </button>

          <input
            type="text"
            class="dm-page__input"
            placeholder="Message @DemoFriend"
            [(ngModel)]="draft"
            name="draft"
            autocomplete="off"
          />

          <button
            class="dm-page__icon-button dm-page__icon-button--send"
            type="submit"
            [disabled]="sending || !draft.trim()"
          >
            <mat-icon *ngIf="!sending">send</mat-icon>
            <mat-icon *ngIf="sending">hourglass_empty</mat-icon>
          </button>
        </form>
      </footer>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .dm-page {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: #313338;
        color: #f2f3f5;
        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif;
      }

      /* Header */
      .dm-page__header {
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.35);
        background-color: #313338;
        display: flex;
        align-items: center;
      }

      .dm-page__header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .dm-page__header-icon {
        font-size: 22px;
        color: #b5bac1;
      }

      .dm-page__header-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .dm-page__header-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .dm-page__header-subtitle {
        margin: 0;
        font-size: 12px;
        color: #949ba4;
      }

      /* Messages list */
      .dm-page__messages {
        flex: 1 1 auto;
        min-height: 0;
        padding: 8px 16px 8px 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column-reverse;
        gap: 8px;
      }

      .dm-page__message {
        display: flex;
        gap: 10px;
        padding: 4px 0;
      }

      .dm-page__message--self .dm-page__message-sender {
        color: #23a559;
      }

      .dm-page__message-avatar {
        flex: 0 0 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #2b2d31;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: #dbdee1;
      }

      .dm-page__message-body {
        flex: 1 1 auto;
        min-width: 0;
      }

      .dm-page__message-header {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 2px;
      }

      .dm-page__message-sender {
        font-weight: 600;
        font-size: 13px;
      }

      .dm-page__message-time {
        font-size: 11px;
        color: #949ba4;
      }

      .dm-page__message-content {
        font-size: 14px;
        line-height: 1.3;
        word-wrap: break-word;
        white-space: pre-wrap;
      }

      /* Attachments */
      .dm-page__attachment {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        border-radius: 4px;
        background-color: #2b2d31;
      }

      .dm-page__attachment--image {
        padding: 0;
        background: none;
        flex-direction: column;
        align-items: flex-start;
      }

      .dm-page__attachment--image img {
        max-width: 280px;
        border-radius: 8px;
        display: block;
      }

      .dm-page__attachment-caption {
        margin: 4px 0 0 0;
        font-size: 13px;
      }

      .dm-page__attachment-icon {
        font-size: 18px;
      }

      .dm-page__attachment-link {
        color: #00a8fc;
        text-decoration: none;
        font-size: 13px;
      }

      .dm-page__attachment-link:hover {
        text-decoration: underline;
      }

      .dm-page__attachment-meta {
        font-size: 11px;
        color: #949ba4;
      }

      /* Empty state */
      .dm-page__empty {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 8px;
        padding: 16px;
      }

      .dm-page__empty-icon {
        font-size: 32px;
      }

      .dm-page__empty-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .dm-page__empty-text {
        margin: 0;
        max-width: 420px;
        font-size: 13px;
        color: #b5bac1;
      }

      /* Load more */
      .dm-page__load-more {
        align-self: center;
        margin: 8px 0 4px;
        padding: 4px 10px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-size: 12px;
        color: #dbdee1;
        background-color: #2b2d31;
      }

      .dm-page__load-more:hover {
        background-color: #383a40;
      }

      /* Composer */
      .dm-page__composer {
        padding: 10px 16px;
        border-top: 1px solid rgba(0, 0, 0, 0.35);
        background-color: #313338;
      }

      .dm-page__composer-form {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #383a40;
        border-radius: 8px;
        padding: 6px 8px;
      }

      .dm-page__input {
        flex: 1 1 auto;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        color: #f2f3f5;
        font-size: 14px;
      }

      .dm-page__input::placeholder {
        color: #949ba4;
      }

      .dm-page__icon-button {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: #b5bac1;
        cursor: pointer;
      }

      .dm-page__icon-button--left {
        opacity: 0.4;
        cursor: default;
      }

      .dm-page__icon-button--send:not(:disabled):hover {
        background-color: #1e1f22;
      }

      .dm-page__icon-button:disabled {
        opacity: 0.5;
        cursor: default;
      }

      @media (max-width: 768px) {
        .dm-page__header-subtitle {
          display: none;
        }

        .dm-page__messages {
          padding-inline: 8px;
        }

        .dm-page__composer {
          padding-inline: 8px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesPageComponent {
  readonly chatId = 'demo-chat';
  readonly currentUserId = 'user-123';

  private readonly firestoreService = inject(FirestoreService);

  messages: ChatMessage[] = [];
  lastDoc: PaginatedMessages['lastDoc'] = null;
  hasMore = false;
  loading = false;
  sending = false;

  draft = '';

  constructor() {
    this.loadFirstPage();
  }

  loadFirstPage(): void {
    this.loading = true;

    const pagination: Pagination = { limit: 20 };

    this.firestoreService.listMessages(this.chatId, pagination).subscribe({
      next: ({ messages, lastDoc }) => {
        this.messages = messages;
        this.lastDoc = lastDoc;
        this.hasMore = !!lastDoc;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadNextPage(): void {
    if (!this.lastDoc || this.loading) {
      return;
    }

    this.loading = true;

    const pagination: Pagination = {
      limit: 20,
      startAfter: this.lastDoc,
    };

    this.firestoreService.listMessages(this.chatId, pagination).subscribe({
      next: ({ messages, lastDoc }) => {
        this.messages = [...this.messages, ...messages];
        this.lastDoc = lastDoc;
        this.hasMore = !!lastDoc;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSendMessage(): void {
    const text = this.draft.trim();
    if (!text || this.sending) {
      return;
    }

    this.sending = true;

    const options: SendMessageOptions = {
      senderId: this.currentUserId,
      text,
      type: 'text',
    };

    this.firestoreService.sendMessage(this.chatId, options).subscribe({
      next: (saved) => {
        this.messages = [saved, ...this.messages];
        this.draft = '';
        this.sending = false;
      },
      error: () => {
        this.sending = false;
      },
    });
  }

  trackByMessageId(_index: number, message: ChatMessage): string {
    return message.id || `${message.senderId}-${message.createdAt}`;
  }

  formatCreatedAt(message: ChatMessage): string {
    const createdAt = message.createdAt as any;

    try {
      if (createdAt?.toDate) {
        const d: Date = createdAt.toDate();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      if (createdAt instanceof Date) {
        return createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      if (typeof createdAt === 'number') {
        const d = new Date(createdAt);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    } catch {
      // ignore parsing issues, fall through
    }

    return '';
  }
}
