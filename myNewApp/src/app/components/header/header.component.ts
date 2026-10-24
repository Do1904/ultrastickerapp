import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  menuOpen = signal(false);

  async ngOnInit(): Promise<void> {
    // ログイン状態を復元し、ヘッダーの表示に反映する
    await this.auth.restore();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  /** 表示名(ニックネーム優先、無ければメールのローカル部) */
  displayName(): string {
    const user = this.auth.appUser();
    if (!user) return '';
    return user.nickname || user.email.split('@')[0];
  }

  initial(): string {
    const name = this.displayName();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  async signOut(): Promise<void> {
    this.menuOpen.set(false);
    try {
      await this.auth.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }
}
