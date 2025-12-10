import { Component } from '@angular/core';
import { UpperCasePipe, DecimalPipe, NgIf } from '@angular/common';
import { NgForOf } from '@angular/common';

interface DiscoverServerCategory {
  id: number;
  name: string;
}

interface DiscoverServer {
  id: number;
  name: string;
  description: string;
  onlineCount: number;
  memberCount: number;
  category: string;
  isVerified?: boolean;
  isPartner?: boolean;
}

@Component({
  selector: 'app-discover-servers-page',
  standalone: true,
  imports: [UpperCasePipe, DecimalPipe, NgForOf, NgIf],
  template: `
    <section class="discover-servers">
      <!-- Header -->
      <header class="discover-servers__header">
        <div class="discover-servers__title-row">
          <span class="discover-servers__icon">🔍</span>
          <h1 class="discover-servers__title">Explore Discoverable Servers</h1>
        </div>
        <p class="discover-servers__subtitle">
          This is a placeholder layout for a Discord-like server discovery page. Replace this with
          real data and navigation when your backend and API are ready.
        </p>

        <div class="discover-servers__search-row">
          <div class="discover-servers__search">
            <span class="discover-servers__search-icon">🔎</span>
            <input
              type="text"
              class="discover-servers__search-input"
              placeholder="Search for communities"
              aria-label="Search servers"
              disabled
            />
          </div>

          <button type="button" class="discover-servers__search-button" disabled>
            Coming soon
          </button>
        </div>
      </header>

      <!-- Body layout -->
      <div class="discover-servers__body">
        <!-- Sidebar with categories -->
        <aside class="discover-servers__sidebar" aria-label="Server categories">
          <h2 class="discover-servers__sidebar-title">Categories</h2>

          <button
            type="button"
            class="discover-servers__category discover-servers__category--active"
          >
            <span class="discover-servers__category-dot discover-servers__category-dot--all"></span>
            All
          </button>

          <button
            *ngFor="let category of categories"
            type="button"
            class="discover-servers__category"
          >
            <span
              class="discover-servers__category-dot"
              [class.discover-servers__category-dot--gaming]="category.name === 'Gaming'"
              [class.discover-servers__category-dot--education]="category.name === 'Education'"
              [class.discover-servers__category-dot--music]="category.name === 'Music'"
              [class.discover-servers__category-dot--tech]="category.name === 'Technology'"
            ></span>
            {{ category.name }}
          </button>

          <h2 class="discover-servers__sidebar-title discover-servers__sidebar-title--spaced">
            Filters
          </h2>

          <button type="button" class="discover-servers__filter" disabled>
            <span class="discover-servers__filter-toggle"></span>
            Verified only
          </button>
          <button type="button" class="discover-servers__filter" disabled>
            <span class="discover-servers__filter-toggle"></span>
            Partnered only
          </button>
        </aside>

        <!-- Main content area -->
        <main class="discover-servers__content" aria-label="Server recommendations">
          <div class="discover-servers__section-header">
            <span class="discover-servers__section-title"> TRENDING COMMUNITIES </span>
            <span class="discover-servers__section-subtitle">
              Static sample data for layout only
            </span>
          </div>

          <div class="discover-servers__grid">
            <article class="discover-servers__card" *ngFor="let server of servers">
              <div class="discover-servers__card-banner">
                <div class="discover-servers__card-avatar">
                  <span class="discover-servers__card-avatar-text">
                    {{ server.name[0] | uppercase }}
                  </span>
                </div>
              </div>

              <header class="discover-servers__card-header">
                <div class="discover-servers__card-title-row">
                  <h3 class="discover-servers__card-title">
                    {{ server.name }}
                  </h3>
                  <span
                    *ngIf="server.isVerified"
                    class="discover-servers__pill discover-servers__pill--verified"
                  >
                    Verified
                  </span>
                  <span
                    *ngIf="server.isPartner"
                    class="discover-servers__pill discover-servers__pill--partner"
                  >
                    Partner
                  </span>
                </div>
                <p class="discover-servers__card-description">
                  {{ server.description }}
                </p>
              </header>

              <footer class="discover-servers__card-footer">
                <div class="discover-servers__stats">
                  <span class="discover-servers__stat discover-servers__stat--online">
                    <span
                      class="discover-servers__stat-dot discover-servers__stat-dot--online"
                    ></span>
                    {{ server.onlineCount | number }} Online
                  </span>
                  <span class="discover-servers__stat">
                    <span class="discover-servers__stat-dot"></span>
                    {{ server.memberCount | number }} Members
                  </span>
                </div>

                <button type="button" class="discover-servers__join" disabled aria-disabled="true">
                  View
                </button>
              </footer>
            </article>
          </div>

          <p class="discover-servers__footnote">
            This discover page currently renders a small set of hard-coded servers. When you connect
            a real API, you can replace the local
            <code>servers</code> and <code>categories</code> arrays with data loaded from your
            backend or from an Angular data service.
          </p>
        </main>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .discover-servers {
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

      .discover-servers__header {
        flex: 0 0 auto;
        padding: 16px 20px 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
        background-color: #313338;
      }

      .discover-servers__title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }

      .discover-servers__icon {
        font-size: 18px;
      }

      .discover-servers__title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .discover-servers__subtitle {
        margin: 0;
        margin-top: 2px;
        font-size: 13px;
        color: #b5bac1;
        max-width: 680px;
      }

      .discover-servers__search-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
      }

      .discover-servers__search {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #1e1f22;
        border-radius: 4px;
        padding: 6px 10px;
        border: 1px solid rgba(0, 0, 0, 0.7);
      }

      .discover-servers__search-icon {
        font-size: 14px;
        opacity: 0.7;
      }

      .discover-servers__search-input {
        flex: 1 1 auto;
        border: none;
        outline: none;
        background: transparent;
        color: #f2f3f5;
        font-size: 14px;
      }

      .discover-servers__search-input::placeholder {
        color: #6d727b;
      }

      .discover-servers__search-input:disabled {
        cursor: not-allowed;
      }

      .discover-servers__search-button {
        border-radius: 4px;
        border: none;
        padding: 6px 10px;
        font-size: 13px;
        font-weight: 500;
        background-color: #5865f2;
        color: #ffffff;
        opacity: 0.7;
        cursor: not-allowed;
      }

      /* Body layout */

      .discover-servers__body {
        flex: 1 1 auto;
        min-height: 0;
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr);
      }

      /* Sidebar */

      .discover-servers__sidebar {
        background-color: #2b2d31;
        border-right: 1px solid rgba(0, 0, 0, 0.4);
        padding: 16px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .discover-servers__sidebar-title {
        margin: 0 0 6px;
        padding: 0 6px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #949ba4;
      }

      .discover-servers__sidebar-title--spaced {
        margin-top: 12px;
      }

      .discover-servers__category {
        border: none;
        border-radius: 4px;
        padding: 6px 8px;
        text-align: left;
        font-size: 14px;
        background: transparent;
        color: #b5bac1;
        cursor: default;
        display: flex;
        align-items: center;
        gap: 8px;
        transition:
          background-color 120ms ease-out,
          color 120ms ease-out;
      }

      .discover-servers__category--active {
        background-color: #3f4248;
        color: #ffffff;
      }

      .discover-servers__category-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #4e5058;
      }

      .discover-servers__category-dot--all {
        background-color: #5865f2;
      }

      .discover-servers__category-dot--gaming {
        background-color: #3ba55d;
      }

      .discover-servers__category-dot--education {
        background-color: #f0b232;
      }

      .discover-servers__category-dot--music {
        background-color: #eb459e;
      }

      .discover-servers__category-dot--tech {
        background-color: #00a8fc;
      }

      .discover-servers__filter {
        border: none;
        border-radius: 4px;
        padding: 6px 8px;
        text-align: left;
        font-size: 14px;
        background: transparent;
        color: #6d727b;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: not-allowed;
      }

      .discover-servers__filter-toggle {
        width: 14px;
        height: 14px;
        border-radius: 999px;
        border: 1px solid #4e5058;
      }

      /* Content area */

      .discover-servers__content {
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .discover-servers__section-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
      }

      .discover-servers__section-title {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: #949ba4;
      }

      .discover-servers__section-subtitle {
        font-size: 12px;
        color: #a6abb4;
      }

      .discover-servers__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 12px;
        overflow: auto;
        padding-right: 4px;
        margin-bottom: 12px;
      }

      .discover-servers__card {
        background-color: #2b2d31;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
      }

      .discover-servers__card-banner {
        height: 64px;
        background: radial-gradient(circle at top left, #5865f2 0, #1e1f22 60%);
        position: relative;
      }

      .discover-servers__card-avatar {
        position: absolute;
        bottom: -18px;
        left: 12px;
        width: 36px;
        height: 36px;
        border-radius: 12px;
        background-color: #313338;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 18px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
      }

      .discover-servers__card-avatar-text {
        transform: translateY(1px);
      }

      .discover-servers__card-header {
        padding: 24px 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .discover-servers__card-title-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .discover-servers__card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }

      .discover-servers__card-description {
        margin: 0;
        font-size: 13px;
        color: #b5bac1;
      }

      .discover-servers__pill {
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .discover-servers__pill--verified {
        background-color: #00a8fc;
        color: #1e1f22;
        font-weight: 600;
      }

      .discover-servers__pill--partner {
        background-color: #3ba55d;
        color: #1e1f22;
        font-weight: 600;
      }

      .discover-servers__card-footer {
        padding: 8px 12px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .discover-servers__stats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 12px;
        color: #d0d4db;
      }

      .discover-servers__stat {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .discover-servers__stat--online {
        font-weight: 500;
      }

      .discover-servers__stat-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #4e5058;
      }

      .discover-servers__stat-dot--online {
        background-color: #3ba55d;
      }

      .discover-servers__join {
        border-radius: 999px;
        border: none;
        padding: 4px 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: not-allowed;
        background-color: #5865f2;
        color: #ffffff;
        opacity: 0.7;
      }

      .discover-servers__footnote {
        margin: 0;
        margin-top: auto;
        font-size: 12px;
        color: #a6abb4;
      }

      /* Responsive */

      @media (max-width: 900px) {
        .discover-servers__body {
          grid-template-columns: 210px minmax(0, 1fr);
        }
      }

      @media (max-width: 720px) {
        .discover-servers__body {
          grid-template-columns: minmax(0, 1fr);
        }

        .discover-servers__sidebar {
          display: none;
        }

        .discover-servers__content {
          padding: 12px 12px 16px;
        }
      }
    `,
  ],
})
export class DiscoverServersPageComponent {
  // Static mock categories for layout only.
  categories: DiscoverServerCategory[] = [
    { id: 1, name: 'Gaming' },
    { id: 2, name: 'Education' },
    { id: 3, name: 'Music' },
    { id: 4, name: 'Technology' },
    { id: 5, name: 'Lifestyle' },
  ];

