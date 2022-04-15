import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { HTTPRequestOptions } from "../interfaces/HTTPClient";
import { Video, Channel, Playlist, Comment, CommentThread } from "../main";
export declare class ContinuatedList {
    results: Array<Video | Channel | Playlist | Comment | CommentThread>;
    endReached: boolean;
    requestOptions: HTTPRequestOptions;
    httpclient: WrappedHTTPClient;
    dataprocessor: Function;
    continuationToken: string;
    onlyContinuation: boolean;
    constructor(requestOptions: HTTPRequestOptions, dataprocessor: Function, httpclient: WrappedHTTPClient, onlyContinuation?: boolean);
    loadFurhter(): Promise<any>;
    getByType(type: any): (Video | Channel | Playlist | Comment | CommentThread)[];
    getVideos(): Array<Video>;
    getPlaylists(): Array<Playlist>;
    getChannels(): Array<Channel>;
    getComments(): Array<Comment>;
    getCommentThreads(): Array<CommentThread>;
}
