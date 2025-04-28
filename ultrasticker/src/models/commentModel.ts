import type { RowDataPacket } from 'mysql2/promise';

export interface ICommentModel extends RowDataPacket {
    id: number;
    comment: string;
    userId: number;
    stickerId: number;
    firstFlag: boolean;
    replyingCommentId: number | null;
    status: number;
    likesCount: number;
    isEdited: boolean;
    createdAt: string; // or Date
    updatedAt: string; // or Date
}