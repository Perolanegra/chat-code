import { Routes } from '@angular/router';

// TODO: Replace with your real components
import { DiscoverServersPageComponent } from './pages/servers-page.component';
import { DiscoverQuestsPageComponent } from './pages/quests-page.component';

export const DISCOVER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'servers',
    pathMatch: 'full',
  },
  {
    path: 'servers',
    component: DiscoverServersPageComponent,
  },
  {
    path: 'quests',
    component: DiscoverQuestsPageComponent,
  },
];
