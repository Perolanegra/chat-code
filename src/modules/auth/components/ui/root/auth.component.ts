import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacadeService } from '@core/app/services/auth/auth-facade.service';
import { Router } from '@angular/router';
import { RoomSeedService } from '@core/app/services/room-seed.service';

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
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthFacadeService);
  private readonly router = inject(Router);
  private readonly rds = inject(RoomSeedService);

  loadingEmail = false;
  error: string | null = null;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async signInWithEmail(): Promise<void> {
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

  async signUpWithEmail(): Promise<void> {
    if (this.form.invalid || this.loadingEmail) return;

    this.error = null;

    const { email, password } = this.form.getRawValue();

    try {
      await this.auth.signUpWithEmail(email, password);
      //TODO: right email/sms validate.
      //TODO: state que verifica a ultima rota do cara com o objetivo de levar ele pra ela
      //TODO: essas implementações estarão dentro de handler.controller.ts onde vamos chamar => state('auth') <- onde o auth.facade.service.ts
      //TODO:  vai consumir algumas implementações desse cara (handler.controller.ts) como middle-man
      this.router.navigate(['/direct-messages']);
    } catch (e: any) {
      this.error = this.normalizeError(e);
    } finally {
      this.loadingEmail = false;
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
