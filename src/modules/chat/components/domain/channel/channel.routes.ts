import { Routes } from "@angular/router";
import { ChannelComponent } from "./channel.component";
import { RedirectDefaultRoomGuard } from "../../../guards/room.guard";

export const CHANNEL_ROUTES: Routes = [
  { path: '', canActivate: [RedirectDefaultRoomGuard] },
  {
    path: ':roomId',
    component: ChannelComponent,
    children: [
      // subrotas do canal
      // { path: 'settings', component: ChannelSettingsComponent },
    ],
  },

]
