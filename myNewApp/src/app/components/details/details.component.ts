import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StickerService } from '../../service/sticker.service';
import { PutstickerService } from '../../service/putsticker.service';
import { StickerDetail } from '../../model/stickerdetail';
import { AddressDetail } from '../../model/address';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CheersService } from '../../service/cheers.service';
import { User } from '../../model/user';
import { CommentService } from '../../service/comments.service';
import { Comment } from '../../model/comment';
import { clubMap, leagueMap, countryMap } from '../../const/clubMaps';
import { createColoredFlagSvg } from '../../const/flag';
import { AuthService } from '../../service/auth.service';
import { RouterModule } from '@angular/router';
import type * as Leaflet from 'leaflet';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl:
    'details.component.html',
  styleUrls: ['./details.component.css', '../../../sticker.css'],
})

export class DetailsComponent implements OnInit, OnDestroy {
  route: ActivatedRoute = inject(ActivatedRoute);
  stickerService = inject(StickerService);
  cheersService = inject(CheersService);
  putstickerService = inject(PutstickerService);
  commentService = inject(CommentService)
  auth = inject(AuthService);

  public stickerDetail: StickerDetail | undefined;
  public address: AddressDetail | undefined;
  public users: User[] = [];
  public comments: Comment[] = [];

  /** ログイン中のユーザーID。未ログインならnull。 */
  get loginUserId(): number | null {
    return this.auth.userId();
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  public clubName: string = '';
  public leagueName: string = '';
  public countryName: string = '';

  // cheers総数
  public cheers: number = 0;
  // ログインユーザーがcheerを送ったかどうか
  public isCheerSentByLoginUser: boolean = false;
  // stickerDetailId
  public stickerDetailId: number = 0;

  private locationMap: Leaflet.Map | null = null;

  commentForm = new FormGroup({
    comment: new FormControl(''),
  });

  constructor(private router: Router) { }


  async ngOnInit(): Promise<void> {
    // cheer済み判定はトークン付きで問い合わせる必要があるため、先に復元を待つ
    await this.auth.restore();

    this.stickerDetailId = Number(this.route.snapshot.params['id']);
    await this.getStickerInit(this.stickerDetailId);

    this.setStickerDetail(this.stickerDetail);

    await this.getCheersStatusByStickerId(this.stickerDetailId);

    // *ngIfで描画される#detailMapがDOMに反映されるのを1tick待ってから初期化する
    setTimeout(() => this.initLocationMap(), 0);
  }

  ngOnDestroy(): void {
    if (this.locationMap) {
      this.locationMap.remove();
      this.locationMap = null;
    }
  }

  getStickerInit = async (id: number | undefined): Promise<any | undefined> => {
    try {
      if (id !== undefined) {
        const response = await this.stickerService.getStickerById(id);
        this.stickerDetail = response.sticker;
        this.address = response.address;
        this.comments = response.comments;
        this.users = response.visiters;
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }
    return undefined;
  }

  setStickerDetail = (sticker: StickerDetail | undefined) => {
    if (sticker) {
      this.clubName = clubMap.get(sticker.clubId)?.clubName || '';
      this.leagueName = leagueMap.get(sticker.leagueId)?.leagueName || '';
      this.countryName = countryMap.get(sticker.countryId) || '';
    } else {
      console.warn('Sticker detail is undefined');
    }
  }

  /** 未ログインならログイン画面へ誘導する。戻り先は現在のステッカー詳細。 */
  private requireLogin(): boolean {
    if (this.isLoggedIn) return true;
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: `/details/${this.stickerDetailId}` },
    });
    return false;
  }

  sendCheers = async (id: number | undefined) => {
    if (!this.requireLogin()) return;
    try {
      if (id !== undefined) {
        await this.cheersService.sendCheers(id);
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }

    await this.getCheersStatusByStickerId(this.stickerDetailId);
  }

  deleteCheers = async (id: number | undefined) => {
    if (!this.requireLogin()) return;
    try {
      if (id !== undefined) {
        await this.cheersService.deleteCheers(id);
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }

    await this.getCheersStatusByStickerId(this.stickerDetailId);
  }

  deleteSticker = async (stickerId: number | undefined) => {
    if (!confirm('このステッカーを削除しますか？')) return;
    try {
      if (stickerId !== undefined) {
        await this.putstickerService.deleteSticker(stickerId);
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

  postComment = async (firstFlag: boolean, replyingCommentId: number | null) => {
    const stickerId = this.stickerDetailId;
    try {
      const comment = this.commentForm.value.comment;
      if (!comment) {
        alert('コメントを入力してください');
        return;
      }
      if (!this.isLoggedIn) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: `/details/${stickerId}` },
        });
        return;
      }
      const insertedResult = await this.commentService.postComment(stickerId, comment, firstFlag, replyingCommentId);

      const insertedComment = insertedResult.insertedComment;

      // 登録したコメントをコメント一覧に追加
      if (insertedComment.firstFlag) {
        this.comments.push(insertedComment);
      } else {
        const parentComment = this.comments.find(comment => comment.id === replyingCommentId);
        if (parentComment) {
          parentComment.replies?.push(insertedComment);
        }
      }

      this.commentForm.reset();
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }
  }

  getCommentByStickerId = async (stickerId: number | undefined): Promise<any | undefined> => {
    try {
      if (stickerId !== undefined) {
        const response = await this.commentService.getCommentsByStickerId(stickerId);
        this.comments = response.comments;
        this.users = response.visiters;
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }
  }

  deleteComment = async (commentId: number | undefined, isFirst: boolean, replyingCommentId: number | null) => {
    if (!confirm('このコメントを削除しますか？')) return;
    try {
      if (commentId !== undefined) {
        await this.commentService.deleteComment(commentId);
        if (isFirst) {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
        } else {
          // 親コメントのrepliesから削除
          const parentComment = this.comments.find(comment => comment.id === replyingCommentId);
          if (parentComment) {
            parentComment.replies = parentComment.replies?.filter(reply => reply.id !== commentId);
          }
        }
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert(error);
    }
  }

  // ================= 表示ヘルパー =================

  /** ユーザーIDからニックネーム(なければユーザー名)を解決する */
  userName(userId: number | undefined): string {
    if (userId === undefined) return '';
    const user = this.users.find(u => u.id === userId);
    if (!user) return `User ${userId}`;
    return (user.nickname as any) || user.username || `User ${userId}`;
  }

  /** アバターに表示する頭文字 */
  userInitial(userId: number | undefined): string {
    const name = this.userName(userId);
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  /** ユーザーIDから安定した色を生成する(アバター背景色) */
  userColor(userId: number | undefined): string {
    if (userId === undefined) return '#999';
    const hue = (userId * 47) % 360;
    return `hsl(${hue}, 55%, 45%)`;
  }

  /** 住所を1行のテキストにまとめる */
  get formattedAddress(): string {
    if (!this.address) return '';
    return [this.address.state, this.address.city, this.address.district]
      .filter(part => !!part)
      .join(' ');
  }

  get hasLocation(): boolean {
    return !!(this.stickerDetail?.latitude && this.stickerDetail?.longitude);
  }

  // ================= ミニ地図 =================

  private async initLocationMap(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (!this.hasLocation) return;

    const container = document.getElementById('detailMap');
    if (!container) return;

    const L = await import('leaflet');
    const lat = this.stickerDetail!.latitude!;
    const lng = this.stickerDetail!.longitude!;

    this.locationMap = L.map('detailMap', {
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: false,
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">©OpenStreetMap</a> contributors',
    }).addTo(this.locationMap);

    new L.Control.Zoom({ position: 'bottomright' }).addTo(this.locationMap);

    const club = this.stickerDetail ? clubMap.get(this.stickerDetail.clubId) : undefined;
    const svg = createColoredFlagSvg(club?.color1 ?? '#333333', club?.color2 ?? '#111111');
    const icon = L.icon({
      iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      iconSize: [40, 40],
      iconAnchor: [20, 32],
    });

    L.marker([lat, lng], { icon }).addTo(this.locationMap);
  }
}
