// redirect-default-room.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChannelService } from '@services/chat/channel/channel.service';

@Injectable({ providedIn: 'root' })
export class RedirectDefaultRoomGuard implements CanActivate {
  constructor(
    private svc: ChannelService,
    private router: Router,
  ) {}

  canActivate(): Observable<UrlTree> {
    return this.svc
      .getDefaultRoomId()
      .pipe(map((roomId) => this.router.createUrlTree(['/message-channel', roomId])));
  }
}
