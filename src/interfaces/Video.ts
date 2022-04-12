import { ENDPOINT_DISLIKE, ENDPOINT_LIKE, ENDPOINT_REMOVELIKE } from "../constants";
import helpers from "../fetchers/helpers";
import { CommentSectionContinuatedList, ContinuatedList, WrappedHTTPClient, Channel, Thumbnail } from "../main";
import { HTTPRequestMethod } from "./HTTPClient";

export class Video {

    videoId?: any;
    title?: string;
    shortDescription?: string;
    viewCount?: number;
    thumbnails?: Array<Thumbnail>;
    richThumbnails?: Array<Thumbnail>;
    publishedText?: string;
    owner?: Channel;
    playable?: boolean;

    httpclient: WrappedHTTPClient;
    error = false;

    constructor(httpclient: WrappedHTTPClient) {
        this.httpclient = httpclient;
    }

    fromVideoRenderer(obj: any) {
        // VIDEOID
        this.videoId = helpers.recursiveSearchForKey("videoId", obj)[0];

        // TITLE
        const videoTitleContainer = helpers.recursiveSearchForKey("title", obj)[0];
        if(videoTitleContainer) 
            this.title = helpers.recursiveSearchForKey("text", videoTitleContainer)[0];

        //INTEGRETIY CHECK
        if(!this.videoId || !this.title) {
            console.warn("[VIDEO] Failed to parse Video Object:\n", obj);
            this.error = true;
            return;
        }

        //SHORT DESCRIPTION
        const shortDescriptionContainer = helpers.recursiveSearchForKey("detailedMetadataSnippets", obj)[0];
        if(shortDescriptionContainer)
            this.shortDescription = helpers.recursiveSearchForKey("text", shortDescriptionContainer)[0];

        //VIEW COUNT
        const viewCountTextContainer = helpers.recursiveSearchForKey("viewCountText", obj)[0];
        if(viewCountTextContainer && helpers.recursiveSearchForKey("simpleText", viewCountTextContainer).length > 0) {
            this.viewCount = helpers.getNumberFromText(helpers.recursiveSearchForKey("simpleText", viewCountTextContainer)[0]);
        }

        //THUMBNAILS
        const thumbnailContainer = helpers.recursiveSearchForKey("thumbnail", obj)[0];
        if(thumbnailContainer) 
            this.thumbnails = helpers.recursiveSearchForKey("thumbnails", obj)[0];

        const richThumbnailContainer = helpers.recursiveSearchForKey("richThumbnail", obj)[0];
        if(richThumbnailContainer)
            this.richThumbnails = helpers.recursiveSearchForKey("thumbnails", richThumbnailContainer)[0];

        //PUBLISHED
        const timeTextContainer = helpers.recursiveSearchForKey("publishedTimeText", obj)[0];
        if(timeTextContainer)
            this.publishedText = helpers.recursiveSearchForKey("simpleText", timeTextContainer)[0];

        if(helpers.recursiveSearchForKey("ownerText", obj).length > 0) {
            this.owner = new Channel(this.httpclient);
            this.owner.fromVideoRenderer(obj);
        }
    }

    fromGridRenderer(obj:any) {
        /* Structure is nearly same */
        this.fromVideoRenderer(obj);

        const shortBylineText = helpers.recursiveSearchForKey("shortBylineText", obj)[0];
        if(shortBylineText) {
            this.owner = new Channel(this.httpclient);
            this.owner.fromGridVideoRenderer(obj)
        }
    }
    
    fromPlaylistVideoRenderer(obj:any) {
        this.fromVideoRenderer(obj);

        const shortBylineText = helpers.recursiveSearchForKey("shortBylineText", obj)[0];
        if(shortBylineText) {
            this.owner = new Channel(this.httpclient);
            this.owner.fromPlaylistVideoRendererBylineText(shortBylineText);
        }

        this.playable = helpers.recursiveSearchForKey("isPlayable", obj)[0];
    }

    async getCommentThreadList():Promise<ContinuatedList> {
        var list = new CommentSectionContinuatedList(this.videoId, this.httpclient);
        await list.loadFurhter();
        return list;
    }

    async like() {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_LIKE,
            data: {
                target: {
                    videoId: this.videoId
                }
            }
        });

        const resJSON = await JSON.parse(res.data);
        return res.status == 200;   
    }

    async dislike() {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_DISLIKE,
            data: {
                target: {
                    videoId: this.videoId
                }
            }
        });

        const resJSON = await JSON.parse(res.data);
        return res.status == 200;
    }

    async removeLike() {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_REMOVELIKE,
            data: {
                target: {
                    videoId: this.videoId
                }
            }
        });

        const resJSON = await JSON.parse(res.data);
        return res.status == 200;
    }
}