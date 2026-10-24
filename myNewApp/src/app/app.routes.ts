import { Routes } from '@angular/router';
import { StickerComponent } from './components/sticker/sticker.component';
import { DetailsComponent } from './components/details/details.component';
import { StickerFormComponent } from './components/sticker-form/sticker-form.component';
import { EditStickerComponent } from './components/edit-sticker/edit-sticker.component';
import { TopComponent } from './components/top/top.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guard/auth.guard';


export const routeConfig: Routes = [
  {
    path: '',
    component: MapComponent,
    title: 'Football Sticker Map Japan'
  },
  {
    path: 'about',
    component: TopComponent,
    title: 'About | Football Sticker Map Japan'
  },
  {
    path: 'allStickers',
    component: StickerComponent,
    title: 'sticker page'
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'sticker details'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'ログイン | Football Sticker Map Japan'
  },
  {
    path: 'putSticker',
    component: StickerFormComponent,
    title: 'put new Sticker',
    canActivate: [authGuard]
  },
  {
    path: 'editSticker/:id',
    component: EditStickerComponent,
    title: 'edit Sticker',
    canActivate: [authGuard]
  },
  {
    path: 'map',
    redirectTo: '',
    pathMatch: 'full'
  }
];

export default routeConfig;
