import helpers from "../fetchers/helpers";
import { WrappedHTTPClient, Comment, CommentThreadRepliesContinuatedList } from "../main"

export class CommentThread {
    httpclient: WrappedHTTPClient;

    comment?: Comment
    replieList?: CommentThreadRepliesContinuatedList;

    constructor(httpclient: WrappedHTTPClient) {
        this.httpclient = httpclient;
    }

    fromCommentThreadRenderer(obj: any) {
        this.comment = new Comment(this.httpclient);
        this.comment.fromCommentRenderer(obj.comment);

        const repliesRenderer = obj.replies;
        if(repliesRenderer) {
            this.replieList = new CommentThreadRepliesContinuatedList(helpers.recursiveSearchForKey("token", repliesRenderer).join(""), this.httpclient);
        }
    }
}