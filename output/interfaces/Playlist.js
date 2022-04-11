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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Playlist_continuatedList, _Playlist_likeParam;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
const helpers_1 = require("../fetchers/helpers");
const PlaylistContinuatedList_1 = require("../fetchers/PlaylistContinuatedList");
const Channel_1 = require("./Channel");
const HTTPClient_1 = require("./HTTPClient");
const constants_1 = require("../constants");
class Playlist {
    constructor(httpclient) {
        _Playlist_continuatedList.set(this, void 0);
        _Playlist_likeParam.set(this, void 0);
        this.httpclient = httpclient;
    }
    fromPlaylistRenderer(obj) {
        this.playlistId = helpers_1.default.recursiveSearchForKey("playlistId", obj)[0];
        const titleContainer = helpers_1.default.recursiveSearchForKey("title", obj)[0];
        if (titleContainer)
            this.title = helpers_1.default.recursiveSearchForKey("simpleText", titleContainer)[0];
        let thumbnailContainer = helpers_1.default.recursiveSearchForKey("playlistVideoThumbnailRenderer", obj)[0];
        if (thumbnailContainer)
            this.thumbnails = helpers_1.default.recursiveSearchForKey("thumbnails", thumbnailContainer)[0];
        this.videoCount = helpers_1.default.recursiveSearchForKey("videoCount", obj)[0];
        const channelContainer = helpers_1.default.recursiveSearchForKey("shortBylineText", obj)[0];
        if (channelContainer) {
            this.owner = new Channel_1.Channel(this.httpclient);
            this.owner.fromPlaylistRenderer(obj);
        }
    }
    fromPlaylistAddToOptionRenderer(obj) {
        this.playlistId = helpers_1.default.recursiveSearchForKey("playlistId", obj)[0];
    }
    loadAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_BROWSE,
                data: {
                    browseId: "VL" + this.playlistId
                }
            });
            if (res.status != 200)
                throw new Error("Invalid Response Code");
            const resJSON = yield JSON.parse(res.data);
            if (!resJSON.contents)
                throw new Error("Playlist not found");
            const playlistRendererContainer = helpers_1.default.recursiveSearchForKey("playlistVideoListRenderer", resJSON)[0];
            if (playlistRendererContainer) {
                this.canReorder = helpers_1.default.recursiveSearchForKey("canReorder", playlistRendererContainer)[0];
                this.isEditable = helpers_1.default.recursiveSearchForKey("isEditable", playlistRendererContainer)[0];
            }
            const primaryInfoRendererContainer = helpers_1.default.recursiveSearchForKey("playlistSidebarPrimaryInfoRenderer", resJSON)[0];
            if (primaryInfoRendererContainer) {
                const statsContainer = helpers_1.default.recursiveSearchForKey("stats", primaryInfoRendererContainer)[0];
                if (statsContainer) {
                    this.videoCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("text", statsContainer[0])[0]);
                    this.viewCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("simpleText", statsContainer[1])[0]);
                    this.lastEditText = helpers_1.default.recursiveSearchForKey("text", statsContainer[2]).join("");
                }
                const titleFormContainer = helpers_1.default.recursiveSearchForKey("titleForm", primaryInfoRendererContainer)[0];
                if (titleFormContainer)
                    this.title = helpers_1.default.recursiveSearchForKey("simpleText", helpers_1.default.recursiveSearchForKey("textDisplayed", titleFormContainer)[0]).join("");
                const titleContainer = primaryInfoRendererContainer.title;
                if (titleContainer)
                    this.title = helpers_1.default.recursiveSearchForKey("text", titleContainer).join("");
                const descriptionForm = helpers_1.default.recursiveSearchForKey("descriptionForm", primaryInfoRendererContainer)[0];
                if (descriptionForm)
                    this.description = helpers_1.default.recursiveSearchForKey("simpleText", helpers_1.default.recursiveSearchForKey("textDisplayed", descriptionForm)[0]).join("");
                const descriptionContainer = helpers_1.default.recursiveSearchForKey("description", primaryInfoRendererContainer)[0];
                if (descriptionContainer)
                    this.description = helpers_1.default.recursiveSearchForKey("text", descriptionContainer).join("");
                const thumbnailsContainer = helpers_1.default.recursiveSearchForKey("thumbnails", primaryInfoRendererContainer);
                if (thumbnailsContainer)
                    this.thumbnails = thumbnailsContainer;
                const likeButtonContainer = helpers_1.default.recursiveSearchForKey("toggleButtonRenderer", primaryInfoRendererContainer)[0];
                if (likeButtonContainer) {
                    this.canLike = true;
                    __classPrivateFieldSet(this, _Playlist_likeParam, helpers_1.default.recursiveSearchForKey("removeLikeParams", likeButtonContainer).join(""), "f");
                }
                else
                    this.canLike = false;
            }
            else
                throw new Error("PrimaryInfoRenderer was missing");
            const videoOwnerContainer = helpers_1.default.recursiveSearchForKey("videoOwner", resJSON)[0];
            if (videoOwnerContainer) {
                this.owner = new Channel_1.Channel(this.httpclient);
                this.owner.fromVideoOwnerRenderer(videoOwnerContainer);
            }
        });
    }
    getContinuatedList() {
        if (__classPrivateFieldGet(this, _Playlist_continuatedList, "f"))
            return __classPrivateFieldGet(this, _Playlist_continuatedList, "f");
        if (this.playlistId) {
            __classPrivateFieldSet(this, _Playlist_continuatedList, new PlaylistContinuatedList_1.PlaylistContinuatedList(this.playlistId, this.httpclient), "f");
            return this.getContinuatedList();
        }
        throw new Error("Cannot construct Continuated List for Playlist without the playlistID");
    }
    like() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _Playlist_likeParam, "f") || !this.canLike)
                throw new Error("Cannot add or remove Playlist because not all Data is loaded or it is not possible");
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_LIKE,
                params: { prettyPrint: false },
                data: {
                    params: __classPrivateFieldGet(this, _Playlist_likeParam, "f"),
                    target: {
                        playlistId: this.playlistId
                    }
                }
            });
            return res.status == 200;
        });
    }
    removeLike() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _Playlist_likeParam, "f") || !this.canLike)
                throw new Error("Cannot add or remove Playlist because not all Data is loaded or its forbidden");
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_REMOVELIKE,
                params: { prettyPrint: false },
                data: {
                    params: __classPrivateFieldGet(this, _Playlist_likeParam, "f"),
                    target: {
                        playlistId: this.playlistId
                    }
                }
            });
            return res.status == 200;
        });
    }
}
exports.Playlist = Playlist;
_Playlist_continuatedList = new WeakMap(), _Playlist_likeParam = new WeakMap();
