import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { ContinuatedList } from "./ContinuatedList";
export declare class PlaylistContinuatedList extends ContinuatedList {
    constructor(playlistId: string, httpclient: WrappedHTTPClient);
}
