import { ENDPOINT_BROWSE, ENDPOINT_SUBSCRIBE, ENDPOINT_UNSUBSCRIBE } from "../constants";
import { ContinuatedList, Thumbnail, Badge, WrappedHTTPClient  } from "../main";
import helpers from "../fetchers/helpers"
import { HTTPRequestMethod } from "./HTTPClient";
import { ChannelLink } from "./ChannelLink";


export class Channel {
    channelId?: string;
    title?: string;
    description?: string;
    shortDescription?: string;
    badges?: Array<Badge>;
    thumbnails?: Array<Thumbnail>;
    banners?: Array<Thumbnail>;
    mobileBanners?: Array<Thumbnail>;
    tvBanners?: Array<Thumbnail>;
    videoCount?: number;
    subscribed?: boolean;
    subscriberCount?: number;
    country?: string;
    viewCount?: number;
    joinDate?: Date;
    channelLinks?: Array<ChannelLink>;
    otherChannels?: Array<Channel>;

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
        this.#parseOwnerBadges(ownerBadgeContainer);

        const ownerThumbnailContainer = helpers.recursiveSearchForKey("channelThumbnailWithLinkRenderer", obj)[0];
        if(ownerThumbnailContainer) {
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
        this.#parseOwnerBadges(ownerBadgeContainer);

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

    fromGridChannelRenderer(obj: any) {
        this.channelId = helpers.recursiveSearchForKey("channelId", obj).join("");
        this.subscribed = helpers.recursiveSearchForKey("subscribed", obj)[0];
        
        const titleContainer = helpers.recursiveSearchForKey("title", obj)[0];
        if(titleContainer) {
            this.title = helpers.recursiveSearchForKey("simpleText", titleContainer).join("");
        }

        const thumbnailContainer = helpers.recursiveSearchForKey("thumbnails", obj)[0];
        if(thumbnailContainer) {
           this.thumbnails = thumbnailContainer; 
        }

    }

    fromCommentRenderer(obj: any) {
        const navigationEndpoint = helpers.recursiveSearchForKey("authorEndpoint", obj)[0];
        if(navigationEndpoint) 
            this.channelId = helpers.recursiveSearchForKey("browseId", navigationEndpoint)[0];

        const titleContainer = helpers.recursiveSearchForKey("authorText", obj)[0];
        if(titleContainer)
            this.title = helpers.recursiveSearchForKey("simpleText", titleContainer).join("");

        const authorThumbnailContainer = helpers.recursiveSearchForKey("authorThumbnail", obj)[0];
        if(authorThumbnailContainer)
            this.thumbnails = helpers.recursiveSearchForKey("thumbnails", authorThumbnailContainer)[0];
    }

    fromPlayerMicroRenderer(obj: any) {
        this.channelId = obj.externalChannelId;
        this.title = obj.ownerChannelName;
    }

    async loadAll() {
        await this.loadDetailsFromAboutPage();
        await this.loadDetailsFromChannelsPages();
    }

    async loadDetailsFromAboutPage() {
        const channelAbout = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_BROWSE,
            data: {
                browseId: this.channelId,
                params: channelBrowseType.DETAILS
            }
        });
        const aboutJSON = await JSON.parse(channelAbout.data);
        this.#parseC4FromHeader(aboutJSON);        

        const aboutRenderer = helpers.recursiveSearchForKey("channelAboutFullMetadataRenderer", aboutJSON);
        const descriptionContainer = helpers.recursiveSearchForKey("description", aboutRenderer)[0];
        if(descriptionContainer)
            this.description = helpers.recursiveSearchForKey("simpleText", descriptionContainer).join("");

        const countryContainer = helpers.recursiveSearchForKey("country", aboutRenderer)[0];
        if(countryContainer)
            this.country = helpers.recursiveSearchForKey("simpleText", countryContainer).join("");

        const joinDateContainer = helpers.recursiveSearchForKey("joinedDateText", aboutRenderer)[0];
        if(joinDateContainer) {
            const dateParts = helpers.recursiveSearchForKey("text", joinDateContainer).join("").split(" ");
            dateParts.shift(); //Remove the 'Joined' Prefix
            this.joinDate = new Date(dateParts.join(", "));
        }
            
        const viewCountContainer = helpers.recursiveSearchForKey("viewCountText", aboutRenderer)[0];
        if(viewCountContainer)
            this.viewCount = helpers.getNumberFromText(helpers.recursiveSearchForKey("simpleText", viewCountContainer).join(""));

