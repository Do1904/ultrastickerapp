import { Routes } from '@angular/router';
import { StickerComponent } from './sticker/sticker.component';
import { DetailsComponent } from './details/details.component';
import { StickerFormComponent } from './sticker-form/sticker-form.component';
import { EditStickerComponent } from './edit-sticker/edit-sticker.component';
import { TopComponent } from './top/top.component';
import { MapComponent } from './map/map.component';


export const routeConfig: Routes = [
  {
    path: '',
    component: TopComponent,
    title: 'TOPpage'
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
    component: MapComponent,
    title: 'map'
  }
];

export default routeConfig;
