import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

/** フッターを表示しないルート(全画面レイアウトのページ) */
const FULLSCREEN_ROUTES = ['/'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Football Sticker Map Japan';
  showFooter = false; // 初期ルートは地図(/)なので非表示から開始

  constructor(router: Router) {
    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const path = event.urlAfterRedirects.split('?')[0].split('#')[0];
        this.showFooter = !FULLSCREEN_ROUTES.includes(path);
      });
  }
}
