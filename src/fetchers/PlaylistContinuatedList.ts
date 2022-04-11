import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import helpers from "./helpers";
import { ContinuatedList } from "./ContinuatedList";
import { ENDPOINT_BROWSE } from "../constants";

export class PlaylistContinuatedList extends ContinuatedList {
    constructor(playlistId : string, httpclient : WrappedHTTPClient) {
        super(
        /* Request Options */
        {
            url: ENDPOINT_BROWSE,
            method: HTTPRequestMethod.POST,
            data: { 
                browseId: "VL" + playlistId
            }
        },
        
        /* Processor */
        async function(resJSON:any) {
            const continuationItemsContainer = helpers.recursiveSearchForKey("continuationItems", resJSON)[0];
            if(continuationItemsContainer) {
                return continuationItemsContainer;
            } else {
                let itemSectionRenderer = helpers.recursiveSearchForKey("playlistVideoListRenderer", resJSON)[0];
                const items = helpers.recursiveSearchForKey("contents", itemSectionRenderer)[0];
                return items;
            }
            
        },
        
        /* Http Client */
        httpclient, true);
    }
}