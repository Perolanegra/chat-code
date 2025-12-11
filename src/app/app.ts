import { Component, inject, INJECTOR, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainSidebarComponent } from './main-sidebar/main-sidebar';
import { AuthService } from '@core/app/services/auth/auth.service';
import { NgIf } from '@angular/common';

declare global {
  interface Window {
    electronAPI?: any;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainSidebarComponent, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('chat-code');
  public readonly auth = inject(AuthService);

  async ping() {
    if (window.electronAPI) {
      const res = await window.electronAPI.ping();
      console.log(res); // 'pong'
    }
  }

  minimize() {
    window.electronAPI?.invoke?.('window:minimize');
  }

  toggleMaxRestore() {
    window.electronAPI?.invoke?.('window:toggle-max');
  }

  close() {
    window.electronAPI?.invoke?.('window:close');
  }
}
