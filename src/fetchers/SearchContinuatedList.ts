import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import helpers from "./helpers";
import { ContinuatedList } from "./ContinuatedList";
import { ENDPOINT_SEARCH } from "../constants";

export class SearchConitinuatedList extends ContinuatedList {
    constructor(term : string, searchType: SearchType, httpclient : WrappedHTTPClient) {
        super(
        /* Request Options */
        {
            url: ENDPOINT_SEARCH,
            method: HTTPRequestMethod.POST,
            data: { 
                query: term,
                params: searchType
            }
        },
        
        /* Processor */
        async function(resJSON:any) {
            let itemSectionRenderer = helpers.recursiveSearchForKey("itemSectionRenderer", resJSON);
            if(itemSectionRenderer.length > 0) itemSectionRenderer = itemSectionRenderer[itemSectionRenderer.length - 1];
            else itemSectionRenderer = itemSectionRenderer[0];

            const items = helpers.recursiveSearchForKey("contents", itemSectionRenderer)[0];
            return items;
        },
        
        /* Http Client */
        httpclient);
    }
}

export enum SearchType {
    VIDEO = "EgIQAQ%3D%3D",
    CHANNEL = "EgIQAg%3D%3D",
    PLAYLIST = "EgIQAw%3D%3D",
    MOVIE = "EgIQBA%3D%3D",
    ANY = ""
}