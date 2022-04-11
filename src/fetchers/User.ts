import { Channel } from "diagnostics_channel";
import { ContinuatedList } from "./ContinuatedList";
import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import { Playlist } from "../interfaces/Playlist";
import IYoutubeClient from "../main";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import helpers from "./helpers";
import { SubscriptionFeedContinuatedList } from "./SubscriptionFeedContinuatedList";
import { ENDPOINT_ADDTOPLAYLIST, ENDPOINT_BROWSE } from "../constants";

export class User {
    httpclient: WrappedHTTPClient;
    client : IYoutubeClient;

    constructor(httpclient : WrappedHTTPClient, client: IYoutubeClient) {
        this.httpclient = httpclient;
        this.client = client;
    }

    async getPlaylists():Promise<Array<Playlist>> {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_ADDTOPLAYLIST,
            params: { prettyPrint: false },
            data: { 
                videoIds: ["p2_nQCVPJV8"],
                excludeWatchLater: true
            }
        });
        const resJSON = await JSON.parse(res.data);

        let playlists = helpers.recursiveSearchForKey("playlists", resJSON)[0];
        playlists = playlists.map((a:any) => {
            var playlist = new Playlist(this.httpclient);
            playlist.fromPlaylistAddToOptionRenderer(a.playlistAddToOptionRenderer);
            return playlist;
        });

        return playlists;
    }

    async getWatchLaterPlaylist() {
        return await this.client.getPlaylist("WL");
    }

    async getLikedPlaylist() {
        return await this.client.getPlaylist("LL");
    }

    async getSubscriptions():Promise<Array<Channel>> {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_BROWSE,
            params: { prettyPrint: false },
            data: { browseId: "FEchannels" }
        });
        const resJSON = await JSON.parse(res.data);

        const expandedShelfContentsRenderer = helpers.recursiveSearchForKey("expandedShelfContentsRenderer", resJSON)[0];
        let items = expandedShelfContentsRenderer.items;
        items = helpers.processRendererItems(items, this.httpclient);
        return items;
    }

    getSubscriptionFeed():ContinuatedList {
        return new SubscriptionFeedContinuatedList(this.httpclient);
    }
}