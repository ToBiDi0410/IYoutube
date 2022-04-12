/// <reference types="node" />
import { Channel } from "diagnostics_channel";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { HTTPRequestOptions } from "../interfaces/HTTPClient";
import { Playlist } from "../interfaces/Playlist";
import { Video } from "../interfaces/Video";
export declare class ContinuatedList {
    #private;
    results: Array<Video | Channel | Playlist>;
    endReached: boolean;
    onlyContinuation: boolean;
    constructor(requestOptions: HTTPRequestOptions, dataprocessor: Function, httpclient: WrappedHTTPClient, onlyContinuation?: boolean);
    loadFurhter(): Promise<any>;
    getByType(type: typeof Video | typeof Playlist | typeof Channel): (Video | Playlist | Channel)[];
}
