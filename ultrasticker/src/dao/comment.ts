import { selectQuery } from "../db/queryUtils.js";
import { ICommentModel } from "../models/commentModel.js";

async function getCommentsByStickerId(stickerId: number): Promise<ICommentModel[]> {
    const query = `
    SELECT
        id,
        comment,
        user_id AS userId,
        sticker_id AS stickerId,
        reply_flag AS replyFlag,
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

export { getCommentsByStickerId };