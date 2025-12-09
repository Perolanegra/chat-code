import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'direct-messages',
    loadChildren: () =>
      import('../components/direct-messages/direct-messages.routes').then(
        (m) => m.DIRECT_MESSAGES_ROUTES,
      ),
  },
  {
    path: 'server',
    loadChildren: () => import('../components/server/server.routes').then((m) => m.SERVER_ROUTES),
  },
  {
    path: 'discover',
    loadChildren: () =>
      import('../components/discover/discover.routes').then((m) => m.DISCOVER_ROUTES),
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
