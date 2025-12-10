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
  templateUrl: './fixed-sidebar.component.html',
  styleUrls: ['./fixed-sidebar.component.scss'],
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

  setChannelRoom(calleeId: number) {
    //TODO: Implement setChannelRoom state
    // we need first to call
    // this.router.navigate(['/chat', calleeId]);
  }
}
