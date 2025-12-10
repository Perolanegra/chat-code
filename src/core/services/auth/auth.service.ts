import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthFacadeService } from './auth-facade.service';

/**
 * Simple shape of the global auth state exposed as Angular signals.
 *
 * You can extend this as needed (e.g. loading, error, token, roles, etc.).
 */
export interface AuthState {
  /**
   * Raw Firebase user object. Null when signed out.
   */
  user: User | null;

  /**
   * Convenience flag derived from the presence of a user.
   */
  isAuthenticated: boolean;
}

/**
 * AuthService
 *
 * Global, signal-based authentication state for the application.
 *
 * Responsibilities:
 * - Subscribe once to `AuthFacadeService.user$` (Firebase authState)
 * - Keep an in-memory signal of the current `User | null`
 * - Expose convenient, read-only signals for components and other services
 * - Provide small helper methods for updating / resetting state if needed
 *
 * Usage example:
 *   - In a component:
 *       constructor(private auth: AuthService) {}
 *
 *       readonly user = this.auth.user;
 *       readonly isAuthenticated = this.auth.isAuthenticated;
 *
 *   - In templates (v17+):
 *       @if (auth.isAuthenticated()) {
 *         <p>Hello {{ auth.user()?.email }}</p>
 *       }
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly facade = inject(AuthFacadeService);

  /**
   * Internal writable signal that holds the current `User | null`.
   * This is the single source of truth for the authenticated user.
   */
  private readonly _user: WritableSignal<User | null> = signal<User | null>(null);

  /**
   * Public read-only signal for the current user.
   * Components and other services should depend on this instead of the facade directly.
   */
  readonly user: Signal<User | null> = this._user.asReadonly();

  /**
   * Derived signal that returns `true` when a user is present.
   */
  readonly isAuthenticated: Signal<boolean> = computed(() => this._user() !== null);

  /**
   * Convenience selector that exposes the entire `AuthState` as a single signal.
   * This is useful when you want to inject and consume a single object.
   */
  readonly state: Signal<AuthState> = computed<AuthState>(() => ({
    user: this._user(),
    isAuthenticated: this._user() !== null,
  }));

  /**
   * Holds the subscription to `AuthFacadeService.user$` so we can clean up if ever needed.
   * In an application-wide singleton, this usually lives for the app lifetime.
   */
  private readonly authSub: Subscription;

  constructor() {
    // Subscribe once to the unified facade observable and sync it into the signal.
    // This bridges the RxJS authState observable with Angular's signal world.
    this.authSub = this.facade.user$.subscribe((user) => {
      // Keep state update minimal and explicit.
      this._user.set(user);
    });
  }

  /**
   * Manually clears the auth state in memory without touching Firebase.
   * Normally you should use `AuthFacadeService.signOut()` to actually sign the user out.
   *
   * This is useful as a defensive measure or for edge cases where you want to
   * reset local state separately (for example, when clearing cached data).
   */
  clearLocalState(): void {
    this._user.set(null);
  }

  /**
   * Optional: expose a hook to be called on app shutdown / module destroy.
   * In most Angular apps, a provided-in-root service lives for the whole lifetime,
   * but this method is here in case you ever want to clean it manually.
   */
  dispose(): void {
    // Unsubscribe from the facade observable to avoid potential memory leaks
    // if the service is ever destroyed or re-created in testing contexts.
    this.authSub.unsubscribe();
  }
}

/**
 * Summary of the implemented logic:
 *
 * 1. We inject `AuthFacadeService`, which already centralizes all auth providers
 *    (email/password and Google) and exposes a single `user$` observable.
 *
 * 2. Inside `AuthService` we create a private writable signal `_user` that
 *    represents `User | null`. This is our in-memory global auth state.
 *
 * 3. We expose:
 *      - `user`: read-only signal for `User | null`.
 *      - `isAuthenticated`: computed signal derived from `_user`.
 *      - `state`: computed signal returning `{ user, isAuthenticated }`.
 *
 * 4. In the constructor, we subscribe exactly once to `facade.user$` and
 *    update `_user` whenever Firebase auth state changes. This bridges the
 *    RxJS world (Firebase) to the Angular signal world (global state).
 *
 * 5. We keep a `Subscription` reference in case we ever need to explicitly
 *    clean it up (e.g. in tests or if the service is no longer singleton),
 *    and provide a `dispose()` helper for that.
 *
 * With this file in place you can now:
 *   - Inject `AuthService` anywhere in the app.
 *   - Use `auth.user()`, `auth.isAuthenticated()` or `auth.state()` in components,
 *     guards, standalone functions, etc., to access a consistent, signal-based
 *     global authentication state.
 */
