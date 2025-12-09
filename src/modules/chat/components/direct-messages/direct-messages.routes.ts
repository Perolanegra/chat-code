import { Routes } from '@angular/router';

import { DmShellComponent } from './dm-shell.component';

// Child pages

import { FriendsPageComponent } from './pages/friends-page.component';

import { MessageRequestsPageComponent } from './pages/message-requests-page.component';

import { NitroPageComponent } from './pages/nitro-page.component';

import { ShopPageComponent } from './pages/shop-page.component';

import { QuestsPageComponent } from './pages/quests-page.component';

import { MessagesPageComponent } from './pages/messages-page.component';

export const DIRECT_MESSAGES_ROUTES: Routes = [
  {
    path: 'dm',

    component: DmShellComponent,

    children: [
      {
        path: '',

        pathMatch: 'full',

        redirectTo: 'friends',
      },

      {
        path: 'friends',

        component: FriendsPageComponent,
      },

      {
        path: 'messages',
        component: MessagesPageComponent,
      },
      {
        path: 'message-requests',
        component: MessageRequestsPageComponent,
      },
      {
        path: 'nitro',
        component: NitroPageComponent,
      },

      {
        path: 'shop',

        component: ShopPageComponent,
      },

      {
        path: 'quests',

        component: QuestsPageComponent,
      },
    ],
  },

  {
    path: '',

    pathMatch: 'full',

    redirectTo: 'dm',
  },
];
