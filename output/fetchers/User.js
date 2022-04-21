"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const main_1 = require("../main");
const HTTPClient_1 = require("../interfaces/HTTPClient");
const Playlist_1 = require("../interfaces/Playlist");
const helpers_1 = require("./helpers");
const SubscriptionFeedContinuatedList_1 = require("./SubscriptionFeedContinuatedList");
const constants_1 = require("../constants");
class User {
    constructor(httpclient, client) {
        this.httpclient = httpclient;
        this.client = client;
    }
    getPlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.throwErrorIfNotReady();
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_ADDTOPLAYLIST,
                params: { prettyPrint: false },
                data: {
                    videoIds: ["p2_nQCVPJV8"],
                    excludeWatchLater: true
                }
            });
            const resJSON = yield JSON.parse(res.data);
            let playlists = helpers_1.default.recursiveSearchForKey("playlists", resJSON)[0];
            playlists = playlists.map((a) => {
                var playlist = new Playlist_1.Playlist(this.httpclient);
                playlist.fromPlaylistAddToOptionRenderer(a.playlistAddToOptionRenderer);
                return playlist;
            });
            return new main_1.List(playlists);
        });
    }
    getWatchLaterPlaylist() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getPlaylist("WL");
        });
    }
    getLikedPlaylist() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getPlaylist("LL");
        });
    }
    getSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.throwErrorIfNotReady();
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_BROWSE,
                params: { prettyPrint: false },
                data: { browseId: "FEchannels" }
            });
            const resJSON = yield JSON.parse(res.data);
            const expandedShelfContentsRenderer = helpers_1.default.recursiveSearchForKey("expandedShelfContentsRenderer", resJSON)[0];
            let items = expandedShelfContentsRenderer.items;
            items = helpers_1.default.processRendererItems(items, this.httpclient);
            return new main_1.List(items);
        });
    }
    getSubscriptionFeed() {
        this.client.throwErrorIfNotReady();
        return new SubscriptionFeedContinuatedList_1.SubscriptionFeedContinuatedList(this.httpclient);
    }
}
exports.User = User;
