import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacadeService } from '@services/auth/auth-facade.service';

/**
 * AuthLoginComponent
 *
 * Standalone login component that exposes:
 * - Email/password login
 * - Google provider login
 *
 * This component is intentionally minimal and UI-agnostic. You can
 * replace the template with your design system components later.
 */
@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthFacadeService);

  loadingEmail = false;
  loadingGoogle = false;
  error: string | null = null;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async onSubmitEmailPassword(): Promise<void> {
    if (this.form.invalid || this.loadingEmail) return;

    this.error = null;
    this.loadingEmail = true;

    const { email, password } = this.form.getRawValue();

    try {
      await this.auth.signInWithEmail(email, password);
      // Optionally navigate after successful login (handled elsewhere).
    } catch (e: any) {
      this.error = this.normalizeError(e);
    } finally {
      this.loadingEmail = false;
    }
  }

  async onSignInWithGoogle(): Promise<void> {
    if (this.loadingGoogle) return;

    this.error = null;
    this.loadingGoogle = true;

    try {
      await this.auth.signInWithGooglePopup();
      // Optionally navigate after successful login (handled elsewhere).
    } catch (e: any) {
      this.error = this.normalizeError(e);
    } finally {
      this.loadingGoogle = false;
    }
  }

  /**
   * Maps raw auth errors to concise, user-friendly messages.
   * Adjust as needed for your UX and i18n strategy.
   */
  private normalizeError(err: any): string {
    const code = err?.code ?? '';

    if (code.includes('auth/invalid-email')) {
      return 'Invalid email address.';
    }
    if (code.includes('auth/user-not-found') || code.includes('auth/wrong-password')) {
      return 'Invalid email or password.';
    }
    if (code.includes('auth/popup-closed-by-user')) {
      return 'The login popup was closed before completing the sign in.';
    }
    if (code.includes('auth/popup-blocked')) {
      return 'The login popup was blocked by the browser.';
    }

    return 'Could not sign in. Please try again.';
  }
}