  // Static mock server list for layout only.
  servers: DiscoverServer[] = [
    {
      id: 1,
      name: 'Dream Island',
      description:
        'A cozy community for hanging out, sharing games, and chatting late into the night.',
      onlineCount: 3241,
      memberCount: 12987,
      category: 'Gaming',
      isVerified: true,
    },
    {
      id: 2,
      name: 'TypeScript Tavern',
      description: 'Ask questions, share tips, and learn modern TypeScript and Angular techniques.',
      onlineCount: 812,
      memberCount: 5690,
      category: 'Technology',
      isPartner: true,
    },
    {
      id: 3,
      name: 'Lo-Fi Coding Radio',
      description:
        'Music and focus sessions for developers, students, and anyone who loves lo-fi beats.',
      onlineCount: 1460,
      memberCount: 22134,
      category: 'Music',
      isVerified: true,
    },
    {
      id: 4,
      name: 'Study Hall',
      description:
        'Pomodoro rooms, accountability partners, and resources for learners of all ages.',
      onlineCount: 590,
      memberCount: 8743,
      category: 'Education',
    },
    {
      id: 5,
      name: 'Pixel Art Collective',
      description: 'Share your pixel art, get feedback, and participate in weekly challenges.',
      onlineCount: 210,
      memberCount: 3942,
      category: 'Lifestyle',
    },
  ];
}
