import { Channel, WrappedHTTPClient } from "../main";
import helpers from "../fetchers/helpers";
import { HTTPRequestMethod } from "./HTTPClient";
import { ENDPOINT_COMMENT_ACTION } from "../constants";

export class Comment {
    httpclient: WrappedHTTPClient;

    commentId?: string;
    text?: string;
    author?: Channel;
    authorIsChannelOwner?: boolean;
    likeCount?: number;
    hasLiked?: boolean;
    publishedText?: string;

    likeActionToken?:string;
    dislikeActionToken?:string;
    removeLikeActionToken?:string;
    removeDislikeActionToken?:string;
    canPerformLikeActions?:boolean;

    constructor(httpclient: WrappedHTTPClient) {
        this.httpclient = httpclient;
    }

    fromCommentRenderer(obj: any) {
        this.commentId = helpers.recursiveSearchForKey("commentId", obj)[0];

        const contentContainer = helpers.recursiveSearchForKey("contentText", obj)[0];
        if(contentContainer)
            this.text = helpers.recursiveSearchForKey("text", contentContainer).join("");

        this.author = new Channel(this.httpclient);
        this.author.fromCommentRenderer(obj);
        this.authorIsChannelOwner = helpers.recursiveSearchForKey("authorIsChannelOwner", obj)[0];

        const likeCountContainer = helpers.recursiveSearchForKey("voteCount", obj)[0];
        if(likeCountContainer)
            this.likeCount = helpers.getNumberFromText(helpers.recursiveSearchForKey("simpleText", likeCountContainer).join(""));

        this.hasLiked = helpers.recursiveSearchForKey("isLiked", obj)[0];

        const publishedTimeTextContainer = helpers.recursiveSearchForKey("publishedTimeText", obj)[0];
        if(publishedTimeTextContainer) {
            this.publishedText = helpers.recursiveSearchForKey("text", publishedTimeTextContainer).join("");
        }

        const actionButtonContainer = helpers.recursiveSearchForKey("commentActionButtonsRenderer", obj)[0];
        if(actionButtonContainer) {
            const dislikeButton = helpers.recursiveSearchForKey("dislikeButton", actionButtonContainer);
            if(dislikeButton)
                this.dislikeActionToken = helpers.recursiveSearchForKey("action", dislikeButton)[0];
                this.removeDislikeActionToken = helpers.recursiveSearchForKey("action", dislikeButton)[1];

            const likeButton = helpers.recursiveSearchForKey("likeButton", actionButtonContainer);
            if(likeButton) {
                this.likeActionToken = helpers.recursiveSearchForKey("action", likeButton)[0];
                this.removeLikeActionToken = helpers.recursiveSearchForKey("action", likeButton)[1];
            }

            this.canPerformLikeActions = !(!this.dislikeActionToken && !this.likeActionToken);
        }
    }

    async like() {
        if(!this.canPerformLikeActions) throw new Error("It is not possible to perfrom Like Actions on this Comment Instance");
        const commentAction = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_COMMENT_ACTION,
            data: {
                actions: [this.likeActionToken]
            }
        });
        this.hasLiked = commentAction.status == 200;
        return commentAction.status == 200;
    }

    async dislike() {
        if(!this.canPerformLikeActions) throw new Error("It is not possible to perfrom Like Actions on this Comment Instance");
        const commentAction = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_COMMENT_ACTION,
            data: {
                actions: [this.dislikeActionToken]
            }
        });
        this.hasLiked = commentAction.status == 200 ? false : undefined;
        return commentAction.status == 200;
    }

    async removeLike() {
        let removeToken = this.removeLikeActionToken;
        if(this.hasLiked === true) {
            removeToken = this.removeLikeActionToken;
        } else if(this.hasLiked === false) {
            removeToken = this.removeDislikeActionToken;
        } else {
            console.warn("[IYOUTUBE | COMMENT] Removal of Like without knowing if it's present!");
        }

        const commentAction = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_COMMENT_ACTION,
            data: {
                actions: [removeToken]
            }
        });
        this.hasLiked = undefined;
        return commentAction.status == 200;
    }
}