import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { ContinuatedList } from "./ContinuatedList";
export declare class CommentSectionContinuatedList extends ContinuatedList {
    constructor(initialContinuationToken: string, httpclient: WrappedHTTPClient);
}
