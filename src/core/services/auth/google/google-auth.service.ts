import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  UserCredential,
  authState,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

/**
 * GoogleAuthService
 *
 * Thin wrapper around Firebase Authentication for the Google provider.
 *
 * Responsibilities:
 * - Sign in with Google using popup or redirect
 * - Retrieve redirect result after redirect-based sign-in
 * - Expose the current auth state as an observable
 * - Sign out
 *
 * This service does not handle routing or UI, it only forwards calls
 * to Firebase and returns the raw results.
 */
@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private readonly auth = inject(Auth);
  private readonly provider = new GoogleAuthProvider();

  /**
   * Observable that emits the current Firebase user (or null when signed out).
   */
  readonly user$: Observable<User | null> = authState(this.auth);

  /**
   * Signs in with Google using a popup window.
   *
   * Use this in desktop / environments where popups are allowed.
   */
  signInWithPopup(): Promise<UserCredential> {
    return signInWithPopup(this.auth, this.provider);
  }

  /**
   * Starts a Google sign-in flow using redirect.
   *
   * Use this for environments where popups are blocked (some mobile browsers).
   * After redirect back to the app, call `getRedirectResult()` to complete.
   */
  signInWithRedirect(): Promise<void> {
    return signInWithRedirect(this.auth, this.provider);
  }

  /**
   * Completes a redirect-based Google sign-in flow.
   *
   * Call this once on app startup (e.g. in a bootstrap/init service) to
   * finalize a previous `signInWithRedirect` call.
   */
  getRedirectResult(): Promise<UserCredential | null> {
    return getRedirectResult(this.auth);
  }

  /**
   * Signs out the currently authenticated user.
   */
  signOut(): Promise<void> {
    return signOut(this.auth);
  }
}
