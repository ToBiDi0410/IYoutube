import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import helpers from "./helpers";
import { Video } from "../interfaces/Video";
import IYoutubeClient from "../main";
import { ENDPOINT_BROWSE } from "../constants";

export class Explorer {
    httpclient: WrappedHTTPClient;
    client: IYoutubeClient;

    constructor(httpclient : WrappedHTTPClient, client: IYoutubeClient) {
        this.httpclient = httpclient;
        this.client = client;
    }

    async getPopularVideos():Promise<Array<Video>> {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_BROWSE,
            params: {
                prettyPrint: false
            },
            data: {
                browseId: "FEexplore"
            }
        });
        const resJSON = await JSON.parse(res.data);
        
        const popularShelf = helpers.recursiveSearchForKey("expandedShelfContentsRenderer", resJSON)[0];
        let items = popularShelf.items;
        items = helpers.processRendererItems(items, this.httpclient);
        return items;
    }

    async getTrendsNow():Promise<Array<Video>> {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_BROWSE,
            params: {
                prettyPrint: false
            },
            data: {
                browseId: "FEtrending",
                params: "6gQJRkVleHBsb3Jl"
            }
        });

        const resJSON = await JSON.parse(res.data);

        const categorieShelfs:Array<any> = helpers.recursiveSearchForKey("tabs", resJSON)[0];
        const requestedShelf = categorieShelfs.find((a:any) => { return a.tabRenderer.title == "Now" });
        const sectionListRenderer = helpers.recursiveSearchForKey("expandedShelfContentsRenderer", requestedShelf);
        let items = sectionListRenderer.map((a) => ( a.items ));
        items = [...items[0], ...items[1]];
        items = helpers.processRendererItems(items, this.httpclient);
        return items;
    }
}
