import { ENDPOINT_NEXT } from "../constants";
import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { ContinuatedList } from "./ContinuatedList";
import helpers from "./helpers";

export class CommentSectionContinuatedList extends ContinuatedList {
    constructor(videoId: string, httpclient: WrappedHTTPClient) {
        super(
            /* Request Options */
            {
                url: ENDPOINT_NEXT,
                method: HTTPRequestMethod.POST,
                data: { 
                    autonavState: "STATE_ON",
                    captionsRequested: true,
                    contentCheckOK: false,
                    params: "OALAAQHCAwtPUEhMX09MVzNkUQ%3D%3D",
                    racyCheckOk: false,
                    videoId: videoId,
                }
            },
            
            /* Processor */
            async function(resJSON:any) {
                const itemSectionRenderers = helpers.recursiveSearchForKey("itemSectionRenderer", resJSON);
                const commentSectionRenderer = itemSectionRenderers.find((a:any) => a.targetId == 'comments-section');

                if(commentSectionRenderer) return [];

                const continuationItems = helpers.recursiveSearchForKey("continuationItems", resJSON)[1];
                return continuationItems;
            },
            
            /* Http Client */
            httpclient, false);
    }
}