import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
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
import { User } from '../model/user';
import { CommentService } from '../service/comments.service';
import { Comment } from '../model/comment';


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

export class DetailsComponent implements OnInit, AfterViewInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  stickerService = inject(StickerService);
  cheersService = inject(CheersService);
  putstickerService = inject(PutstickerService);
  commentService = inject(CommentService)

  public stickerDetail: StickerDetail | undefined;
  public users: User[] = [];
  public comments: Comment[] = [];
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

  constructor(private router: Router, private Sticker: any) { }


  async ngOnInit(): Promise<void> {
    this.stickerDetailId = Number(this.route.snapshot.params['id']);
    await this.getStickerInit(this.stickerDetailId);

    await this.getCheersStatusByStickerId(this.stickerDetailId);
  }

  ngAfterViewInit(): void {
    this.Sticker.init('.sticker');
  }

  getStickerInit = async (id: number | undefined): Promise<any | undefined> => {
    try {
      if (id !== undefined) {
        const response = await this.stickerService.getStickerById(id);
        console.info(response)
        this.stickerDetail = response.sticker;
        this.comments = response.comments;
        this.users = response.visiters;
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

  postComment = async (firstFlag: boolean, replyingCommentId: number | null) => {
    const stickerId = this.stickerDetailId;
    try {
      const comment = this.commentForm.value.comment;
      if (!comment) {
        alert('Please enter a comment');
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
    try {
      if (commentId !== undefined) {
        await this.commentService.deleteComment(commentId);
        alert('You deleted comment!!');
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

}
