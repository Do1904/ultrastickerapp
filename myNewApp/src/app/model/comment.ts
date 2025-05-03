export interface Comment {
    id: number;
    comment: string;
    userId: number;
    stickerId: number;
    firstFlag: boolean;
    replyingCommentId: number | null;
    status: number;
    likesCount: number;
    isEdited: boolean;
    replies?: Comment[]; // 新しいカラムを追加
    createdAt: string; // or Date
    updatedAt: string; // or Date
}