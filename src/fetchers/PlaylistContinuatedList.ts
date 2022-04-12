import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import helpers from "./helpers";
import { ENDPOINT_BROWSE } from "../constants";
import { Video, WrappedHTTPClient } from "../main";
import { ContinuatedList } from "./ContinuatedList";

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