        const links = helpers.recursiveSearchForKey("primaryLinks", aboutRenderer)[0];
        if(links) {
            this.channelLinks = links.map((link:any) => {
                var linkObj:ChannelLink = { 
                    title: helpers.recursiveSearchForKey("simpleText", link).join(""),
                    url: helpers.recursiveSearchForKey("url", helpers.recursiveSearchForKey("navigationEndpoint", link)[0])[0],
                    thumbnails: helpers.recursiveSearchForKey("thumbnails", link)[0]
                }

                //Resolve YouTube Redirect Links
                if(linkObj.url && linkObj.url.startsWith("https://www.youtube.com/redirect?")) {
                    linkObj.url = new URL(linkObj.url).searchParams.get("q") as string;
                } 

                return linkObj;
            });
        }
    }

    async loadDetailsFromChannelsPages() {
        const channelChannels = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_BROWSE,
            data: {
                browseId: this.channelId,
                params: channelBrowseType.CHANNELS
            }
        });
        const channelsJSON = await JSON.parse(channelChannels.data);
        this.#parseC4FromHeader(channelsJSON);   

        let channelsTabRenderer = helpers.recursiveSearchForKey("tabRenderer", channelsJSON);
        channelsTabRenderer = channelsTabRenderer.find((a:any) => a.title.toLowerCase() == "channels");
        
        let channelItems = helpers.recursiveSearchForKey("items", channelsTabRenderer);
        if(channelItems.length > 0) {
            channelItems = channelItems.flat(1); //Join all Arrays of Items together (for multiple headings)
            this.otherChannels = helpers.processRendererItems(channelItems, this.httpclient) as Array<Channel>;
        }
    }

    #parseC4FromHeader(obj:any) {
        const headerContainer = helpers.recursiveSearchForKey("c4TabbedHeaderRenderer", obj)[0];
        if(headerContainer) {
            this.title = headerContainer.title;
            this.subscribed = helpers.recursiveSearchForKey("subscribed", headerContainer)[0];
            this.#parseOwnerBadges(helpers.recursiveSearchForKey("badges", headerContainer));

            const subscriberCountContainer = helpers.recursiveSearchForKey("subscriberCountText", headerContainer)[0];
            if(subscriberCountContainer)
                this.subscriberCount = helpers.getNumberFromText(helpers.recursiveSearchForKey("simpleText", subscriberCountContainer).join(""));

            this.thumbnails = helpers.recursiveSearchForKey("thumbnails", headerContainer.avatar)[0];
            this.banners = helpers.recursiveSearchForKey("thumbnails", headerContainer.banner)[0];
            this.mobileBanners = helpers.recursiveSearchForKey("thumbnails", headerContainer.mobileBanner)[0];
            this.tvBanners = helpers.recursiveSearchForKey("thumbnails", headerContainer.tvBanner)[0];

        }
    }

    #parseOwnerBadges(ownerBadgeContainer:Array<any>) {
        if(ownerBadgeContainer.length > 0) {
            const badgeRenderers = helpers.recursiveSearchForKey("metadataBadgeRenderer", ownerBadgeContainer);
            if(badgeRenderers.length > 0) {
                this.badges = badgeRenderers.map((badgeRenderer:any) => ({
                        name: helpers.recursiveSearchForKey("label", badgeRenderer)[0],
                        icon: helpers.recursiveSearchForKey("iconType", badgeRenderer)[0],
                }));
            }
        }
    }

    #cleanup() {
        if(this.thumbnails) this.thumbnails.forEach((a) => {
            if(a.url.startsWith("//")) a.url = "https:" + a.url;
        })
    }

    getUploadList():ContinuatedList {
        return new ContinuatedList(
        //Http Request Options
        {
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_BROWSE,
            data: {
                browseId: this.channelId,
                params: channelBrowseType.VIDEOS
            }
        },
        
        // Data Processor
        (data:any) => {
            let videosTabRenderer = helpers.recursiveSearchForKey("tabRenderer", data);
            videosTabRenderer = videosTabRenderer.find((a:any) => a.title.toLowerCase() == "videos");
    
            if(videosTabRenderer) {
                const gridRendererContainer = helpers.recursiveSearchForKey("gridRenderer", videosTabRenderer)[0];
                if(gridRendererContainer) {
                    const items = helpers.recursiveSearchForKey("items", gridRendererContainer)[0];
                    return items;
                }
            } else {
                return helpers.recursiveSearchForKey("continuationItems", data)[0];
            }
        }, this.httpclient, true);
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
}

enum channelBrowseType {
    DETAILS = "EgVhYm91dA%3D%3D",
    CHANNELS = "EghjaGFubmVscw%3D%3D",
    VIDEOS = "EgZ2aWRlb3M%3D",
}