import { CommentSectionContinuatedList, ContinuatedList, WrappedHTTPClient, Channel, Thumbnail, CaptionTrack, CommentThread } from "../main";
export declare class Video {
    videoId?: any;
    title?: string;
    shortDescription?: string;
    description?: string;
    viewCount?: number;
    thumbnails?: Array<Thumbnail>;
    richThumbnails?: Array<Thumbnail>;
    publishedText?: string;
    publishedDate?: Date;
    owner?: Channel;
    playable?: boolean;
    private?: boolean;
    listed?: boolean;
    live?: boolean;
    familySafe?: boolean;
    captionTracks?: Array<CaptionTrack>;
    keywords?: Array<String>;
    canLike?: boolean;
    hasLiked?: boolean;
    currentUserIsOwner?: boolean;
    commentThreadList?: CommentSectionContinuatedList;
    httpclient: WrappedHTTPClient;
    error: boolean;
    constructor(httpclient: WrappedHTTPClient);
    fromVideoRenderer(obj: any): void;
    fromGridRenderer(obj: any): void;
    fromPlaylistVideoRenderer(obj: any): void;
    loadAll(): Promise<void>;
    getCommentThreadList(): Promise<ContinuatedList | undefined>;
    like(): Promise<boolean>;
    dislike(): Promise<boolean>;
    removeLike(): Promise<boolean>;
    comment(text: string): Promise<CommentThread>;
}
