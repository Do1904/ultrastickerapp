import { Routes } from '@angular/router';
import { StickerComponent } from './components/sticker/sticker.component';
import { DetailsComponent } from './components/details/details.component';
import { StickerFormComponent } from './components/sticker-form/sticker-form.component';
import { EditStickerComponent } from './components/edit-sticker/edit-sticker.component';
import { TopComponent } from './components/top/top.component';
import { MapComponent } from './components/map/map.component';


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
    path: 'putSticker',
    component: StickerFormComponent,
    title: 'put new Sticker'
  },
  {
    path: 'editSticker/:id',
    component: EditStickerComponent,
    title: 'edit Sticker'
  },
  {
    path: 'map',
    redirectTo: '',
    pathMatch: 'full'
  }
];

export default routeConfig;
