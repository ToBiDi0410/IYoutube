import { ENDPOINT_NEXT } from "../constants";
import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { ContinuatedList } from "./ContinuatedList";
import helpers from "./helpers";

export class CommentSectionContinuatedList extends ContinuatedList {
    constructor(initialContinuationToken : string, httpclient: WrappedHTTPClient) {
        super(
            /* Request Options */
            {
                url: ENDPOINT_NEXT,
                method: HTTPRequestMethod.POST,
            },
            
            /* Processor */
            async function(resJSON:any) {
                const continuationItems = helpers.recursiveSearchForKey("continuationItems", resJSON)[1];
                return continuationItems;
            },
            
            /* Http Client */
            httpclient, false);
        this.continuationToken = initialContinuationToken;
    }
}