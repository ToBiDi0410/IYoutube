import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { ContinuatedList } from "./ContinuatedList";
export declare class CommentContinuatedList extends ContinuatedList {
    constructor(videoId: string, httpclient: WrappedHTTPClient);
}
