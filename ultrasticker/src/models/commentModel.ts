import type { RowDataPacket } from 'mysql2/promise';

export interface ICommentModel extends RowDataPacket {
    id: number;
    comment: string;
    user_id: bigint;
    sticker_id: bigint;
    reply_flag: boolean;
    first_flag: boolean;
    replying_comment_id?: number | null;
}