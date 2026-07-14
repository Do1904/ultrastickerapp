import { Injectable } from '@angular/core';
import { apiGet, apiPost } from './api-client';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    postComment(
        stickerId: number,
        comment: string,
        firstFlag: boolean,
        replyingCommentId: number | null
    ): Promise<any> {
        return apiPost('/comments/postComment', {
            stickerId,
            comment,
            firstFlag,
            replyingCommentId,
        });
    }

    getCommentsByStickerId(stickerId: number): Promise<any> {
        return apiGet(`/comments/comments/${stickerId}`);
    }

    deleteComment(commentId: number): Promise<any> {
        return apiPost('/comments/deleteComment', { commentId });
    }
}
