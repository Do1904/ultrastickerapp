import { insertQuery, selectQuery } from "../db/queryUtils.js";
import { ICommentModel } from "../models/commentModel.js";

async function getCommentsByStickerId(stickerId: number): Promise<ICommentModel[]> {
    const query = `
    SELECT
        id,
        comment,
        user_id AS userId,
        sticker_id AS stickerId,
        first_flag AS firstFlag,
        replying_comment_id AS replyingCommentId,
        status,
        likes_count AS likesCount,
        is_edited AS isEdited,
        created_at AS createdAt,
        updated_at AS updatedAt
    FROM 
        comments 
    WHERE 
        sticker_id = ?;`;

    const result = await selectQuery<ICommentModel>(query, [stickerId]);
    return result || [];
}

async function postComment(
    comment: string,
    userId: number,
    stickerId: number,
    firstFlag: boolean,
    replyingCommentId: number,
): Promise<void> {
    const query = `
    INSERT INTO comments (
        comment,
        user_id,
        sticker_id,
        first_flag,
        replying_comment_id,
        status,
        likes_count,
        is_edited
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        comment,
        userId,
        stickerId,
        firstFlag,
        replyingCommentId,
        1,
        0,
        false
    ];

    await insertQuery(query, values);
}

export { getCommentsByStickerId, postComment };