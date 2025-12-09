import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';

interface ChannelMessage {
  id: number;
  author: string;
  avatarColor: string;
  time: string;
  content: string;
  isOwn?: boolean;
}

@Component({
  selector: 'app-channel-page',
  standalone: true,
  imports: [UpperCasePipe, NgForOf],
  template: `
    <section class="channel">
      <!-- Header -->
      <header class="channel__header">
        <div class="channel__title-row">
          <span class="channel__hash">#</span>
          <div class="channel__titles">
            <h1 class="channel__name">general</h1>
            <p class="channel__topic">
              This is a placeholder channel view. Replace this with your real server channel
              implementation.
            </p>
          </div>
        </div>

        <div class="channel__header-actions">
          <button
            type="button"
            class="channel__icon-button channel__icon-button--muted"
            aria-label="Search (placeholder)"
          >
            🔍
          </button>
          <button type="button" class="channel__icon-button" aria-label="Members (placeholder)">
            👥
          </button>
        </div>
      </header>

      <!-- Body: messages list + input -->
      <div class="channel__body">
        <!-- Scrollable messages -->
        <main class="channel__messages" aria-label="Channel messages">
          <div class="channel__day-divider">
            <span class="channel__day-divider-line"></span>
            <span class="channel__day-divider-label">Today</span>
            <span class="channel__day-divider-line"></span>
          </div>

          <article
            class="channel__message"
            *ngFor="let message of messages"
            [class.channel__message--own]="message.isOwn"
          >
            <div class="channel__avatar" [style.backgroundColor]="message.avatarColor">
              <span class="channel__avatar-initial">
                {{ message.author[0] | uppercase }}
              </span>
            </div>

            <div class="channel__message-main">
              <header class="channel__message-header">
                <span class="channel__author">{{ message.author }}</span>
                <span class="channel__timestamp">{{ message.time }}</span>
              </header>

              <p class="channel__content">
                {{ message.content }}
              </p>
            </div>
          </article>

          <div class="channel__empty-hint">
            <p class="channel__empty-title">You're viewing a static mock channel</p>
            <p class="channel__empty-text">
              When you connect this view to your real data, replace the
              <code>messages</code> array in <code>ChannelPageComponent</code> with messages from
              your API or state store.
            </p>
          </div>
        </main>

        <!-- Input row -->
        <footer class="channel__input-wrapper">
          <div class="channel__input-row">
            <button
              type="button"
              class="channel__input-icon"
              aria-label="Upload file (placeholder)"
            >
              ＋
            </button>

            <input
              type="text"
              class="channel__input"
              placeholder="Message #general (placeholder input)"
              disabled
              aria-disabled="true"
            />

            <button
              type="button"
              class="channel__input-icon"
              aria-label="Emoji picker (placeholder)"
            >
              🙂
            </button>
          </div>

          <p class="channel__input-hint">
            This input is disabled because the channel is only a layout placeholder.
          </p>
        </footer>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .channel {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: #313338;
        color: #f2f3f5;
        font-family: var(
          --mat-app-font-family,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif
        );
      }

      /* Header */

      .channel__header {
        flex: 0 0 auto;
        padding: 8px 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
        background-color: #313338;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .channel__title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .channel__hash {
        font-size: 18px;
        color: #949ba4;
      }

      .channel__titles {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .channel__name {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .channel__topic {
        margin: 0;
        margin-top: 2px;
        font-size: 12px;
        color: #b5bac1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .channel__header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .channel__icon-button {
        width: 28px;
        height: 28px;
        border-radius: 4px;
        border: none;
        padding: 0;
        background-color: #2b2d31;
        color: #dbdee1;
        cursor: default;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
      }

      .channel__icon-button--muted {
        opacity: 0.5;
      }

      /* Body layout */

      .channel__body {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .channel__messages {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 16px 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      /* Day divider */

      .channel__day-divider {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 8px 8px;
        color: #949ba4;
        font-size: 12px;
      }

      .channel__day-divider-line {
        flex: 1 1 auto;
        height: 1px;
        background-color: rgba(148, 155, 164, 0.4);
      }

      .channel__day-divider-label {
        flex: 0 0 auto;
        white-space: nowrap;
      }

      /* Messages */

      .channel__message {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 4px 8px;
        border-radius: 4px;
      }

      .channel__message:hover {
        background-color: rgba(79, 84, 92, 0.15);
      }

      .channel__message--own .channel__author {
        color: #23a55a;
      }

      .channel__avatar {
        flex: 0 0 auto;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #5865f2;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
      }

      .channel__avatar-initial {
        font-weight: 600;
        font-size: 16px;
      }

      .channel__message-main {
        flex: 1 1 auto;
        min-width: 0;
      }

      .channel__message-header {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .channel__author {
        font-size: 14px;
        font-weight: 500;
      }

      .channel__timestamp {
        font-size: 11px;
        color: #949ba4;
      }

      .channel__content {
        margin: 2px 0 0;
        font-size: 14px;
        color: #dbdee1;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .channel__empty-hint {
        margin-top: 16px;
        padding: 12px 12px 14px;
        border-radius: 8px;
        background-color: #2b2d31;
        border: 1px solid rgba(88, 101, 242, 0.4);
        max-width: 520px;
        align-self: center;
        text-align: left;
      }

      .channel__empty-title {
        margin: 0 0 4px;
        font-size: 14px;
        font-weight: 600;
      }

      .channel__empty-text {
        margin: 0;
        font-size: 12px;
        color: #b5bac1;
      }

      /* Input */

      .channel__input-wrapper {
        flex: 0 0 auto;
        padding: 0 16px 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .channel__input-row {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #383a40;
        border-radius: 8px;
        padding: 8px 10px;
        border: 1px solid rgba(0, 0, 0, 0.5);
      }

      .channel__input-icon {
        border: none;
        background: transparent;
        color: #b5bac1;
        font-size: 16px;
        width: 26px;
        height: 26px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        cursor: default;
        opacity: 0.7;
      }

      .channel__input {
        flex: 1 1 auto;
        border: none;
        outline: none;
        background: transparent;
        color: #f2f3f5;
        font-size: 14px;
      }

      .channel__input::placeholder {
        color: #6d727b;
      }

      .channel__input:disabled {
        cursor: not-allowed;
      }

      .channel__input-hint {
        margin: 0;
        font-size: 11px;
        color: #a6abb4;
      }

      /* Responsive tweaks */

      @media (max-width: 640px) {
        .channel__header {
          padding: 8px;
        }

        .channel__messages {
          padding: 12px 8px 8px;
        }

        .channel__input-wrapper {
          padding: 0 8px 12px;
        }
      }
    `,
  ],
})
export class ChannelPageComponent {
  // Static sample messages for layout/demo.
  messages: ChannelMessage[] = [
    {
      id: 1,
      author: 'DreamBot',
      avatarColor: '#5865F2',
      time: 'Today at 10:12 AM',
      content:
        'Welcome to #general! This is a static placeholder channel used to develop the layout.',
    },
    {
      id: 2,
      author: 'civi',
      avatarColor: '#F5A623',
      time: 'Today at 10:15 AM',
      content:
        "Once your backend is wired up, you'll be able to load real messages here from your API.",
    },
    {
      id: 3,
      author: 'You',
      avatarColor: '#23A55A',
      time: 'Today at 10:17 AM',
      content:
        'For now, this mock helps validate spacing, typography, and scroll behavior for the channel view.',
      isOwn: true,
    },
  ];
}
