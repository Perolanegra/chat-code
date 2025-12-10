import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { NgForOf } from '@angular/common';

interface QuestItem {
  id: number;
  title: string;
  description: string;
  progress: number; // 0–100
  reward: string;
  status: 'active' | 'completed' | 'upcoming';
}

@Component({
  selector: 'app-quests-page',
  standalone: true,
  imports: [NgForOf, TitleCasePipe],
  template: `
    <section class="quests-page">
      <!-- Header -->
      <header class="quests-page__header">
        <div class="quests-page__title-row">
          <span class="quests-page__icon">🎯</span>
          <h1 class="quests-page__title">Quests</h1>
        </div>
        <p class="quests-page__subtitle">
          This is a placeholder layout for Discord-like quests. Replace this view with your real
          quests system when it's ready.
        </p>
      </header>

      <!-- Body -->
      <div class="quests-page__body">
        <!-- Sidebar filters -->
        <aside class="quests-page__sidebar" aria-label="Quest filters">
          <h2 class="quests-page__sidebar-title">Filters</h2>

          <button type="button" class="quests-page__filter quests-page__filter--active">
            Active
          </button>
          <button type="button" class="quests-page__filter">Completed</button>
          <button type="button" class="quests-page__filter">Upcoming</button>

          <h2 class="quests-page__sidebar-title quests-page__sidebar-title--spaced">Difficulty</h2>
          <button type="button" class="quests-page__filter">Easy</button>
          <button type="button" class="quests-page__filter">Medium</button>
          <button type="button" class="quests-page__filter">Hard</button>
        </aside>

        <!-- Main content -->
        <main class="quests-page__content" aria-label="Quests list">
          <div class="quests-page__section-header">
            <span class="quests-page__section-title">FEATURED QUESTS</span>
          </div>

          <div class="quests-page__list">
            <article
              class="quests-page__card quests-page__card--active"
              *ngFor="let quest of quests"
            >
              <header class="quests-page__card-header">
                <h3 class="quests-page__card-title">
                  {{ quest.title }}
                  <span
                    class="quests-page__chip"
                    [class.quests-page__chip--completed]="quest.status === 'completed'"
                    [class.quests-page__chip--upcoming]="quest.status === 'upcoming'"
                  >
                    {{ quest.status | titlecase }}
                  </span>
                </h3>
                <p class="quests-page__card-description">
                  {{ quest.description }}
                </p>
              </header>

              <div class="quests-page__card-meta">
                <div class="quests-page__progress">
                  <div class="quests-page__progress-track">
                    <div class="quests-page__progress-bar" [style.width.%]="quest.progress"></div>
                  </div>
                  <span class="quests-page__progress-label"> {{ quest.progress }}% </span>
                </div>

                <div class="quests-page__reward">
                  <span class="quests-page__reward-label">Reward</span>
                  <span class="quests-page__reward-value">
                    {{ quest.reward }}
                  </span>
                </div>

                <button
                  type="button"
                  class="quests-page__action"
                  [disabled]="quest.status !== 'active'"
                >
                  {{ quest.status === 'active' ? 'Track Quest' : 'Unavailable' }}
                </button>
              </div>
            </article>
          </div>

          <p class="quests-page__footnote">
            This page is currently a static mock. When you integrate your real quests backend, you
            can replace the local <code>quests</code> array with data from your API or state
            management layer.
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

      .quests-page {
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
      .quests-page__header {
        flex: 0 0 auto;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
        background-color: #313338;
      }

      .quests-page__title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }

      .quests-page__icon {
        font-size: 18px;
      }

      .quests-page__title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .quests-page__subtitle {
        margin: 0;
        margin-top: 2px;
        font-size: 13px;
        color: #b5bac1;
      }

      /* Body layout */
      .quests-page__body {
        flex: 1 1 auto;
        min-height: 0;
        display: grid;
        grid-template-columns: 230px minmax(0, 1fr);
      }

      /* Sidebar */
      .quests-page__sidebar {
        background-color: #2b2d31;
        border-right: 1px solid rgba(0, 0, 0, 0.4);
        padding: 16px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .quests-page__sidebar-title {
        margin: 0 0 6px;
        padding: 0 6px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #949ba4;
      }

      .quests-page__sidebar-title--spaced {
        margin-top: 12px;
      }

      .quests-page__filter {
        border: none;
        border-radius: 4px;
        padding: 6px 8px;
        text-align: left;
        font-size: 14px;
        background: transparent;
        color: #b5bac1;
        cursor: pointer;
        transition:
          background-color 120ms ease-out,
          color 120ms ease-out;
      }

      .quests-page__filter--active {
        background-color: #3f4248;
        color: #ffffff;
      }

      .quests-page__filter:not(.quests-page__filter--active):hover {
        background-color: #35373c;
        color: #dbdee1;
      }

      /* Content area */
      .quests-page__content {
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .quests-page__section-header {
        flex: 0 0 auto;
        margin-bottom: 10px;
      }

      .quests-page__section-title {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: #949ba4;
      }

      .quests-page__list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow: auto;
        padding-right: 4px;
      }

      .quests-page__card {
        background-color: #2b2d31;
        border-radius: 8px;
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
      }

      .quests-page__card-header {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .quests-page__card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .quests-page__chip {
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        background-color: #5865f2;
        color: #ffffff;
      }

      .quests-page__chip--completed {
        background-color: #3ba55d;
      }

      .quests-page__chip--upcoming {
        background-color: #f0b232;
        color: #1e1f22;
      }

      .quests-page__card-description {
        margin: 0;
        font-size: 13px;
        color: #b5bac1;
      }

      .quests-page__card-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .quests-page__progress {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 140px;
      }

      .quests-page__progress-track {
        flex: 1 1 auto;
        height: 6px;
        border-radius: 999px;
        background-color: #1e1f22;
        overflow: hidden;
      }

      .quests-page__progress-bar {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #5865f2, #f47fff);
      }

      .quests-page__progress-label {
        font-size: 12px;
        color: #d0d4db;
        min-width: 32px;
        text-align: right;
      }

      .quests-page__reward {
        display: flex;
        flex-direction: column;
        min-width: 120px;
      }

      .quests-page__reward-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #949ba4;
      }

      .quests-page__reward-value {
        font-size: 13px;
        font-weight: 600;
      }

      .quests-page__action {
        margin-left: auto;
        border-radius: 999px;
        border: none;
        padding: 4px 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        background-color: #5865f2;
        color: #ffffff;
        transition:
          background-color 120ms ease-out,
          transform 80ms ease-out,
          box-shadow 80ms ease-out;
      }

      .quests-page__action:hover:not(:disabled) {
        background-color: #4752c4;
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      }

      .quests-page__action:disabled {
        background-color: #4e5058;
        color: #b5bac1;
        cursor: default;
        box-shadow: none;
        transform: none;
      }

      .quests-page__footnote {
        margin: 8px 0 0;
        font-size: 12px;
        color: #a6abb4;
      }

      /* Responsive tweaks */
      @media (max-width: 900px) {
        .quests-page__body {
          grid-template-columns: 200px minmax(0, 1fr);
        }
      }

      @media (max-width: 720px) {
        .quests-page__body {
          grid-template-columns: minmax(0, 1fr);
        }

        .quests-page__sidebar {
          display: none;
        }

        .quests-page__content {
          padding: 12px 12px 16px;
        }
      }
    `,
  ],
})
export class QuestsPageComponent {
  // Static mock quests for layout/demo purposes.
  quests: QuestItem[] = [
    {
      id: 1,
      title: 'Say hi to 3 new friends',
      description:
        'Send a friendly message to three different users in your server or direct messages.',
      progress: 40,
      reward: '150 XP • 50 Coins',
      status: 'active',
    },
    {
      id: 2,
      title: 'Join a voice channel',
      description: 'Hop into any voice channel and stay connected for at least 10 minutes.',
      progress: 10,
      reward: '100 XP',
      status: 'active',
    },
    {
      id: 3,
      title: 'Complete your profile',
      description: 'Add an avatar, set a custom status, and update your profile banner.',
      progress: 100,
      reward: 'Profile Badge',
      status: 'completed',
    },
    {
      id: 4,
      title: 'Discover a new community',
      description:
        'Use the server discovery section to find and join a new server that interests you.',
      progress: 0,
      reward: '200 XP • Mystery Item',
      status: 'upcoming',
    },
  ];
}
