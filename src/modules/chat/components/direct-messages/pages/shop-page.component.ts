import { Component } from '@angular/core';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  template: `
    <section class="shop-page">
      <!-- Header -->
      <header class="shop-page__header">
        <div class="shop-page__title-row">
          <span class="shop-page__icon">🛒</span>
          <h1 class="shop-page__title">Shop</h1>
        </div>
        <p class="shop-page__subtitle">
          Browse this placeholder marketplace. Replace this component with your real
          implementation once your catalog and checkout are ready.
        </p>
      </header>

      <!-- Body -->
      <div class="shop-page__body">
        <!-- Filters / categories -->
        <aside class="shop-page__sidebar" aria-label="Shop filters">
          <h2 class="shop-page__sidebar-title">Categories</h2>
          <button
            type="button"
            class="shop-page__category shop-page__category--active"
          >
            Featured
          </button>
          <button type="button" class="shop-page__category">
            Avatars
          </button>
          <button type="button" class="shop-page__category">
            Themes
          </button>
          <button type="button" class="shop-page__category">
            Boosts
          </button>
          <button type="button" class="shop-page__category">
            Bundles
          </button>

          <h2 class="shop-page__sidebar-title shop-page__sidebar-title--spaced">
            Price
          </h2>
          <button type="button" class="shop-page__category">
            Under $5
          </button>
          <button type="button" class="shop-page__category">
            $5 – $15
          </button>
          <button type="button" class="shop-page__category">
            Above $15
          </button>
        </aside>

        <!-- Product grid -->
        <main class="shop-page__content" aria-label="Featured products">
          <div class="shop-page__section-header">
            <span class="shop-page__section-title">FEATURED ITEMS</span>
          </div>

          <div class="shop-page__grid">
            <article class="shop-page__card">
              <div class="shop-page__card-art shop-page__card-art--primary">
                <span class="shop-page__card-emoji">🎨</span>
              </div>
              <header class="shop-page__card-header">
                <h3 class="shop-page__card-title">Profile Theme Pack</h3>
                <p class="shop-page__card-subtitle">
                  A set of colorful profile themes to customize your appearance.
                </p>
              </header>
              <div class="shop-page__card-footer">
                <span class="shop-page__price">$9.99</span>
                <button type="button" class="shop-page__buy-btn">
                  Preview
                </button>
              </div>
            </article>

            <article class="shop-page__card">
              <div class="shop-page__card-art shop-page__card-art--accent">
                <span class="shop-page__card-emoji">😺</span>
              </div>
              <header class="shop-page__card-header">
                <h3 class="shop-page__card-title">Emoji Mega Bundle</h3>
                <p class="shop-page__card-subtitle">
                  Unlock a bundle of expressive emoji for your servers and DMs.
                </p>
              </header>
              <div class="shop-page__card-footer">
                <span class="shop-page__price">$4.99</span>
                <button type="button" class="shop-page__buy-btn">
                  Preview
                </button>
              </div>
            </article>

            <article class="shop-page__card">
              <div class="shop-page__card-art shop-page__card-art--boost">
                <span class="shop-page__card-emoji">⚡</span>
              </div>
              <header class="shop-page__card-header">
                <h3 class="shop-page__card-title">Server Boost Pack</h3>
                <p class="shop-page__card-subtitle">
                  Temporary boosts for your favorite community, Nitro-style.
                </p>
              </header>
              <div class="shop-page__card-footer">
                <span class="shop-page__price">$14.99</span>
                <button type="button" class="shop-page__buy-btn">
                  Preview
                </button>
              </div>
            </article>

            <article class="shop-page__card shop-page__card--placeholder">
              <div class="shop-page__card-art">
                <span class="shop-page__card-emoji">✨</span>
              </div>
              <header class="shop-page__card-header">
                <h3 class="shop-page__card-title">Coming Soon</h3>
                <p class="shop-page__card-subtitle">
                  Add more items here once your backend and catalog are wired up.
                </p>
              </header>
              <div class="shop-page__card-footer">
                <span class="shop-page__price">TBD</span>
                <button type="button" class="shop-page__buy-btn shop-page__buy-btn--disabled">
                  Not available
                </button>
              </div>
            </article>
          </div>

          <p class="shop-page__disclaimer">
            This shop is a static mock for layout purposes only. Hook these cards up
            to your real product data, routing, and checkout flows when they are
            implemented.
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

      .shop-page {
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
      .shop-page__header {
        flex: 0 0 auto;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
        background-color: #313338;
      }

      .shop-page__title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }

      .shop-page__icon {
        font-size: 18px;
      }

      .shop-page__title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .shop-page__subtitle {
        margin: 0;
        margin-top: 2px;
        font-size: 13px;
        color: #b5bac1;
      }

      /* Body layout */
      .shop-page__body {
        flex: 1 1 auto;
        min-height: 0;
        display: grid;
        grid-template-columns: 230px minmax(0, 1fr);
      }

      /* Sidebar */
      .shop-page__sidebar {
        background-color: #2b2d31;
        border-right: 1px solid rgba(0, 0, 0, 0.4);
        padding: 16px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .shop-page__sidebar-title {
        margin: 0 0 6px;
        padding: 0 6px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #949ba4;
      }

      .shop-page__sidebar-title--spaced {
        margin-top: 12px;
      }

      .shop-page__category {
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

      .shop-page__category--active {
        background-color: #3f4248;
        color: #ffffff;
      }

      .shop-page__category:not(.shop-page__category--active):hover {
        background-color: #35373c;
        color: #dbdee1;
      }

      /* Content area */
      .shop-page__content {
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .shop-page__section-header {
        flex: 0 0 auto;
        margin-bottom: 12px;
      }

      .shop-page__section-title {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: #949ba4;
      }

      .shop-page__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        gap: 14px;
        margin-bottom: 16px;
      }

      .shop-page__card {
        background-color: #2b2d31;
        border-radius: 8px;
        padding: 10px 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
      }

      .shop-page__card--placeholder {
        opacity: 0.9;
      }

      .shop-page__card-art {
        border-radius: 6px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at top left, #5865f2 0, #1e1f22 60%);
      }

      .shop-page__card-art--primary {
        background: radial-gradient(circle at top left, #5865f2 0, #1e1f22 60%);
      }

      .shop-page__card-art--accent {
        background: radial-gradient(circle at top left, #f47fff 0, #1e1f22 60%);
      }

      .shop-page__card-art--boost {
        background: radial-gradient(circle at top left, #3ba55d 0, #1e1f22 60%);
      }

      .shop-page__card-emoji {
        font-size: 32px;
      }

      .shop-page__card-header {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .shop-page__card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
      }

      .shop-page__card-subtitle {
        margin: 0;
        font-size: 13px;
        color: #b5bac1;
      }

      .shop-page__card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 4px;
      }

      .shop-page__price {
        font-size: 14px;
        font-weight: 600;
      }

      .shop-page__buy-btn {
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

      .shop-page__buy-btn:hover {
        background-color: #4752c4;
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      }

      .shop-page__buy-btn--disabled {
        background-color: #4e5058;
        color: #b5bac1;
        cursor: default;
        box-shadow: none;
        transform: none;
      }

      .shop-page__buy-btn--disabled:hover {
        background-color: #4e5058;
      }

      .shop-page__disclaimer {
        margin: 0;
        margin-top: auto;
        padding-top: 8px;
        font-size: 12px;
        color: #a6abb4;
      }

      /* Responsive tweaks */
      @media (max-width: 900px) {
        .shop-page__body {
          grid-template-columns: 200px minmax(0, 1fr);
        }
      }

      @media (max-width: 720px) {
        .shop-page__body {
          grid-template-columns: minmax(0, 1fr);
        }

        .shop-page__sidebar {
          display: none;
        }

        .shop-page__content {
          padding: 12px 12px 16px;
        }
      }
    `,
  ],
})
export class ShopPageComponent {}
