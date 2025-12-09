import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-friends-page',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <section class="friends">
      <!-- Top header card (Friends, filters, Add Friend) -->
      <header class="friends__header-card">
        <div class="friends__header-left">
          <mat-icon>emoji_people</mat-icon>
          <h1 class="friends__header-title">Friends</h1>
        </div>

        <nav class="friends__header-filters" aria-label="Friend filters">
          <button class="friends__chip friends__chip--active" type="button">Online</button>
          <button class="friends__chip" type="button">All</button>
          <button class="friends__chip" type="button">Pending</button>
          <button class="friends__chip" type="button">Blocked</button>
          <button class="friends__chip friends__chip--primary" type="button">Add Friend</button>
        </nav>
      </header>

      <!-- Main friends card -->
      <section class="friends__card" aria-label="Friends list">
        <!-- Search row -->
        <div class="friends__search-row">
          <div class="friends__search-input" aria-label="Search friends or conversations">
            <span class="friends__search-icon">🔍</span>
            <span class="friends__search-placeholder">Search</span>
          </div>
        </div>

        <!-- Online section label -->
        <header class="friends__section-header">
          <span class="friends__section-label">ONLINE — 0</span>
        </header>

        <!-- Empty state -->
        <div class="friends__empty">
          <div class="friends__empty-icon">✨</div>
          <h2 class="friends__empty-title">No one's around to play with right now...</h2>
          <p class="friends__empty-text">
            When your friends are online, you'll see them here. For now this is only a placeholder
            layout that mimics Discord's friends screen.
          </p>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .friends {
        display: flex;
        flex-direction: column;
        height: 100%;
        color: #f2f3f5;
        background-color: #313338;
        font-family: var(
          --mat-app-font-family,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif
        );
      }

      /* Header card */
      .friends__header-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 16px;
        margin: 8px 16px 4px 16px;
        border-radius: 8px;
        background-color: #313338;
        box-shadow: 0 0 0 1.4px rgba(0, 0, 0, 0.2);
        border-bottom: 0.3px solid rgba(0, 0, 0, 0.2);
        z-index: 1;
      }

      .friends__header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .friends__header-icon {
        font-size: 18px;
      }

      .friends__header-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .friends__header-filters {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .friends__chip {
        border-radius: 3px;
        border: none;
        padding: 6px 12px;
        font-size: 13px;
        color: #b5bac1;
        background-color: #2b2d31;
        cursor: pointer;
        transition:
          background-color 120ms ease-out,
          color 120ms ease-out;
        position: relative;
        overflow: hidden;
      }

      .friends__chip::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.35); /* ESCURECENDO */
        transform: translate(-50%, -50%);
        opacity: 0;
        transition:
          width 250ms ease-out,
          height 250ms ease-out,
          opacity 250ms ease-out;
      }

      .friends__chip:active::after {
        width: 200px;
        height: 200px;
        opacity: 1;
      }

      .friends__chip--active {
        background-color: #404249;
        color: #ffffff;
      }

      .friends__chip--primary {
        background-color: #248046;
        color: #ffffff;
        font-weight: 600;
      }

      .friends__chip:not(.friends__chip--active):not(.friends__chip--primary):hover {
        background-color: #35373c;
        color: #dbdee1;
      }

      .friends__chip--primary:hover {
        background-color: #1a6335;
      }

      /* Main card */
      .friends__card {
        flex: 1 1 auto;
        min-height: 0;
        margin: 8px 16px 16px 16px;
        background-color: #313338;
        border-radius: 8px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        padding: 12px 16px 16px;
      }

      .friends__search-row {
        margin-bottom: 12px;
      }

      .friends__search-input {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        border-radius: 4px;
        background-color: #1e1f22;
        border: 1px solid rgba(0, 0, 0, 0.7);
        color: #b5bac1;
        font-size: 14px;
      }

      .friends__search-icon {
        font-size: 14px;
      }

      .friends__search-placeholder {
        font-size: 14px;
      }

      .friends__section-header {
        margin-bottom: 8px;
      }

      .friends__section-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #949ba4;
      }

      .friends__empty {
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

      .friends__empty-icon {
        font-size: 32px;
      }

      .friends__empty-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .friends__empty-text {
        margin: 0;
        max-width: 420px;
        font-size: 13px;
        color: #b5bac1;
      }

      /* Responsive tweaks */
      @media (max-width: 900px) {
        .friends__header-filters {
          display: none;
        }
      }
    `,
  ],
})
export class FriendsPageComponent {}
