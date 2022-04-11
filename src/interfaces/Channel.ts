import { ENDPOINT_SUBSCRIBE, ENDPOINT_UNSUBSCRIBE } from "../constants";
import helpers from "../fetchers/helpers"
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { ChannelBadge } from "./ChannelBadge";
import { HTTPRequestMethod } from "./HTTPClient";
import { Thumbnail } from "./Thumbnail";

export class Channel {
    channelId?: string;
    title?: string;
    shortDescription?: string;
    badges?: Array<ChannelBadge>;
    thumbnails?: Array<Thumbnail>;
    videoCount?: number;
    subscribed?: boolean;
    subscriberCount?: number;

    httpclient: WrappedHTTPClient;

    constructor(httpclient: WrappedHTTPClient) {
        this.httpclient = httpclient;
    }

    fromVideoRenderer(obj: any) {
        const ownerTextContainer = helpers.recursiveSearchForKey("ownerText", obj)[0];
        if(ownerTextContainer) {
            this.title = helpers.recursiveSearchForKey("text", ownerTextContainer)[0];
            this.channelId = helpers.recursiveSearchForKey("browseId", ownerTextContainer)[0];
        }

        const ownerBadgeContainer = helpers.recursiveSearchForKey("ownerBadges", obj);
        if(ownerBadgeContainer.length > 0) {
            const badgeRenderers = helpers.recursiveSearchForKey("metadataBadgeRenderer", ownerBadgeContainer);
            if(badgeRenderers.length > 0) {
                this.badges = new Array();
                for(const badgeRenderer of badgeRenderers) {
                    this.badges.push({
                        name: helpers.recursiveSearchForKey("label", badgeRenderer)[0],
                        icon: helpers.recursiveSearchForKey("iconType", badgeRenderer)[0],
                    });
                }
            }
        }

        const ownerThumbnailContainer = helpers.recursiveSearchForKey("channelThumbnailWithLinkRenderer", obj)[0];
        if(ownerBadgeContainer) {
            this.thumbnails = helpers.recursiveSearchForKey("thumbnails", ownerThumbnailContainer)[0];
        }

        this.#cleanup;
    }

    fromChannelRenderer(obj: any) {
        this.channelId = helpers.recursiveSearchForKey("channelId", obj)[0];

        const titleContainer = helpers.recursiveSearchForKey("title", obj)[0];
        if(titleContainer)
            this.title = helpers.recursiveSearchForKey("simpleText", titleContainer)[0];

        const thumbnailContainer = helpers.recursiveSearchForKey("thumbnail", obj)[0];
        if(thumbnailContainer) {
            this.thumbnails = helpers.recursiveSearchForKey("thumbnails", thumbnailContainer)[0];
        }

        const descriptionContainer = helpers.recursiveSearchForKey("descriptionSnippet", obj)[0];
        if(descriptionContainer)
            this.shortDescription = helpers.recursiveSearchForKey("text", descriptionContainer).join("");

        const videoCountContainer = helpers.recursiveSearchForKey("videoCountText", obj)[0];
        if(videoCountContainer)
            this.videoCount = helpers.getNumberFromText(helpers.recursiveSearchForKey("text", videoCountContainer).join(""));

        const subscriberCountContainer = helpers.recursiveSearchForKey("subscriberCountText", obj)[0];
        if(subscriberCountContainer) 
            this.subscriberCount = helpers.getNumberFromText(helpers.recursiveSearchForKey("simpleText", subscriberCountContainer)[0]);

        const ownerBadgeContainer = helpers.recursiveSearchForKey("ownerBadges", obj);
        if(ownerBadgeContainer.length > 0) {
            const badgeRenderers = helpers.recursiveSearchForKey("metadataBadgeRenderer", ownerBadgeContainer);
            if(badgeRenderers.length > 0) {
                this.badges = new Array();
                for(const badgeRenderer of badgeRenderers) {
                    this.badges.push({
                        name: helpers.recursiveSearchForKey("label", badgeRenderer)[0],
                        icon: helpers.recursiveSearchForKey("iconType", badgeRenderer)[0],
                    });
                }
            }
        }

        this.subscribed = helpers.recursiveSearchForKey("subscribed", obj)[0];

        this.#cleanup();
    }

    fromGridVideoRenderer(obj: any) {
        const shortBylineText = helpers.recursiveSearchForKey("shortBylineText", obj)[0];
        if(shortBylineText) {
            this.title = helpers.recursiveSearchForKey("text", shortBylineText)[0];
            this.channelId = helpers.recursiveSearchForKey("browseId", shortBylineText)[0];
        }

        const ownerBadgeContainer = helpers.recursiveSearchForKey("ownerBadges", obj);
        if(ownerBadgeContainer.length > 0) {
            const badgeRenderers = helpers.recursiveSearchForKey("metadataBadgeRenderer", ownerBadgeContainer);
            if(badgeRenderers.length > 0) {
                this.badges = new Array();
                for(const badgeRenderer of badgeRenderers) {
                    this.badges.push({
                        name: helpers.recursiveSearchForKey("label", badgeRenderer)[0],
                        icon: helpers.recursiveSearchForKey("iconType", badgeRenderer)[0],
                    });
                }
            }
        }
    }

    fromPlaylistRenderer(obj: any) {
        this.fromGridVideoRenderer(obj);
    }

    fromVideoOwnerRenderer(obj:any) {
        const browseEndpoint = helpers.recursiveSearchForKey("browseEndpoint", obj)[0];
        if(browseEndpoint)
            this.channelId = helpers.recursiveSearchForKey("browseId", browseEndpoint).join("");

        const titleContainer = helpers.recursiveSearchForKey("title", obj);
        if(titleContainer)
            this.title = helpers.recursiveSearchForKey("text", titleContainer).join("");

        const thumbnailContainer = helpers.recursiveSearchForKey("thumbnails", obj)[0];
        if(thumbnailContainer)
            this.thumbnails = thumbnailContainer;
    }

    fromPlaylistVideoRendererBylineText(obj:any) {
        this.title = helpers.recursiveSearchForKey("text", obj).join("");
        this.channelId = helpers.recursiveSearchForKey("browseId", obj).join("");
    }

    async subscribe() {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_SUBSCRIBE,
            params: {
                prettyPrint: false
            },
            data: { 
                channelIds: [this.channelId],
                params: "EgIIAhgA"
            }
        });
        const resJSON = await JSON.parse(res.data);
        return res.status == 200;
    }

    async unsubscribe() {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_UNSUBSCRIBE,
            params: {
                prettyPrint: false
            },
            data: { 
                channelIds: [this.channelId],
                params: "CgIIAhgA"
            }
        });
        const resJSON = await JSON.parse(res.data);
        return res.status == 200;
    }

    #cleanup() {
        if(this.thumbnails) this.thumbnails.forEach((a) => {
            if(a.url.startsWith("//")) a.url = "https:" + a.url;
        })
    }
}