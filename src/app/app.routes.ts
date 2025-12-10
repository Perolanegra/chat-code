import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'direct-messages',
    loadChildren: () =>
      import('../modules/chat/components/domain/direct-messages/direct-messages.routes').then(
        (m) => m.DIRECT_MESSAGES_ROUTES,
      ),
  },
  {
    path: 'server',
    loadChildren: () =>
      import('../modules/server/components/domain/root/server.routes').then((m) => m.SERVER_ROUTES),
  },
  {
    path: 'discover',
    loadChildren: () =>
      import('../modules/discover/components/domain/root/discover.routes').then(
        (m) => m.DISCOVER_ROUTES,
      ),
  },
  {
    path: 'message-channel',
    loadChildren: () =>
      import('../modules/chat/components/domain/channel/channel.routes').then(
        (m) => m.CHANNEL_ROUTES,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'direct-messages',
  },
  {
    path: '**',
    redirectTo: 'direct-messages',
  },
];
