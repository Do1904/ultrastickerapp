import { selectQuery } from "../db/queryUtils.js";
import { ICommentModel } from "../models/commentModel.js";

async function getComments() {
    const query = 'SELECT * FROM comments';

    return await selectQuery<ICommentModel[]>(query, []);
}

export { getComments };