import { Channel, List } from "../main";
import { ContinuatedList } from "./ContinuatedList";
import { HTTPRequestMethod } from "../interfaces/HTTPClient";
import { Playlist } from "../interfaces/Playlist";
import IYoutube from "../IYoutube";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import helpers from "./helpers";
import { SubscriptionFeedContinuatedList } from "./SubscriptionFeedContinuatedList";
import { ENDPOINT_ADDTOPLAYLIST, ENDPOINT_BROWSE, ERROR_DATA_INVALID_FORMAT } from "../constants";

export class User {
    httpclient: WrappedHTTPClient;
    client : IYoutube;

    constructor(httpclient : WrappedHTTPClient, client: IYoutube) {
        this.httpclient = httpclient;
        this.client = client;
    }

    async getPlaylists():Promise<List> {
        this.client.throwErrorIfNotReady();
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_BROWSE,
            params: { prettyPrint: false },
            data: {
                browseId: "FElibrary"
            }
        });
        const resJSON = await JSON.parse(res.data);

        const itemSectionRenderers = helpers.recursiveSearchForKey("itemSectionRenderer", resJSON);
        const playlistItemSectionRenderer = itemSectionRenderers.find((a:any) => { 
            const title = helpers.recursiveSearchForKey("text", helpers.recursiveSearchForKey("shelfRenderer", a)[0].title).join("");
            return title.toLowerCase().includes("playlists");
        });

        if(!playlistItemSectionRenderer) throw ERROR_DATA_INVALID_FORMAT;

        let items = helpers.recursiveSearchForKey("items", playlistItemSectionRenderer)[0];
        items = helpers.processRendererItems(items, this.httpclient);

        return new List(items);
    }

    async getEditablePlaylists():Promise<List> {
        this.client.throwErrorIfNotReady();
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

        return new List(playlists);
    }

    async getWatchLaterPlaylist() {
        return await this.client.getPlaylist("WL");
    }

    async getLikedPlaylist() {
        return await this.client.getPlaylist("LL");
    }

    async getSubscriptions():Promise<List> {
        this.client.throwErrorIfNotReady();
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
        return new List(items);
    }

    getSubscriptionFeed():ContinuatedList {
        this.client.throwErrorIfNotReady();
        return new SubscriptionFeedContinuatedList(this.httpclient);
    }
}