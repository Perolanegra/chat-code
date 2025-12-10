import { Routes } from '@angular/router';
import { DmShellComponent } from './dm-shell.component';

// Child pages
import { FriendsPageComponent } from './pages/friends-page.component';
import { MessageRequestsPageComponent } from './pages/message-requests-page.component';
import { NitroPageComponent } from './pages/nitro-page.component';
import { ShopPageComponent } from './pages/shop-page.component';
import { QuestsPageComponent } from './pages/quests-page.component';
import { MessagesPageComponent } from './pages/messages-page.component';
import { ChannelComponent } from '@modules-chat-ui/channel/channel.component';
import { RedirectDefaultRoomGuard } from '@modules-chat-guards/room.guard';

export const DIRECT_MESSAGES_ROUTES: Routes = [
  {
    path: '',
    component: DmShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'message-channel',
        canActivate: [RedirectDefaultRoomGuard],
      },
      {
        path: 'message-channel/:roomId',
        component: ChannelComponent,
        children: [
          // subrotas do canal -> we need ChannelSettingsRoute in here so we set the channel configuration
          // { path: 'settings', component: ChannelSettingsComponent },
        ],
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
];
