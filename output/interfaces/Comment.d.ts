import { Channel, WrappedHTTPClient } from "../main";
export declare class Comment {
    httpclient: WrappedHTTPClient;
    commentId?: string;
    text?: string;
    author?: Channel;
    authorIsChannelOwner?: boolean;
    likeCount?: number;
    hasLiked?: boolean;
    publishedText?: string;
    likeActionToken?: string;
    dislikeActionToken?: string;
    removeLikeActionToken?: string;
    removeDislikeActionToken?: string;
    canPerformLikeActions?: boolean;
    constructor(httpclient: WrappedHTTPClient);
    fromCommentRenderer(obj: any): void;
    like(): Promise<boolean>;
    dislike(): Promise<boolean>;
    removeLike(): Promise<boolean>;
}
