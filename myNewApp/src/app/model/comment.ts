export interface Comment {
    id: number;
    comment: string;
    userId: number;
    stickerId: number;
    replyFlag: boolean;
    firstFlag: boolean;
    replyingCommentId: number | null;
    status: number;
    likesCount: number;
    isEdited: boolean;
    createdAt: string; // or Date
    updatedAt: string; // or Date
}