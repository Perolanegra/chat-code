import { inject, Injectable } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

/**
 * EmailPasswordAuthService
 *
 * Thin, focused wrapper around Firebase Authentication for the
 * email/password provider.
 *
 * Responsibilities:
 * - Sign in with email & password
 * - Register user with email & password
 * - Send password reset emails
 * - Expose the current auth state as an observable
 * - Sign out
 *
 * This service does not handle UI, routing or error translation;
 * it only forwards calls to Firebase and returns the raw results.
 */
@Injectable({
  providedIn: 'root',
})
export class EmailPasswordAuthService {
  private readonly auth = inject(Auth);

  /**
   * Observable that emits the current Firebase user (or null when signed out).
   * Useful for guards, header components, etc.
   */
  readonly user$: Observable<User | null> = authState(this.auth);

  /**
   * Signs in a user with email and password.
   *
   * @param email User email
   * @param password User password
   */
  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Creates a new user with email and password.
   *
   * @param email User email
   * @param password User password
   */
  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Sends a password reset email to the given address.
   *
   * @param email Target email for reset link
   */
  sendResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Signs out the currently authenticated user.
   */
  signOut(): Promise<void> {
    return signOut(this.auth);
  }
}
