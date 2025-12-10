import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'direct-messages',
    loadChildren: () =>
      import('@modules-chat-ui/direct-messages/direct-messages.routes').then(
        (m) => m.DIRECT_MESSAGES_ROUTES,
      ),
  },
  {
    path: 'server',
    loadChildren: () =>
      import('@modules-server-ui/root/server.routes').then((m) => m.SERVER_ROUTES),
  },
  {
    path: 'discover',
    loadChildren: () =>
      import('@modules-discover-ui/root/discover.routes').then((m) => m.DISCOVER_ROUTES),
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
