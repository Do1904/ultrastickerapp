import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

type Mode = 'signin' | 'signup' | 'reset';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  mode = signal<Mode>('signin');
  loading = signal(false);
  errorMessage = signal('');
  infoMessage = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    // Firebaseの最低要件は6文字だが、破られやすいので8文字を下限にする
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.errorMessage.set('');
    this.infoMessage.set('');

    // パスワード再設定ではパスワード欄を使わない
    if (mode === 'reset') {
      this.passwordControl.disable();
    } else {
      this.passwordControl.enable();
    }
  }

  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
    this.router.navigateByUrl(returnUrl);
  }

  async submit(): Promise<void> {
    this.errorMessage.set('');
    this.infoMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.emailControl.value!;
    const password = this.passwordControl.value!;

    this.loading.set(true);
    try {
      if (this.mode() === 'signin') {
        await this.auth.signInWithEmail(email, password);
        this.redirectAfterLogin();
      } else if (this.mode() === 'signup') {
        await this.auth.signUpWithEmail(email, password);
        this.redirectAfterLogin();
      } else {
        await this.auth.sendPasswordReset(email);
        this.infoMessage.set(
          'パスワード再設定用のメールを送信しました。受信箱を確認してください。'
        );
      }
    } catch (error) {
      this.errorMessage.set(this.auth.translateError(error));
    } finally {
      this.loading.set(false);
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.errorMessage.set('');
    this.loading.set(true);
    try {
      await this.auth.signInWithGoogle();
      this.redirectAfterLogin();
    } catch (error) {
      this.errorMessage.set(this.auth.translateError(error));
    } finally {
      this.loading.set(false);
    }
  }
}
