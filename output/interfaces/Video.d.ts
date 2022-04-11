import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { Channel } from "./Channel";
import { Thumbnail } from "./Thumbnail";
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
    like(): Promise<boolean>;
    dislike(): Promise<boolean>;
    removeLike(): Promise<boolean>;
}
