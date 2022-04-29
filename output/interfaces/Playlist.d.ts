import { PlaylistContinuatedList } from "../fetchers/PlaylistContinuatedList";
import { Video, Thumbnail, ContinuatedList, Channel, WrappedHTTPClient, Badge } from "../main";
export declare class Playlist {
    playlistId?: string;
    title?: string;
    description?: string;
    thumbnails?: Array<Thumbnail>;
    videoCount?: number;
    viewCount?: number;
    owner?: Channel;
    videos?: Array<Video>;
    canReorder?: boolean;
    isEditable?: boolean;
    lastEditText?: string;
    canLike?: boolean;
    badges?: Array<Badge>;
    privacyState?: "PRIVATE" | "UNLISTED" | "PUBLIC";
    httpclient: WrappedHTTPClient;
    continuatedList?: ContinuatedList;
    likeParam?: string;
    constructor(httpclient: WrappedHTTPClient);
    fromPlaylistRenderer(obj: any): void;
    fromGridPlaylistRenderer(obj: any): void;
    fromPlaylistAddToOptionRenderer(obj: any): void;
    loadAll(): Promise<void>;
    getContinuatedList(): PlaylistContinuatedList;
    like(): Promise<boolean>;
    removeLike(): Promise<boolean>;
}
