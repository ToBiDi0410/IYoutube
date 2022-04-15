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
exports.Comment = void 0;
const main_1 = require("../main");
const helpers_1 = require("../fetchers/helpers");
const HTTPClient_1 = require("./HTTPClient");
const constants_1 = require("../constants");
class Comment {
    constructor(httpclient) {
        this.httpclient = httpclient;
    }
    fromCommentRenderer(obj) {
        this.commentId = helpers_1.default.recursiveSearchForKey("commentId", obj)[0];
        const contentContainer = helpers_1.default.recursiveSearchForKey("contentText", obj)[0];
        if (contentContainer)
            this.text = helpers_1.default.recursiveSearchForKey("text", contentContainer).join("");
        this.author = new main_1.Channel(this.httpclient);
        this.author.fromCommentRenderer(obj);
        this.authorIsChannelOwner = helpers_1.default.recursiveSearchForKey("authorIsChannelOwner", obj)[0];
        const likeCountContainer = helpers_1.default.recursiveSearchForKey("voteCount", obj)[0];
        if (likeCountContainer)
            this.likeCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("simpleText", likeCountContainer).join(""));
        this.hasLiked = helpers_1.default.recursiveSearchForKey("isLiked", obj)[0];
        const publishedTimeTextContainer = helpers_1.default.recursiveSearchForKey("publishedTimeText", obj)[0];
        if (publishedTimeTextContainer) {
            this.publishedText = helpers_1.default.recursiveSearchForKey("text", publishedTimeTextContainer).join("");
        }
        const actionButtonContainer = helpers_1.default.recursiveSearchForKey("commentActionButtonsRenderer", obj)[0];
        if (actionButtonContainer) {
            const dislikeButton = helpers_1.default.recursiveSearchForKey("dislikeButton", actionButtonContainer);
            if (dislikeButton)
                this.dislikeActionToken = helpers_1.default.recursiveSearchForKey("action", dislikeButton)[0];
            this.removeDislikeActionToken = helpers_1.default.recursiveSearchForKey("action", dislikeButton)[1];
            const likeButton = helpers_1.default.recursiveSearchForKey("likeButton", actionButtonContainer);
            if (likeButton) {
                this.likeActionToken = helpers_1.default.recursiveSearchForKey("action", likeButton)[0];
                this.removeLikeActionToken = helpers_1.default.recursiveSearchForKey("action", likeButton)[1];
            }
            this.canPerformLikeActions = !(!this.dislikeActionToken && !this.likeActionToken);
        }
    }
    like() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canPerformLikeActions)
                throw new Error("It is not possible to perfrom Like Actions on this Comment Instance");
            const commentAction = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_COMMENT_ACTION,
                data: {
                    actions: [this.likeActionToken]
                }
            });
            this.hasLiked = commentAction.status == 200;
            return commentAction.status == 200;
        });
    }
    dislike() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canPerformLikeActions)
                throw new Error("It is not possible to perfrom Like Actions on this Comment Instance");
            const commentAction = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_COMMENT_ACTION,
                data: {
                    actions: [this.dislikeActionToken]
                }
            });
            this.hasLiked = commentAction.status == 200 ? false : undefined;
            return commentAction.status == 200;
        });
    }
    removeLike() {
        return __awaiter(this, void 0, void 0, function* () {
            let removeToken = this.removeLikeActionToken;
            if (this.hasLiked === true) {
                removeToken = this.removeLikeActionToken;
            }
            else if (this.hasLiked === false) {
                removeToken = this.removeDislikeActionToken;
            }
            else {
                console.warn("[IYOUTUBE | COMMENT] Removal of Like without knowing if it's present!");
            }
            const commentAction = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_COMMENT_ACTION,
                data: {
                    actions: [removeToken]
                }
            });
            this.hasLiked = undefined;
            return commentAction.status == 200;
        });
    }
}
exports.Comment = Comment;
