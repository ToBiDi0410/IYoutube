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
const Channel_1 = require("./Channel");
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
            this.owner = new Channel_1.Channel(this.httpclient);
            this.owner.fromVideoRenderer(obj);
        }
    }
    fromGridRenderer(obj) {
        this.fromVideoRenderer(obj);
        const shortBylineText = helpers_1.default.recursiveSearchForKey("shortBylineText", obj)[0];
        if (shortBylineText) {
            this.owner = new Channel_1.Channel(this.httpclient);
            this.owner.fromGridVideoRenderer(obj);
        }
    }
    fromPlaylistVideoRenderer(obj) {
        this.fromVideoRenderer(obj);
        const shortBylineText = helpers_1.default.recursiveSearchForKey("shortBylineText", obj)[0];
        if (shortBylineText) {
            this.owner = new Channel_1.Channel(this.httpclient);
            this.owner.fromPlaylistVideoRendererBylineText(shortBylineText);
        }
        this.playable = helpers_1.default.recursiveSearchForKey("isPlayable", obj)[0];
    }
    like() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_LIKE,
                data: {
                    target: {
                        videoId: this.videoId
                    }
                }
            });
            const resJSON = yield JSON.parse(res.data);
            return res.status == 200;
        });
    }
    dislike() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_DISLIKE,
                data: {
                    target: {
                        videoId: this.videoId
                    }
                }
            });
            const resJSON = yield JSON.parse(res.data);
            return res.status == 200;
        });
    }
    removeLike() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_REMOVELIKE,
                data: {
                    target: {
                        videoId: this.videoId
                    }
                }
            });
            const resJSON = yield JSON.parse(res.data);
            return res.status == 200;
        });
    }
}
exports.Video = Video;
