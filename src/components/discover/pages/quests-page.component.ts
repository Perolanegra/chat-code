import { Component } from '@angular/core';

@Component({
  selector: 'app-discover-quests-page',
  standalone: true,
  template: `
    <section class="discover-quests">
      <!-- Header -->
      <header class="discover-quests__header">
        <div class="discover-quests__title-row">
          <span class="discover-quests__icon">🧭</span>
          <h1 class="discover-quests__title">Discover Quests</h1>
        </div>
        <p class="discover-quests__subtitle">
          This is a placeholder layout for a quests discovery page similar to Discord.
          Replace this component with your real implementation when your backend and
          quest system are ready.
        </p>
      </header>

      <!-- Body -->
      <div class="discover-quests__body">
        <!-- Sidebar with filters/categories -->
        <aside class="discover-quests__sidebar" aria-label="Quest filters">
          <h2 class="discover-quests__sidebar-title">Categories</h2>

          <button
            type="button"
            class="discover-quests__filter discover-quests__filter--active"
          >
            Featured
          </button>
          <button type="button" class="discover-quests__filter">
            Social
          </button>
          <button type="button" class="discover-quests__filter">
            Community
          </button>
          <button type="button" class="discover-quests__filter">
            Gameplay
          </button>

          <h2
            class="discover-quests__sidebar-title discover-quests__sidebar-title--spaced"
          >
            Status
          </h2>
          <button type="button" class="discover-quests__filter">
            Active
          </button>
          <button type="button" class="discover-quests__filter">
            Upcoming
          </button>
          <button type="button" class="discover-quests__filter">
            Completed
          </button>
        </aside>

        <!-- Main quest list -->
        <main class="discover-quests__content" aria-label="Available quests">
          <div class="discover-quests__section-header">
            <span class="discover-quests__section-title">FEATURED QUESTS</span>
            <span class="discover-quests__section-subtitle">
              Static sample data for layout only
            </span>
          </div>

          <div class="discover-quests__grid">
            <!-- Card 1 -->
            <article class="discover-quests__card discover-quests__card--primary">
              <header class="discover-quests__card-header">
                <div class="discover-quests__card-pill-row">
                  <span class="discover-quests__card-pill">Social</span>
                  <span class="discover-quests__badge discover-quests__badge--new">
                    New
                  </span>
                </div>

                <h3 class="discover-quests__card-title">
                  Welcome Wagon
                </h3>
                <p class="discover-quests__card-description">
                  Join a new community, say hello in chat, and react to at least three
                  different messages.
                </p>
              </header>

              <div class="discover-quests__card-footer">
                <div class="discover-quests__reward">
                  <span class="discover-quests__reward-label">Reward</span>
                  <span class="discover-quests__reward-value">200 XP • Avatar Frame</span>
                </div>
                <button type="button" class="discover-quests__cta" disabled>
                  View details
                </button>
              </div>
            </article>

            <!-- Card 2 -->
            <article class="discover-quests__card">
              <header class="discover-quests__card-header">
                <div class="discover-quests__card-pill-row">
                  <span class="discover-quests__card-pill">Community</span>
                </div>

                <h3 class="discover-quests__card-title">
                  Event Explorer
                </h3>
                <p class="discover-quests__card-description">
                  Find a server event and RSVP, then share a screenshot or clip in chat
                  once it begins.
                </p>
              </header>

              <div class="discover-quests__card-footer">
                <div class="discover-quests__reward">
                  <span class="discover-quests__reward-label">Reward</span>
                  <span class="discover-quests__reward-value">150 XP • Quest Token</span>
                </div>
                <button type="button" class="discover-quests__cta" disabled>
                  View details
                </button>
              </div>
            </article>

            <!-- Card 3 -->
            <article class="discover-quests__card discover-quests__card--upcoming">
              <header class="discover-quests__card-header">
                <div class="discover-quests__card-pill-row">
                  <span class="discover-quests__card-pill">Gameplay</span>
                  <span class="discover-quests__badge discover-quests__badge--upcoming">
                    Upcoming
                  </span>
                </div>

                <h3 class="discover-quests__card-title">
                  Co-op Challenger
                </h3>
                <p class="discover-quests__card-description">
                  Team up with at least one friend in a supported game and complete a
                  cooperative objective.
                </p>
              </header>

              <div class="discover-quests__card-footer">
                <div class="discover-quests__reward">
                  <span class="discover-quests__reward-label">Reward</span>
                  <span class="discover-quests__reward-value">300 XP • Title Badge</span>
                </div>
                <button type="button" class="discover-quests__cta" disabled>
                  Not available yet
                </button>
              </div>
            </article>
          </div>

          <p class="discover-quests__footnote">
            This discover quests page is a static mock used for UI development.
            When you wire up your real quest system, you can replace these hard-coded
            cards with data loaded from your API or state store.
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

      .discover-quests {
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

      .discover-quests__header {
        flex: 0 0 auto;
        padding: 16px 20px 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
        background-color: #313338;
      }

      .discover-quests__title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }

      .discover-quests__icon {
        font-size: 18px;
      }

      .discover-quests__title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .discover-quests__subtitle {
        margin: 0;
        margin-top: 2px;
        font-size: 13px;
        color: #b5bac1;
        max-width: 680px;
      }

      /* Body layout */

      .discover-quests__body {
        flex: 1 1 auto;
        min-height: 0;
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr);
      }

      /* Sidebar */

      .discover-quests__sidebar {
        background-color: #2b2d31;
        border-right: 1px solid rgba(0, 0, 0, 0.4);
        padding: 16px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .discover-quests__sidebar-title {
        margin: 0 0 6px;
        padding: 0 6px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #949ba4;
      }

      .discover-quests__sidebar-title--spaced {
        margin-top: 12px;
      }

      .discover-quests__filter {
        border: none;
        border-radius: 4px;
        padding: 6px 8px;
        text-align: left;
        font-size: 14px;
        background: transparent;
        color: #b5bac1;
        cursor: default;
        transition:
          background-color 120ms ease-out,
          color 120ms ease-out;
      }

      .discover-quests__filter--active {
        background-color: #3f4248;
        color: #ffffff;
      }

      .discover-quests__filter:not(.discover-quests__filter--active):hover {
        background-color: #35373c;
        color: #dbdee1;
      }

      /* Main content */

      .discover-quests__content {
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .discover-quests__section-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
      }

      .discover-quests__section-title {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: #949ba4;
      }

      .discover-quests__section-subtitle {
        font-size: 12px;
        color: #a6abb4;
      }

      .discover-quests__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 12px;
        margin-bottom: 12px;
        overflow: auto;
        padding-right: 4px;
      }

      .discover-quests__card {
        background-color: #2b2d31;
        border-radius: 8px;
        padding: 10px 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
      }

      .discover-quests__card--primary {
        border: 1px solid rgba(88, 101, 242, 0.65);
      }

      .discover-quests__card--upcoming {
        border: 1px dashed rgba(240, 178, 50, 0.8);
      }

      .discover-quests__card-header {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .discover-quests__card-pill-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .discover-quests__card-pill {
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        background-color: #5865f2;
        color: #ffffff;
      }

      .discover-quests__badge {
        padding: 2px 6px;
        border-radius: 999px;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .discover-quests__badge--new {
        background-color: #3ba55d;
        color: #1e1f22;
        font-weight: 600;
      }

      .discover-quests__badge--upcoming {
        background-color: #f0b232;
        color: #1e1f22;
        font-weight: 600;
      }

      .discover-quests__card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }

      .discover-quests__card-description {
        margin: 0;
        font-size: 13px;
        color: #b5bac1;
      }

      .discover-quests__card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .discover-quests__reward {
        display: flex;
        flex-direction: column;
      }

      .discover-quests__reward-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #949ba4;
      }

      .discover-quests__reward-value {
        font-size: 13px;
        font-weight: 600;
      }

      .discover-quests__cta {
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

      .discover-quests__footnote {
        margin: 0;
        margin-top: auto;
        font-size: 12px;
        color: #a6abb4;
      }

      /* Responsive */

      @media (max-width: 900px) {
        .discover-quests__body {
          grid-template-columns: 210px minmax(0, 1fr);
        }
      }

      @media (max-width: 720px) {
        .discover-quests__body {
          grid-template-columns: minmax(0, 1fr);
        }

        .discover-quests__sidebar {
          display: none;
        }

        .discover-quests__content {
          padding: 12px 12px 16px;
        }
      }
    `,
  ],
})
export class DiscoverQuestsPageComponent {}
