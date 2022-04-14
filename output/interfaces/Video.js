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
exports.Video = void 0;
const constants_1 = require("../constants");
const helpers_1 = require("../fetchers/helpers");
const main_1 = require("../main");
const HTTPClient_1 = require("./HTTPClient");
class Video {
    constructor(httpclient) {
        this.error = false;
        this.httpclient = httpclient;
    }
    fromVideoRenderer(obj) {
        this.videoId = helpers_1.default.recursiveSearchForKey("videoId", obj)[0];
        const videoTitleContainer = helpers_1.default.recursiveSearchForKey("title", obj)[0];
        if (videoTitleContainer)
            this.title = helpers_1.default.recursiveSearchForKey("text", videoTitleContainer)[0];
        if (!this.videoId || !this.title) {
            console.warn("[VIDEO] Failed to parse Video Object:\n", obj);
            this.error = true;
            return;
        }
        const shortDescriptionContainer = helpers_1.default.recursiveSearchForKey("detailedMetadataSnippets", obj)[0];
        if (shortDescriptionContainer)
            this.shortDescription = helpers_1.default.recursiveSearchForKey("text", shortDescriptionContainer)[0];
        const viewCountTextContainer = helpers_1.default.recursiveSearchForKey("viewCountText", obj)[0];
        if (viewCountTextContainer && helpers_1.default.recursiveSearchForKey("simpleText", viewCountTextContainer).length > 0) {
            this.viewCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("simpleText", viewCountTextContainer)[0]);
        }
        const thumbnailContainer = helpers_1.default.recursiveSearchForKey("thumbnail", obj)[0];
        if (thumbnailContainer)
            this.thumbnails = helpers_1.default.recursiveSearchForKey("thumbnails", obj)[0];
        const richThumbnailContainer = helpers_1.default.recursiveSearchForKey("richThumbnail", obj)[0];
        if (richThumbnailContainer)
            this.richThumbnails = helpers_1.default.recursiveSearchForKey("thumbnails", richThumbnailContainer)[0];
        const timeTextContainer = helpers_1.default.recursiveSearchForKey("publishedTimeText", obj)[0];
        if (timeTextContainer)
            this.publishedText = helpers_1.default.recursiveSearchForKey("simpleText", timeTextContainer)[0];
        if (helpers_1.default.recursiveSearchForKey("ownerText", obj).length > 0) {
            this.owner = new main_1.Channel(this.httpclient);
            this.owner.fromVideoRenderer(obj);
        }
    }
    fromGridRenderer(obj) {
        this.fromVideoRenderer(obj);
        const shortBylineText = helpers_1.default.recursiveSearchForKey("shortBylineText", obj)[0];
        if (shortBylineText) {
            this.owner = new main_1.Channel(this.httpclient);
            this.owner.fromGridVideoRenderer(obj);
        }
    }
    fromPlaylistVideoRenderer(obj) {
        this.fromVideoRenderer(obj);
        const shortBylineText = helpers_1.default.recursiveSearchForKey("shortBylineText", obj)[0];
        if (shortBylineText) {
            this.owner = new main_1.Channel(this.httpclient);
            this.owner.fromPlaylistVideoRendererBylineText(shortBylineText);
        }
        this.playable = helpers_1.default.recursiveSearchForKey("isPlayable", obj)[0];
    }
    loadAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const playerResponse = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_PLAYER,
                data: {
                    videoId: this.videoId,
                    racyCheckOk: false,
                    contentCheckOk: false,
                    playbackContext: {
                        contentPlaybackContent: {
                            currentUrl: "/watch?v=6Dh-RL__uN4",
                            autonavState: "STATE_OFF",
                            autoCaptionsDefaultOn: false,
                            html5Preference: "HTML5_PREF_WANTS",
                            lactMilliseconds: "-1",
                            referer: "https://www.youtube.com/",
                            signatureTimestamp: 19095,
                            splay: false,
                            vis: 0
                        }
                    }
                }
            });
            const playerJSON = yield JSON.parse(playerResponse.data);
            const videoDetails = helpers_1.default.recursiveSearchForKey("videoDetails", playerJSON)[0];
            if (videoDetails) {
                this.title = videoDetails.title;
                this.description = videoDetails.shortDescription;
                this.thumbnails = helpers_1.default.recursiveSearchForKey("thumbnails", videoDetails)[0];
                this.viewCount = helpers_1.default.getNumberFromText(videoDetails.viewCount);
                this.private = videoDetails.isPrivate;
                this.live = videoDetails.isLiveContent;
                this.keywords = videoDetails.keywords;
                this.currentUserIsOwner = videoDetails.isOwnerViewing;
                this.canLike = videoDetails.allowRatings;
            }
            const playerMicroRenderer = helpers_1.default.recursiveSearchForKey("playerMicroformatRenderer", playerJSON)[0];
            if (playerMicroRenderer) {
                this.publishedText = playerMicroRenderer.publishDate;
                this.listed = !playerMicroRenderer.isUnlisted;
                this.familySafe = playerMicroRenderer.isFamilySafe;
                this.owner = new main_1.Channel(this.httpclient);
                this.owner.fromPlayerMicroRenderer(playerMicroRenderer);
            }
            const captions = helpers_1.default.recursiveSearchForKey("captionTracks", playerJSON)[0];
            if (captions) {
                this.captionTracks = captions.map((a) => {
                    a.name = helpers_1.default.recursiveSearchForKey("simpleText", a.name).join("");
                    return a;
                });
            }
            const nextResponse = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_NEXT,
                data: {
                    autonavState: "STATE_ON",
                    captionsRequested: true,
                    contentCheckOK: false,
                    params: "OALAAQHCAwtPUEhMX09MVzNkUQ%3D%3D",
                    racyCheckOk: false,
                    videoId: this.videoId,
                }
            });
            const nextJSON = yield JSON.parse(nextResponse.data);
            const itemSectionRenderers = helpers_1.default.recursiveSearchForKey("itemSectionRenderer", nextJSON);
            const commentSectionRenderer = itemSectionRenderers.find((a) => a.targetId == 'comments-section');
            if (commentSectionRenderer)
                this.commentThreadList = new main_1.CommentSectionContinuatedList(helpers_1.default.recursiveSearchForKey("token", commentSectionRenderer)[0], this.httpclient);
            const primaryInfoRenderer = helpers_1.default.recursiveSearchForKey("videoPrimaryInfoRenderer", nextJSON)[0];
            if (primaryInfoRenderer) {
                const titleContainer = primaryInfoRenderer.title;
                if (titleContainer)
                    this.title = helpers_1.default.recursiveSearchForKey("text", titleContainer).join();
                const viewCountContainer = helpers_1.default.recursiveSearchForKey("viewCount", nextJSON)[0];
                if (viewCountContainer)
                    this.viewCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("simpleText", viewCountContainer).join(""));
                const dateContainer = helpers_1.default.recursiveSearchForKey("dateText", nextJSON)[0];
                if (dateContainer)
                    this.publishedDate = new Date(helpers_1.default.recursiveSearchForKey("simpleText", dateContainer).join(""));
                const buttons = helpers_1.default.recursiveSearchForKey("topLevelButtons", nextJSON)[0];
                if (buttons) {
                    const likeButton = buttons[0].toggleButtonRenderer;
                    const dislikeButton = buttons[1].toggleButtonRenderer;
                    if (likeButton && dislikeButton)
                        this.hasLiked = likeButton.isToggled && !dislikeButton.isToggled;
                }
            }
            const secondaryInfoRenderer = helpers_1.default.recursiveSearchForKey("videoSecondaryInfoRenderer", nextJSON)[0];
            if (secondaryInfoRenderer) {
                const descriptionContainer = secondaryInfoRenderer.description;
                if (descriptionContainer)
                    this.description = helpers_1.default.recursiveSearchForKey("text", descriptionContainer).join("");
                const ownerContainer = secondaryInfoRenderer.owner;
                if (ownerContainer) {
                    this.owner = new main_1.Channel(this.httpclient);
                    this.owner.fromVideoOwnerRenderer(helpers_1.default.recursiveSearchForKey("videoOwnerRenderer", ownerContainer));
                    this.owner.subscribed = helpers_1.default.recursiveSearchForKey("subscribed", nextJSON)[0];
                }
            }
            console.log(this);
        });
    }
    getCommentThreadList() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.commentThreadList) {
                yield this.loadAll();
                if (!this.commentThreadList)
                    throw new Error("This Video seems to have no comment section");
            }
            return this.commentThreadList;
        });
    }
    like() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.canLike === false)
                throw new Error("This Video has disabled Like-Actions");
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_LIKE,
                data: {
                    target: {
                        videoId: this.videoId
                    }
                }
            });
            this.hasLiked = res.status == 200 ? true : this.hasLiked;
            return res.status == 200;
        });
    }
    dislike() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.canLike === false)
                throw new Error("This Video has disabled Like-Actions");
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_DISLIKE,
                data: {
                    target: {
                        videoId: this.videoId
                    }
                }
            });
            this.hasLiked = res.status == 200 ? false : this.hasLiked;
            return res.status == 200;
        });
    }
    removeLike() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.canLike === false)
                throw new Error("This Video has disabled Like-Actions");
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_REMOVELIKE,
                data: {
                    target: {
                        videoId: this.videoId
                    }
                }
            });
            this.hasLiked = res.status == 200 ? undefined : this.hasLiked;
            return res.status == 200;
        });
    }
}
exports.Video = Video;
