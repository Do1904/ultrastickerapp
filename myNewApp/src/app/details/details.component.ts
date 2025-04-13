import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StickerService } from '../service/sticker.service';
import { PutstickerService } from '../service/putsticker.service';
import { StickerDetail } from '../model/stickerdetail';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CheersService } from '../service/cheers.service';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl:
    'details.component.html',
  styleUrl: './details.component.css'
})

export class DetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  stickerService = inject(StickerService);
  cheersService = inject(CheersService);
  putstickerService = inject(PutstickerService);

  public stickerDetail: StickerDetail | undefined;
  public loginUserId = 1

  // cheers総数
  public cheers: number = 0;
  // ログインユーザーがcheerを送ったかどうか
  public isCheerSentByLoginUser: boolean = false;
  // stickerDetailId
  public stickerDetailId: number = 0;

  commentForm = new FormGroup({
    comment: new FormControl(''),
  });

  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.stickerDetailId = Number(this.route.snapshot.params['id']);
    this.stickerDetail = await this.getStickerInit(this.stickerDetailId);

    await this.getCheersStatusByStickerId(this.stickerDetailId);
  }

  submitComment() {
    this.stickerService.submitComment(
      this.commentForm.value.comment ?? 'hi',
    );
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

  sendCheers = async (id: number | undefined) => {
    try {
      if (id !== undefined) {
        await this.cheersService.sendCheers(id);
        alert('You sent cheers!!');
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }

    await this.getCheersStatusByStickerId(this.stickerDetailId);
  }

  deleteCheers = async (id: number | undefined) => {
    try {
      if (id !== undefined) {
        await this.cheersService.deleteCheers(id);
        alert('You deleted cheers!!');
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }

    await this.getCheersStatusByStickerId(this.stickerDetailId);
  }

  deleteSticker = async (stickerId: number | undefined) => {
    try {
      if (stickerId !== undefined) {
        await this.putstickerService.deleteSticker(stickerId);
        alert('You deleted sticker!!');
        this.router.navigate(['/allStickers']); // 遷移先のURLを指定
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }
  }

  getCheersStatusByStickerId = async (id: number | undefined): Promise<any | undefined> => {
    try {
      if (id !== undefined) {
        const response = await this.cheersService.getCheersByStickerId(id);
        this.isCheerSentByLoginUser = response.isCheerSentByLoginUser;
        this.cheers = response.totalCheers;
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }
  }

}
