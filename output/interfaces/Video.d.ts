import { ContinuatedList, WrappedHTTPClient, Channel, Thumbnail } from "../main";
export declare class Video {
    videoId?: any;
    title?: string;
    shortDescription?: string;
    viewCount?: number;
    thumbnails?: Array<Thumbnail>;
    richThumbnails?: Array<Thumbnail>;
    publishedText?: string;
    owner?: Channel;
    playable?: boolean;
    httpclient: WrappedHTTPClient;
    error: boolean;
    constructor(httpclient: WrappedHTTPClient);
    fromVideoRenderer(obj: any): void;
    fromGridRenderer(obj: any): void;
    fromPlaylistVideoRenderer(obj: any): void;
    getCommentThreadList(): Promise<ContinuatedList>;
    like(): Promise<boolean>;
    dislike(): Promise<boolean>;
    removeLike(): Promise<boolean>;
}
