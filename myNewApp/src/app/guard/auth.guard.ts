import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

/**
 * ログイン必須のルートに付けるガード。
 * 未ログインならログイン画面へ飛ばし、元のURLを returnUrl として渡す。
 *
 * 注意: これはUXのためのものであって、セキュリティ境界ではない。
 * 実際の保護はバックエンドの requireAuth ミドルウェアが担う。
 */
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // SSR中は判定できないので通す(ブラウザ側で再評価される)
  if (typeof window === 'undefined') return true;

  // Firebaseのログイン状態復元を待つ
  await auth.restore();

  if (auth.isLoggedIn()) return true;

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
