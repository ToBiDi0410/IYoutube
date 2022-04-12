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
var _Comment_likeActionToken, _Comment_dislikeActionToken, _Comment_removeLikeActionToken, _Comment_removeDislikeActionToken;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const main_1 = require("../main");
const helpers_1 = require("../fetchers/helpers");
const HTTPClient_1 = require("./HTTPClient");
const constants_1 = require("../constants");
class Comment {
    constructor(httpclient) {
        _Comment_likeActionToken.set(this, void 0);
        _Comment_dislikeActionToken.set(this, void 0);
        _Comment_removeLikeActionToken.set(this, void 0);
        _Comment_removeDislikeActionToken.set(this, void 0);
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
                __classPrivateFieldSet(this, _Comment_dislikeActionToken, helpers_1.default.recursiveSearchForKey("action", dislikeButton)[0], "f");
            __classPrivateFieldSet(this, _Comment_removeDislikeActionToken, helpers_1.default.recursiveSearchForKey("action", dislikeButton)[1], "f");
            const likeButton = helpers_1.default.recursiveSearchForKey("likeButton", actionButtonContainer);
            if (likeButton) {
                __classPrivateFieldSet(this, _Comment_likeActionToken, helpers_1.default.recursiveSearchForKey("action", likeButton)[0], "f");
                __classPrivateFieldSet(this, _Comment_removeLikeActionToken, helpers_1.default.recursiveSearchForKey("action", likeButton)[1], "f");
            }
            this.canPerformLikeActions = !(!__classPrivateFieldGet(this, _Comment_dislikeActionToken, "f") && !__classPrivateFieldGet(this, _Comment_likeActionToken, "f"));
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
                    actions: [__classPrivateFieldGet(this, _Comment_likeActionToken, "f")]
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
                    actions: [__classPrivateFieldGet(this, _Comment_dislikeActionToken, "f")]
                }
            });
            this.hasLiked = commentAction.status == 200 ? false : undefined;
            return commentAction.status == 200;
        });
    }
    removeLike() {
        return __awaiter(this, void 0, void 0, function* () {
            let removeToken = __classPrivateFieldGet(this, _Comment_removeLikeActionToken, "f");
            if (this.hasLiked === true) {
                removeToken = __classPrivateFieldGet(this, _Comment_removeLikeActionToken, "f");
            }
            else if (this.hasLiked === false) {
                removeToken = __classPrivateFieldGet(this, _Comment_removeDislikeActionToken, "f");
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
_Comment_likeActionToken = new WeakMap(), _Comment_dislikeActionToken = new WeakMap(), _Comment_removeLikeActionToken = new WeakMap(), _Comment_removeDislikeActionToken = new WeakMap();
