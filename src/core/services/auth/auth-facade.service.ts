import { inject, Injectable } from '@angular/core';
import { User, UserCredential } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { EmailPasswordAuthService } from './email-password/email-password-auth.service';
import { GoogleAuthService } from './google/google-auth.service';
/**
 * AuthFacadeService
 *
 * Minimal facade that unifies auth operations used by the app.
 * It delegates to specialized services for each provider:
 * - Email/password
 * - Google
 *
 * This keeps the rest of the codebase depending on a single, small surface.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthFacadeService {
  private readonly emailSvc = inject(EmailPasswordAuthService);
  private readonly googleSvc = inject(GoogleAuthService);

  /**
   * Emits the current Firebase user (or null) based on email/Google auth.
   * Both underlying services expose the same authState observable,
   * so subscribing to either one is enough.
   */
  readonly user$: Observable<User | null> = this.emailSvc.user$;

  // ---------------------------------------------------------------------------
  // Email/password methods
  // ---------------------------------------------------------------------------

  signInWithEmail(email: string, password: string): Promise<UserCredential> {
    return this.emailSvc.signIn(email, password);
  }

  signUpWithEmail(email: string, password: string): Promise<UserCredential> {
    return this.emailSvc.signUp(email, password);
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return this.emailSvc.sendResetEmail(email);
  }

  // ---------------------------------------------------------------------------
  // Google methods
  // ---------------------------------------------------------------------------

  signInWithGooglePopup(): Promise<UserCredential> {
    return this.googleSvc.signInWithPopup();
  }

  signInWithGoogleRedirect(): Promise<void> {
    return this.googleSvc.signInWithRedirect();
  }

  getGoogleRedirectResult(): Promise<UserCredential | null> {
    return this.googleSvc.getRedirectResult();
  }

  // ---------------------------------------------------------------------------
  // Common
  // ---------------------------------------------------------------------------

  signOut(): Promise<void> {
    // Any sign-out call will sign out the current Firebase user for all providers.
    return this.emailSvc.signOut();
  }
}
