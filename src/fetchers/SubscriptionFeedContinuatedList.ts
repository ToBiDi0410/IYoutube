import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import helpers from "./helpers";
import { ContinuatedList } from "./ContinuatedList";
import { ENDPOINT_BROWSE } from "../constants";

export class SubscriptionFeedContinuatedList extends ContinuatedList {
    constructor(httpclient : WrappedHTTPClient) {
        super(
        /* Request Options */
        {
            url: ENDPOINT_BROWSE,
            method: HTTPRequestMethod.POST,
            data: { 
                browseId: "FEsubscriptions"
             },
            params: {
                prettyPrint: false
            }
        },
        
        /* Processor */
        async function(resJSON:any) {
            let itemSectionRenderer = helpers.recursiveSearchForKey("itemSectionRenderer", resJSON);
            if(itemSectionRenderer.length > 0) itemSectionRenderer = itemSectionRenderer[itemSectionRenderer.length - 1];
            else itemSectionRenderer = itemSectionRenderer[0];

            const gridRenderers = helpers.recursiveSearchForKey("gridRenderer", resJSON);
            let items:any = gridRenderers.map((a:any) => (a.items));
            items = items.flat(1);
            return items;
        },
        
        /* Http Client */
        httpclient);
    }
}