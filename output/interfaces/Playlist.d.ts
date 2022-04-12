import { PlaylistContinuatedList } from "../fetchers/PlaylistContinuatedList";
import { Video, Thumbnail, Channel, WrappedHTTPClient } from "../main";
export declare class Playlist {
    #private;
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
    httpclient: WrappedHTTPClient;
    constructor(httpclient: WrappedHTTPClient);
    fromPlaylistRenderer(obj: any): void;
    fromPlaylistAddToOptionRenderer(obj: any): void;
    loadAll(): Promise<void>;
    getContinuatedList(): PlaylistContinuatedList;
    like(): Promise<boolean>;
    removeLike(): Promise<boolean>;
}
