import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PutstickerService } from '../service/putsticker.service';
import { StickerService } from '../service/sticker.service';
import { StickerDetail } from '../model/stickerdetail';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-sticker',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule],
  templateUrl: './edit-sticker.component.html',
  styleUrl: './edit-sticker.component.css'
})
export class EditStickerComponent implements OnInit {
  fileName: any;
  putstickerService: PutstickerService = inject(PutstickerService);
  stickerService: StickerService = inject(StickerService);
  stickerDetailId: number | undefined;
  stickerDetail: StickerDetail | undefined;
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    const stickerDetailId = Number(this.route.snapshot.params['id']);
    this.stickerDetailId = stickerDetailId;
    this.stickerDetail = await this.getStickerInit(stickerDetailId);
  }

  getStickerInit = async (id: number | undefined): Promise<StickerDetail | undefined> => {
    try {
      if (id !== undefined) {
        const response = await this.stickerService.getStickerById(id);
        return response;
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }
    return undefined;
  }

  updateSticker = async (form: NgForm): Promise<void> => {
    if (form.value) {
      const formValues: any = {
        id: this.stickerDetailId,
        club: form.value.club,
        league: form.value.league,
        address: form.value.address,
        country: form.value.country,
        isClean: form.value.isClean,
      }

      try {
        const response = await this.putstickerService.updateSticker(formValues);
      } catch (error) {
        console.error('There was an error!', error);
        alert(error); // エラーメッセージをユーザーに表示するなどの処理を追加
      }
    }
  }
}
