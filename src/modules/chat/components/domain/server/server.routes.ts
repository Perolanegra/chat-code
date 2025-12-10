import { Routes } from '@angular/router';

// TODO: Replace with your real component
import { ChannelPageComponent } from './pages/channel-page.component';

export const SERVER_ROUTES: Routes = [
  {
    path: 'channel',
    component: ChannelPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'channel',
  },
];
