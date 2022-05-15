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
exports.Playlist = void 0;
const helpers_1 = require("../fetchers/helpers");
const PlaylistContinuatedList_1 = require("../fetchers/PlaylistContinuatedList");
const HTTPClient_1 = require("./HTTPClient");
const main_1 = require("../main");
const constants_1 = require("../constants");
class Playlist {
    constructor(httpclient) {
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
            this.owner = new main_1.Channel(this.httpclient);
            this.owner.fromPlaylistRenderer(obj);
        }
    }
    fromGridPlaylistRenderer(obj) {
        this.fromPlaylistRenderer(obj);
        const viewCountContainer = helpers_1.default.recursiveSearchForKey("thumbnailText", obj)[0];
        if (viewCountContainer) {
            this.videoCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("text", viewCountContainer).join(""));
        }
        const badgesContainer = helpers_1.default.recursiveSearchForKey("badges", obj);
        if (badgesContainer) {
            const badgeRenderers = helpers_1.default.recursiveSearchForKey("metadataBadgeRenderer", badgesContainer);
            if (badgeRenderers.length > 0) {
                this.badges = badgeRenderers.map((badgeRenderer) => ({
                    name: helpers_1.default.recursiveSearchForKey("label", badgeRenderer)[0],
                    icon: helpers_1.default.recursiveSearchForKey("iconType", badgeRenderer)[0],
                    style: helpers_1.default.recursiveSearchForKey("style", badgeRenderer)[0]
                }));
            }
        }
        if (this.badges) {
            if (this.badges.find((a) => { return a.icon == "PRIVACY_PRIVATE"; }))
                this.privacyState = "PRIVATE";
            else if (this.badges.find((a) => { return a.icon == "PRIVACY_UNLISTED"; }))
                this.privacyState = "UNLISTED";
            else
                this.privacyState = "PUBLIC";
        }
        else
            this.privacyState = "PUBLIC";
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
                const thumbnailsContainer = helpers_1.default.recursiveSearchForKey("thumbnails", primaryInfoRendererContainer)[0];
                if (thumbnailsContainer)
                    this.thumbnails = thumbnailsContainer;
                const likeButtonContainer = helpers_1.default.recursiveSearchForKey("toggleButtonRenderer", primaryInfoRendererContainer)[0];
                if (likeButtonContainer) {
                    this.canLike = true;
                    this.likeParam = helpers_1.default.recursiveSearchForKey("removeLikeParams", likeButtonContainer).join("");
                }
                else
                    this.canLike = false;
            }
            else
                throw new Error("PrimaryInfoRenderer was missing");
            const videoOwnerContainer = helpers_1.default.recursiveSearchForKey("videoOwner", resJSON)[0];
            if (videoOwnerContainer) {
                this.owner = new main_1.Channel(this.httpclient);
                this.owner.fromVideoOwnerRenderer(videoOwnerContainer);
            }
        });
    }
    getContinuatedList() {
        if (this.continuatedList)
            return this.continuatedList;
        if (this.playlistId) {
            this.continuatedList = new PlaylistContinuatedList_1.PlaylistContinuatedList(this.playlistId, this.httpclient);
            return this.getContinuatedList();
        }
        throw new Error("Cannot construct Continuated List for Playlist without the playlistID");
    }
    like() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.likeParam || !this.canLike)
                throw new Error("Cannot add or remove Playlist because not all Data is loaded or it is not possible");
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_LIKE,
                params: { prettyPrint: false },
                data: {
                    params: this.likeParam,
                    target: {
                        playlistId: this.playlistId
                    }
                },
                noCache: true
            });
            return res.status == 200;
        });
    }
    removeLike() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.likeParam || !this.canLike)
                throw new Error("Cannot add or remove Playlist because not all Data is loaded or its forbidden");
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_REMOVELIKE,
                params: { prettyPrint: false },
                data: {
                    params: this.likeParam,
                    target: {
                        playlistId: this.playlistId
                    }
                },
                noCache: true
            });
            return res.status == 200;
        });
    }
}
exports.Playlist = Playlist;
