import { Channel, WrappedHTTPClient } from "../main";
export declare class Comment {
    #private;
    httpclient: WrappedHTTPClient;
    commentId?: string;
    text?: string;
    author?: Channel;
    authorIsChannelOwner?: boolean;
    likeCount?: number;
    hasLiked?: boolean;
    publishedText?: string;
    canPerformLikeActions?: boolean;
    constructor(httpclient: WrappedHTTPClient);
    fromCommentRenderer(obj: any): void;
    like(): Promise<boolean>;
    dislike(): Promise<boolean>;
    removeLike(): Promise<boolean>;
}
