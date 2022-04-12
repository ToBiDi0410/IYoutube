import { ENDPOINT_NEXT } from "../constants";
import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import { ContinuatedList, WrappedHTTPClient } from "../main";
import helpers from "./helpers";

export class CommentThreadRepliesContinuatedList extends ContinuatedList {

    constructor(initialContinuationToken : string, httpclient : WrappedHTTPClient) {
        super(
            /* Request Options */
            {
                url: ENDPOINT_NEXT,
                method: HTTPRequestMethod.POST,
            },
            
            /* Processor */
            async function(resJSON:any) {
                const continuationItems = helpers.recursiveSearchForKey("continuationItems", resJSON)[0];
                return continuationItems;
            },
            
            /* Http Client */
            httpclient, false);
        this.continuationToken = initialContinuationToken;
    }
}