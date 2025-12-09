import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FixedSidebarComponent } from './fixed-side-bar/fixed-sidebar';

@Component({
  selector: 'app-dm-shell',
  standalone: true,
  imports: [RouterOutlet, FixedSidebarComponent],
  template: `
    <section class="dm-shell">
      <aside class="dm-shell__sidebar">
        <app-fixed-sidebar></app-fixed-sidebar>
      </aside>

      <main class="dm-shell__content">
        <router-outlet></router-outlet>
      </main>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .dm-shell {
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr);
        height: 100%;
        min-height: 0;
      }

      .dm-shell__sidebar {
        border-right: 1px solid rgba(0, 0, 0, 0.25);
        background-color: #2b2d31;
      }

      .dm-shell__content {
        min-width: 0;
        min-height: 0;
        height: 100%;
      }
    `,
  ],
})
export class DmShellComponent {}
