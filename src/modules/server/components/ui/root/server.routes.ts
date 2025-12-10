import { Routes } from '@angular/router';
import { ServerPageComponent } from './pages/server-page.component';
import { RedirectDefaultServerGuard } from '@modules-chat-guards/server.guard';
import { RedirectDefaultRoomGuard } from '@modules-chat-guards/room.guard';
import { ChannelComponent } from '@modules-chat-ui/channel/channel.component';

export const SERVER_ROUTES: Routes = [
  { path: '', canActivate: [RedirectDefaultServerGuard] },
  {
    path: ':serverId',
    component: ServerPageComponent,
    children: [
      // subrotas do canal -> we need ServerSettingsRoute in here so we set the Server configuration
      // { path: 'settings', component: ServerSettingsComponent },
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
    ],
  },
];
