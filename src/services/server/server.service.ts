import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * ChannelsService
 *
 * This service is responsible for providing channel / room related data
 * for the chat module. Right now, it only exposes the default room id
 * used by `RedirectDefaultRoomGuard` to redirect the user when they hit
 * the base `/message-channel` route.
 *
 * In the future, you can extend this service to:
 * - Fetch available channels/rooms from an API
 * - Store the user's last visited room and use it as the "default"
 * - Manage channel state, caching, etc.
 */
@Injectable({
  providedIn: 'root',
})
export class ServerService {
  /**
   * Returns the default room id for the message-channel route.
   *
   * The guard `RedirectDefaultRoomGuard` depends on this returning an
   * `Observable<string>` so that it can compose routing logic with RxJS.
   *
   * For now this is hardcoded, but you can replace this with a real API
   * call or some stateful logic (e.g. user preferences) later.
   */
  getDefaultServerId(): Observable<string> {
    // Example: redirect to a "general" room by default
    const defaultServerId = 'general';

    // If later you have async logic (e.g. HTTP request), replace this
    // `of(...)` with the appropriate observable chain.
    return of(defaultServerId);
  }
}
