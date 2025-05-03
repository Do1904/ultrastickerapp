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
    replies?: ICommentModel[]; // 新しいカラムを追加
    createdAt: string; // or Date
    updatedAt: string; // or Date
}