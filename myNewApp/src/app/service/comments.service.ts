import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private dataUrl = 'http://localhost:3000/comments';
    constructor(private http: HttpClient) { }

    postComment = async (stickerId: number, comment: string, firstFlag: boolean, replyingCommentId: number | null) => {
        try {
            const body = {
                stickerId: stickerId,
                comment: comment,
                firstFlag: firstFlag,
                replyingCommentId: replyingCommentId
            }
            const response = await axios.post(`${this.dataUrl}/postComment`, body);
            return response.data;
        } catch (error) {
            console.error('Error uploading sticker:', error);
            throw error;
        }
    }

    getCommentsByStickerId = async (stickerId: number) => {
        try {
            const response = await axios.get(`${this.dataUrl}/comments/${stickerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    }

    deleteComment = async (commentId: number) => {
        try {
            const response = await axios.post(`${this.dataUrl}/deleteComment`, { commentId: commentId });
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
}