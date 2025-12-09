import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

interface DmNavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number | 'free';
}

interface FrequentFriend {
  id: number;
  initials: string;
  color: string;
}

interface DirectMessage {
  id: number;
  name: string;
  initials: string;
  color: string;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
}

@Component({
  selector: 'app-fixed-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  template: `
    <section class="dm-sidebar" aria-label="Direct messages sidebar">
      <!-- Top search / input -->
      <header class="dm-sidebar__search">
        <button mat-stroked-button color="primary" class="dm-sidebar__search-button" type="button">
          <mat-icon class="dm-sidebar__search-icon">search</mat-icon>
          <span class="dm-sidebar__search-label">Find or start a conversation</span>
        </button>
      </header>

      <!-- Main navigation -->
      <nav class="dm-sidebar__nav" aria-label="DM sections">
        <a
          *ngFor="let item of navItems()"
          mat-button
          class="dm-sidebar__nav-item"
          [routerLink]="['/dm', item.route]"
          routerLinkActive="dm-sidebar__nav-item--active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <mat-icon class="dm-sidebar__nav-icon">{{ item.icon }}</mat-icon>
          <span class="dm-sidebar__nav-label">{{ item.label }}</span>

          <span *ngIf="item.badge" class="dm-sidebar__badge" [ngSwitch]="item.badge">
            <span
              *ngSwitchCase="'free'"
              class="dm-sidebar__badge-chip dm-sidebar__badge-chip--pill"
            >
              2 WEEKS FREE
            </span>
            <span *ngSwitchDefault class="dm-sidebar__badge-chip">
              {{ item.badge }}
            </span>
          </span>
        </a>
      </nav>

      <mat-divider class="dm-sidebar__divider"></mat-divider>

      <!-- Frequent friends avatars -->
      <section class="dm-sidebar__section" aria-label="Frequent friends">
        <header class="dm-sidebar__section-header">
          <span class="dm-sidebar__section-title"> Frequent Friends </span>
          <mat-icon class="dm-sidebar__section-icon" aria-hidden="true">help_outline</mat-icon>
        </header>

        <div class="dm-sidebar__frequent-row">
          <button
            *ngFor="let friend of frequentFriends()"
            mat-mini-fab
            class="dm-sidebar__frequent-avatar"
            type="button"
            [ngStyle]="{ 'background-color': friend.color }"
          >
            <span class="dm-sidebar__frequent-initials">
              {{ friend.initials }}
            </span>
          </button>
        </div>
      </section>

      <mat-divider class="dm-sidebar__divider dm-sidebar__divider--spaced"></mat-divider>

      <!-- Direct messages list -->
      <section class="dm-sidebar__section dm-sidebar__section--grow" aria-label="Direct messages">
        <header class="dm-sidebar__section-header dm-sidebar__section-header--compact">
          <span class="dm-sidebar__section-title">Direct Messages</span>
          <button
            mat-icon-button
            class="dm-sidebar__icon-button"
            type="button"
            aria-label="New DM (placeholder)"
          >
            <mat-icon>add</mat-icon>
          </button>
        </header>

        <div id="sidebar_list" class="dm-sidebar__dm-list" role="list">
          <button
            *ngFor="let dm of directMessages()"
            mat-button
            type="button"
            class="dm-sidebar__dm-item"
            role="listitem"
          >
            <span class="dm-sidebar__dm-avatar" [ngStyle]="{ 'background-color': dm.color }">
              <span class="dm-sidebar__dm-initials">{{ dm.initials }}</span>
              <span
                *ngIf="dm.status"
                class="dm-sidebar__dm-status"
                [ngClass]="'dm-sidebar__dm-status--' + dm.status"
                aria-hidden="true"
              ></span>
            </span>

            <span class="dm-sidebar__dm-name">
              {{ dm.name }}
            </span>
          </button>
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

      .dm-sidebar {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: #2b2d31;
        color: #f2f3f5;
        box-sizing: border-box;
      }

      /* Search bar */
      .dm-sidebar__search {
        padding: 8px 12px 4px;
      }

      .dm-sidebar__search-button {
        width: 100%;
        justify-content: flex-start;
        border-radius: 6px;
        text-transform: none;
        border-color: rgba(0, 0, 0, 0.65);
        background-color: #1e1f22;
        color: #b5bac1;
      }

      .dm-sidebar__search-button:hover {
        background-color: #222428;
      }

      .dm-sidebar__search-icon {
        margin-right: 8px;
        font-size: 18px;
      }

      .dm-sidebar__search-label {
        font-size: 13px;
      }

      /* Nav items */
      .dm-sidebar__nav {
        display: flex;
        flex-direction: column;
        padding: 4px 8px 0;
        gap: 4px;
      }

      .dm-sidebar__nav-item {
        position: relative;
        justify-content: flex-start;

        border-radius: 8px;
        padding: 8px 10px;

        text-transform: none;

        color: #b5bac1;

        font-size: 14px;

        gap: 10px;

        background-color: transparent;
      }

      .dm-sidebar__nav-item:hover {
        background-color: #35373c;

        color: #dbdee1;
      }

      .dm-sidebar__nav-item--active {
        background-color: #404249;

        color: #ffffff;

        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.65);
      }

      .dm-sidebar__nav-icon {
        font-size: 20px;

        width: 20px;
      }

      .dm-sidebar__nav-label {
        flex: 1;

        text-align: left;
      }

      .dm-sidebar__badge {
        display: inline-flex;
        align-items: center;
      }

      .dm-sidebar__badge-chip {
        display: inline-flex;
        align-items: center;
        padding: 0 6px;
        min-height: 18px;
        border-radius: 10px;
        font-size: 11px;
        background-color: #f04747;
        color: #ffffff;
        font-weight: 600;
      }

      .dm-sidebar__badge-chip--pill {
        background-color: #3ba55d;
      }

      .dm-sidebar__divider {
        margin: 8px 0 4px;
        border-color: rgba(0, 0, 0, 0.6);
      }

      .dm-sidebar__divider--spaced {
        margin: 6px 0;
      }

      /* Sections */
      .dm-sidebar__section {
        padding: 0 8px;
      }

      .dm-sidebar__section--grow {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .dm-sidebar__section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        padding: 4px 4px 6px;
      }

      .dm-sidebar__section-header--compact {
        padding-top: 2px;
      }

      .dm-sidebar__section-title {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #949ba4;
      }

      .dm-sidebar__section-icon {
        font-size: 14px;
        height: 14px;
        width: 14px;
        color: #6d727b;
      }

      .dm-sidebar__icon-button {
        width: 28px;
        height: 28px;
        color: #b5bac1;
      }

      .dm-sidebar__icon-button:hover {
        color: #ffffff;
      }

      /* Frequent friends */
      .dm-sidebar__frequent-row {
        display: flex;
        flex-wrap: nowrap;
        gap: 6px;
        padding: 0 4px 6px;
      }

      .dm-sidebar__frequent-avatar {
        position: relative;
        width: 32px;

        height: 32px;

        border-radius: 50%;
        padding: 0;
        box-shadow: 0 0 0 2px #2b2d31;

        overflow: hidden;
      }

      .dm-sidebar__frequent-initials {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 14px;

        font-weight: 600;

        color: #ffffff;
      }

      /* Direct messages list */
      .dm-sidebar__dm-list {
        flex: 1 1 auto;
        min-height: 0;
        padding: 5px 0 8px;
        overflow-y: auto;
        gap: 2px;
        display: flex;
        flex-direction: column;
      }

      .dm-sidebar__nav .mat-mdc-button .mdc-button__label {
        gap: 9px;
        display: flex;
        align-items: center;
      }

      .dm-sidebar__dm-item {
        width: 100%;
        justify-content: flex-start;
        border-radius: 6px;
        padding: 23px 6px;
        margin-bottom: 2px;
        text-transform: none;
        font-size: 14px;
        gap: 8px;
        color: #dbdee1;
      }

      .dm-sidebar__dm-item:hover {
        background-color: #35373c;
      }

      .dm-sidebar__dm-avatar {
        position: relative;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        /* allow status dot to overflow avatar bounds slightly, like Discord */
        overflow: visible;
        box-shadow: 0 0 0 2px #2b2d31;
      }

      span.mdc-button__label {
        gap: 9px;
        display: flex;
        align-items: center;
      }

      .dm-sidebar__dm-initials {
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
      }

      .dm-sidebar__dm-status {
        position: absolute;
        /* move dot slightly inside so it is no longer cut off */
        bottom: -2px;
        right: -2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 3px solid #2b2d31;
        background-color: #3ba55d;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
      }

      .dm-sidebar__dm-status--idle {
        background-color: #faa81a;
      }

      .dm-sidebar__dm-status--dnd {
        background-color: #f04747;
      }

      .dm-sidebar__dm-status--offline {
        background-color: #4f545c;
      }

      .dm-sidebar__dm-name {
        flex: 1;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 6px;
      }

      /* Scrollbar */
      .dm-sidebar__dm-list::-webkit-scrollbar {
        width: 6px;
      }

      .dm-sidebar__dm-list::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 3px;
      }
    `,
  ],
})
export class FixedSidebarComponent {
  private readonly router = inject(Router);

  readonly navItems = signal<DmNavItem[]>([
    { label: 'Friends', icon: 'person', route: 'friends' },
    { label: 'Message Requests', icon: 'mail', route: 'message-requests', badge: 4 },
    { label: 'Nitro', icon: 'bolt', route: 'nitro', badge: 'free' },
    { label: 'Shop', icon: 'shopping_bag', route: 'shop' },
    { label: 'Quests', icon: 'stadia_controller', route: 'quests' },
  ]);

  readonly frequentFriends = signal<FrequentFriend[]>([
    { id: 1, initials: 'CI', color: '#f39c12' },
    { id: 2, initials: 'TK', color: '#3498db' },
    { id: 3, initials: 'SA', color: '#9b59b6' },
    { id: 4, initials: 'RL', color: '#e67e22' },
  ]);

  readonly directMessages = signal<DirectMessage[]>([
    {
      id: 1,
      name: 'Suporte Estudantes EW',
      initials: 'SE',
      color: '#2ecc71',
      status: 'online',
    },
    { id: 2, name: 'TK', initials: 'TK', color: '#3498db', status: 'online' },
    {
      id: 3,
      name: 'www.ascaron.online',
      initials: 'WA',
      color: '#e67e22',
      status: 'idle',
    },
    { id: 4, name: 'p3cunha', initials: 'P3', color: '#9b59b6', status: 'offline' },
    {
      id: 5,
      name: 'Another Friend',
      initials: 'AF',
      color: '#1abc9c',
      status: 'dnd',
    },
  ]);
}
