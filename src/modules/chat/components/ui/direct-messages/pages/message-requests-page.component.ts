import { Component } from '@angular/core';

@Component({
  selector: 'app-message-requests-page',
  standalone: true,
  template: `
    <section class="message-requests-page">
      <!-- Header -->
      <header class="message-requests-page__header">
        <div class="message-requests-page__title-row">
          <span class="message-requests-page__icon">📥</span>
          <h1 class="message-requests-page__title">Message Requests</h1>
        </div>
        <p class="message-requests-page__subtitle">
          This is a placeholder layout for your message requests. When other users send
          you messages from outside your friends list, they'll appear here.
        </p>
      </header>

      <!-- Body -->
      <div class="message-requests-page__body">
        <aside class="message-requests-page__sidebar" aria-label="Filters">
          <button
            class="message-requests-page__filter message-requests-page__filter--active"
            type="button"
          >
            All Requests
          </button>
          <button class="message-requests-page__filter" type="button">
            From Servers
          </button>
          <button class="message-requests-page__filter" type="button">
            Direct
          </button>
        </aside>

        <section
          class="message-requests-page__content"
          aria-label="Message requests list"
        >
          <div class="message-requests-page__section-header">
            <span class="message-requests-page__section-title">
              MESSAGE REQUESTS — 0
            </span>
          </div>

          <div class="message-requests-page__empty-state">
            <div class="message-requests-page__empty-icon">✨</div>
            <h2 class="message-requests-page__empty-title">
              You're all caught up
            </h2>
            <p class="message-requests-page__empty-description">
              When you have new requests, they’ll show up here with options to accept,
              ignore, or block. For now, this page only provides a static placeholder
              similar to Discord’s message requests view.
            </p>
          </div>
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .message-requests-page {
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
      .message-requests-page__header {
        flex: 0 0 auto;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
        background-color: #313338;
        z-index: 1;
      }

      .message-requests-page__title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .message-requests-page__icon {
        font-size: 18px;
      }

      .message-requests-page__title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .message-requests-page__subtitle {
        margin: 0;
        margin-top: 2px;
        font-size: 13px;
        color: #b5bac1;
      }

      /* Body layout */
      .message-requests-page__body {
        display: grid;
        grid-template-columns: 220px minmax(0, 1fr);
        flex: 1 1 auto;
        min-height: 0;
      }

      /* Sidebar filters */
      .message-requests-page__sidebar {
        display: flex;
        flex-direction: column;
        padding: 16px 8px;
        border-right: 1px solid rgba(0, 0, 0, 0.4);
        background-color: #2b2d31;
        gap: 4px;
      }

      .message-requests-page__filter {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 8px 10px;
        border-radius: 4px;
        border: none;
        background: transparent;
        color: #b5bac1;
        font-size: 14px;
        text-align: left;
        cursor: pointer;
        transition:
          background-color 120ms ease-out,
          color 120ms ease-out;
      }

      .message-requests-page__filter--active {
        background-color: #3f4248;
        color: #ffffff;
      }

      .message-requests-page__filter:not(
          .message-requests-page__filter--active
        ):hover {
        background-color: #35373c;
        color: #dbdee1;
      }

      /* Content area */
      .message-requests-page__content {
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .message-requests-page__section-header {
        flex: 0 0 auto;
        margin-bottom: 12px;
      }

      .message-requests-page__section-title {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: #949ba4;
      }

      /* Empty state */
      .message-requests-page__empty-state {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 12px;
        padding: 16px;
      }

      .message-requests-page__empty-icon {
        font-size: 40px;
      }

      .message-requests-page__empty-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #f2f3f5;
      }

      .message-requests-page__empty-description {
        margin: 0;
        max-width: 420px;
        font-size: 14px;
        color: #b5bac1;
      }

      /* Responsive tweaks */
      @media (max-width: 900px) {
        .message-requests-page__body {
          grid-template-columns: 200px minmax(0, 1fr);
        }
      }

      @media (max-width: 700px) {
        .message-requests-page__body {
          grid-template-columns: minmax(0, 1fr);
        }

        .message-requests-page__sidebar {
          display: none;
        }
      }
    `,
  ],
})
export class MessageRequestsPageComponent {}
