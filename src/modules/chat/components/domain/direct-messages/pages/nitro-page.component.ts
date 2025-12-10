import { Component } from '@angular/core';

@Component({
  selector: 'app-nitro-page',
  standalone: true,
  template: `
    <section class="nitro-page">
      <!-- Header -->
      <header class="nitro-page__header">
        <div class="nitro-page__title-row">
          <span class="nitro-page__icon">🚀</span>
          <h1 class="nitro-page__title">Nitro</h1>
        </div>
        <p class="nitro-page__subtitle">
          This is a placeholder layout for the Discord-like Nitro experience.
          Replace this component with your real implementation when premium
          features are ready.
        </p>
      </header>

      <!-- Body -->
      <div class="nitro-page__body">
        <!-- Left column: plans list -->
        <section
          class="nitro-page__plans"
          aria-label="Available Nitro subscriptions"
        >
          <h2 class="nitro-page__section-title">Choose your plan</h2>

          <div class="nitro-page__plans-grid">
            <article class="nitro-page__plan nitro-page__plan--primary">
              <header class="nitro-page__plan-header">
                <h3 class="nitro-page__plan-name">Nitro</h3>
                <span class="nitro-page__plan-badge">Most popular</span>
              </header>

              <p class="nitro-page__plan-price">$9.99 / month</p>
              <p class="nitro-page__plan-description">
                Unlock higher upload limits, HD streaming, and more ways to
                support your favorite servers.
              </p>

              <ul class="nitro-page__plan-features">
                <li>HD video and screen sharing</li>
                <li>Server boosts and perks</li>
                <li>Custom emoji anywhere</li>
                <li>Profile customization</li>
              </ul>

              <button
                class="nitro-page__cta nitro-page__cta--primary"
                type="button"
              >
                Subscribe
              </button>
            </article>

            <article class="nitro-page__plan nitro-page__plan--secondary">
              <header class="nitro-page__plan-header">
                <h3 class="nitro-page__plan-name">Nitro Basic</h3>
              </header>

              <p class="nitro-page__plan-price">$2.99 / month</p>
              <p class="nitro-page__plan-description">
                A lighter plan for enhanced messaging with stickers and bigger
                uploads.
              </p>

              <ul class="nitro-page__plan-features">
                <li>Increased upload size</li>
                <li>Custom emoji anywhere</li>
                <li>Fun stickers and reactions</li>
              </ul>

              <button class="nitro-page__cta" type="button">
                Try Basic
              </button>
            </article>
          </div>
        </section>

        <!-- Right column: feature highlight / illustration -->
        <aside
          class="nitro-page__aside"
          aria-label="Nitro feature highlights"
        >
          <div class="nitro-page__art">
            <div class="nitro-page__art-icon">✨</div>
            <h2 class="nitro-page__art-title">Make your Discord shine</h2>
            <p class="nitro-page__art-text">
              Nitro is all about expression and support. Use animated emojis,
              custom profiles, and boosted servers to personalize your
              experience.
            </p>

            <ul class="nitro-page__art-list">
              <li>Stand out with animated avatars and banners</li>
              <li>Show off your favorite communities with boosts</li>
              <li>Enjoy smoother streams and bigger file uploads</li>
            </ul>

            <p class="nitro-page__art-footnote">
              Note: This page is only a mock UI. Hook it up to your billing and
              subscription logic when it's ready.
            </p>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .nitro-page {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: radial-gradient(circle at top left, #5865f2 0, #313338 55%);
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
      .nitro-page__header {
        flex: 0 0 auto;
        padding: 16px 24px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.45);
        background: linear-gradient(
          to right,
          rgba(49, 51, 56, 0.9),
          rgba(49, 51, 56, 0.85)
        );
        backdrop-filter: blur(6px);
      }

      .nitro-page__title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }

      .nitro-page__icon {
        font-size: 20px;
      }

      .nitro-page__title {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
      }

      .nitro-page__subtitle {
        margin: 0;
        font-size: 13px;
        color: #d0d4db;
        max-width: 640px;
      }

      /* Body layout */
      .nitro-page__body {
        flex: 1 1 auto;
        min-height: 0;
        display: grid;
        grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr);
        gap: 0;
        background-color: #313338;
      }

      /* Plans section */
      .nitro-page__plans {
        padding: 24px;
        overflow: auto;
      }

      .nitro-page__section-title {
        margin: 0 0 16px;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: #b5bac1;
        text-transform: uppercase;
      }

      .nitro-page__plans-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
      }

      .nitro-page__plan {
        border-radius: 8px;
        padding: 16px 18px;
        background: #2b2d31;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .nitro-page__plan--primary {
        border: 1px solid #f47fff;
        background: linear-gradient(
          135deg,
          rgba(244, 127, 255, 0.18),
          rgba(88, 101, 242, 0.25)
        );
      }

      .nitro-page__plan--secondary {
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .nitro-page__plan-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .nitro-page__plan-name {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
      }

      .nitro-page__plan-badge {
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        background-color: #f47fff;
        color: #1e1f22;
        font-weight: 600;
      }

      .nitro-page__plan-price {
        margin: 4px 0;
        font-size: 18px;
        font-weight: 700;
      }

      .nitro-page__plan-description {
        margin: 0 0 6px;
        font-size: 13px;
        color: #d0d4db;
      }

      .nitro-page__plan-features {
        list-style: none;
        margin: 0 0 12px;
        padding: 0;
        font-size: 13px;
        color: #e3e5ea;
      }

      .nitro-page__plan-features li::before {
        content: '•';
        margin-right: 6px;
        color: #f47fff;
      }

      .nitro-page__cta {
        align-self: flex-start;
        border-radius: 999px;
        border: none;
        padding: 6px 14px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        color: #f2f3f5;
        background-color: #4e5058;
        transition:
          background-color 120ms ease-out,
          transform 80ms ease-out,
          box-shadow 80ms ease-out;
      }

      .nitro-page__cta--primary {
        background-color: #5865f2;
        box-shadow: 0 4px 12px rgba(88, 101, 242, 0.5);
      }

      .nitro-page__cta:hover {
        background-color: #4e5de0;
        transform: translateY(-1px);
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
      }

      .nitro-page__cta--primary:hover {
        background-color: #4752c4;
      }

      /* Aside / illustration */
      .nitro-page__aside {
        padding: 24px 24px 24px 12px;
        border-left: 1px solid rgba(0, 0, 0, 0.45);
        background: radial-gradient(
            circle at top,
            rgba(244, 127, 255, 0.35),
            transparent 60%
          ),
          #2b2d31;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nitro-page__art {
        max-width: 360px;
        text-align: left;
      }

      .nitro-page__art-icon {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f47fff, #5865f2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
        margin-bottom: 12px;
      }

      .nitro-page__art-title {
        margin: 0 0 6px;
        font-size: 20px;
        font-weight: 700;
      }

      .nitro-page__art-text {
        margin: 0 0 10px;
        font-size: 14px;
        color: #d0d4db;
      }

      .nitro-page__art-list {
        margin: 0 0 12px;
        padding-left: 18px;
        font-size: 13px;
        color: #e3e5ea;
      }

      .nitro-page__art-footnote {
        margin: 0;
        font-size: 12px;
        color: #a6abb4;
      }

      /* Responsive */
      @media (max-width: 960px) {
        .nitro-page__body {
          grid-template-columns: minmax(0, 1fr);
        }

        .nitro-page__aside {
          border-left: none;
          border-top: 1px solid rgba(0, 0, 0, 0.45);
          padding-top: 16px;
        }
      }

      @media (max-width: 640px) {
        .nitro-page__header {
          padding: 12px 16px;
        }

        .nitro-page__plans {
          padding: 16px;
        }

        .nitro-page__aside {
          padding: 16px;
        }

        .nitro-page__plans-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class NitroPageComponent {}
