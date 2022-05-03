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
const Authenticator_1 = require("./Authenticator");
const HTTPClient_1 = require("./interfaces/HTTPClient");
const WrappedHTTPClient_1 = require("./WrappedHTTPClient");
const SearchContinuatedList_1 = require("./fetchers/SearchContinuatedList");
const Explorer_1 = require("./fetchers/Explorer");
const ContinuatedList_1 = require("./fetchers/ContinuatedList");
const User_1 = require("./fetchers/User");
const Playlist_1 = require("./interfaces/Playlist");
const constants_1 = require("./constants");
const main_1 = require("./main");
const helpers_1 = require("./fetchers/helpers");
class IYoutube {
    constructor(httpClient, storageAdapater) {
        this.rawHttpClient = httpClient;
        this.wrappedHttpClient = new WrappedHTTPClient_1.WrappedHTTPClient(this.rawHttpClient);
        this.storageAdapter = storageAdapater;
        this.authenticator = new Authenticator_1.Authenticator(this.rawHttpClient, this.storageAdapter);
        this.wrappedHttpClient.authorizationHeaderCallback = () => { return this.authenticator.getAuthorizationHeader(); };
        this.explorer = new Explorer_1.Explorer(this.wrappedHttpClient, this);
        this.user = new User_1.User(this.wrappedHttpClient, this);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (constants_1.DEBUG)
                console.log("");
            yield this.authenticator.init();
        });
    }
    search(term, type) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwErrorIfNotReady();
            var list = new SearchContinuatedList_1.SearchConitinuatedList(term, type, this.wrappedHttpClient);
            return list;
        });
    }
    searchProposals(term) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwErrorIfNotReady();
            const url = new URL(constants_1.ENDPOINT_SEARCH_SUGGEST);
            url.searchParams.set("client", "youtube");
            url.searchParams.set("gs_ri", "youtube");
            url.searchParams.set("ds", "yt");
            url.searchParams.set("q", term);
            const result = yield this.rawHttpClient.request({
                url: url.toString(),
                method: HTTPClient_1.HTTPRequestMethod.GET,
            });
            const resultJSONText = result.data.split("(")[1].split(")")[0];
            const resultsJSON = yield JSON.parse(resultJSONText)[1];
            const finalResults = resultsJSON.map((a) => ({ text: a[0] }));
            return finalResults;
        });
    }
    getPlaylist(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwErrorIfNotReady();
            var pl = new Playlist_1.Playlist(this.wrappedHttpClient);
            pl.playlistId = playlistId;
            yield pl.loadAll();
            return pl;
        });
    }
    getChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwErrorIfNotReady();
            var ch = new main_1.Channel(this.wrappedHttpClient);
            ch.channelId = channelId;
            yield ch.loadAll();
            return ch;
        });
    }
    getVideo(videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwErrorIfNotReady();
            var v = new main_1.Video(this.wrappedHttpClient);
            v.videoId = videoId;
            yield v.loadAll();
            return v;
        });
    }
    getWhatToWatch() {
        return new ContinuatedList_1.ContinuatedList({
            url: constants_1.ENDPOINT_BROWSE,
            method: HTTPClient_1.HTTPRequestMethod.POST,
            data: {
                browseId: "FEwhat_to_watch"
            }
        }, (data) => {
            const renderers = helpers_1.default.recursiveSearchForKey("richItemRenderer", data);
            let contents = helpers_1.default.recursiveSearchForKey("content", renderers);
            contents = contents.flat(1);
            return contents;
        }, this.wrappedHttpClient, true);
    }
    getExplorer() {
        return this.explorer;
    }
    getUser() {
        return this.user;
    }
    throwErrorIfNotReady() {
        if (!this.storageAdapter)
            throw new Error("The provided Storage Adapter was invalid");
        if (!this.rawHttpClient)
            throw new Error("The provided HTTP Client was invalid");
        if (this.authenticator.requiresLogin())
            throw new Error("This Instance of IYoutube is not authenticated");
    }
}
exports.default = IYoutube;
