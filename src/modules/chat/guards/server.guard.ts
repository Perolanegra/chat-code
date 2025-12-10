// redirect-default-server.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerService } from 'src/services/server/server.service';

@Injectable({ providedIn: 'root' })
export class RedirectDefaultServerGuard implements CanActivate {
  constructor(
    private svc: ServerService,
    private router: Router,
  ) {}

  canActivate(): Observable<UrlTree> {
    return this.svc
      .getDefaultServerId()
      .pipe(map((serverId) => this.router.createUrlTree(['/server', serverId])));
  }
}
