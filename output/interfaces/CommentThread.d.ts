import { WrappedHTTPClient, Comment, CommentThreadRepliesContinuatedList } from "../main";
export declare class CommentThread {
    httpclient: WrappedHTTPClient;
    comment?: Comment;
    replieList?: CommentThreadRepliesContinuatedList;
    constructor(httpclient: WrappedHTTPClient);
    fromCommentThreadRenderer(obj: any): void;
}
