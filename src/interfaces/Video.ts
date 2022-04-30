import { ENDPOINT_COMMENT_CREATE, ENDPOINT_DISLIKE, ENDPOINT_LIKE, ENDPOINT_NEXT, ENDPOINT_PLAYER, ENDPOINT_REMOVELIKE } from "../constants";
import helpers from "../fetchers/helpers";
import { CommentSectionContinuatedList, ContinuatedList, WrappedHTTPClient, Channel, Thumbnail, CaptionTrack, CommentThread } from "../main";
import { HTTPRequestMethod } from "./HTTPClient";

export class Video {

    videoId?: any;
    title?: string;
    shortDescription?: string;
    description?: string;
    viewCount?: number;
    thumbnails?: Array<Thumbnail>;
    richThumbnails?: Array<Thumbnail>;
    publishedText?: string;
    publishedDate?: Date;
    owner?: Channel;
    playable?: boolean;
    private?: boolean;
    listed?: boolean;
    live?: boolean;
    familySafe?: boolean;
    captionTracks?: Array<CaptionTrack>;
    keywords?: Array<String>;
    canLike?: boolean;
    hasLiked?: boolean;
    currentUserIsOwner?: boolean;
    commentThreadList?: CommentSectionContinuatedList;

    httpclient: WrappedHTTPClient;
    error = false;

    constructor(httpclient: WrappedHTTPClient) {
        this.httpclient = httpclient;
    }

    fromVideoRenderer(obj: any) {
        //VIDEOID
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
            this.publishedText = helpers.recursiveSearchForKey("simpleText", timeTextContainer).join("");

        if(helpers.recursiveSearchForKey("ownerText", obj).length > 0) {
            this.owner = new Channel(this.httpclient);
            this.owner.fromVideoRenderer(obj);
        }
    }

    fromVideoPlayerRenderer(obj: any) {
        this.fromVideoRenderer(obj);

        const timeTextContainer = helpers.recursiveSearchForKey("publishedTimeText", obj)[0];
        if(timeTextContainer)
            this.publishedText = helpers.recursiveSearchForKey("text", timeTextContainer).join("");

        const descriptionContainer = helpers.recursiveSearchForKey("description", obj)[0];
        if(descriptionContainer) {
            this.description = helpers.recursiveSearchForKey("text", descriptionContainer).join("");
        }

        this.thumbnails = [helpers.getVideoDefaultThumbnail(this.videoId)];
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

    async loadAll() {
        const playerResponse = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_PLAYER,
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
        const playerJSON = await JSON.parse(playerResponse.data);

        const videoDetails = helpers.recursiveSearchForKey("videoDetails", playerJSON)[0];
        if(videoDetails) {
            this.title = videoDetails.title;
            this.description = videoDetails.shortDescription;
            this.thumbnails = helpers.recursiveSearchForKey("thumbnails", videoDetails)[0];
            this.viewCount = helpers.getNumberFromText(videoDetails.viewCount);
            this.private = videoDetails.isPrivate;
            this.live = videoDetails.isLiveContent;
            this.keywords = videoDetails.keywords;
            this.currentUserIsOwner = videoDetails.isOwnerViewing;
            this.canLike = videoDetails.allowRatings;
        }

        const playerMicroRenderer = helpers.recursiveSearchForKey("playerMicroformatRenderer", playerJSON)[0];
        if(playerMicroRenderer) {
            this.publishedText = playerMicroRenderer.publishDate;
            this.listed = !playerMicroRenderer.isUnlisted;
            this.familySafe = playerMicroRenderer.isFamilySafe;

            this.owner = new Channel(this.httpclient);
            this.owner.fromPlayerMicroRenderer(playerMicroRenderer);
        }

        const captions = helpers.recursiveSearchForKey("captionTracks", playerJSON)[0];
        if(captions) {
            this.captionTracks = captions.map((a:any) => {
                a.name = helpers.recursiveSearchForKey("simpleText", a.name).join("");
                return a;
            });
        }

        const nextResponse = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_NEXT,
            data: { 
                autonavState: "STATE_ON",
                captionsRequested: true,
                contentCheckOK: false,
                params: "OALAAQHCAwtPUEhMX09MVzNkUQ%3D%3D",
                racyCheckOk: false,
                videoId: this.videoId,
            }
        });
        const nextJSON = await JSON.parse(nextResponse.data);

        const itemSectionRenderers = helpers.recursiveSearchForKey("itemSectionRenderer", nextJSON);
        const commentSectionRenderer = itemSectionRenderers.find((a:any) => a.targetId == 'comments-section');
        if(commentSectionRenderer) this.commentThreadList = new CommentSectionContinuatedList(helpers.recursiveSearchForKey("token", commentSectionRenderer)[0], this.httpclient);

        const primaryInfoRenderer = helpers.recursiveSearchForKey("videoPrimaryInfoRenderer", nextJSON)[0];
        if(primaryInfoRenderer) {
            const titleContainer = primaryInfoRenderer.title;
            if(titleContainer)
                this.title = helpers.recursiveSearchForKey("text", titleContainer).join();

            const viewCountContainer = helpers.recursiveSearchForKey("viewCount", nextJSON)[0];
            if(viewCountContainer) 
                this.viewCount = helpers.getNumberFromText(helpers.recursiveSearchForKey("simpleText", viewCountContainer).join(""));

            const dateContainer = helpers.recursiveSearchForKey("dateText", nextJSON)[0];
            if(dateContainer)
                this.publishedDate = new Date(helpers.recursiveSearchForKey("simpleText", dateContainer).join(""));

            //In theory, it would be possible to get the exact like count using the Accessability Text
            const buttons = helpers.recursiveSearchForKey("topLevelButtons", nextJSON)[0];
            if(buttons) {
                const likeButton = buttons[0].toggleButtonRenderer;
                const dislikeButton = buttons[1].toggleButtonRenderer;
                if(likeButton && dislikeButton)
                    this.hasLiked = likeButton.isToggled && !dislikeButton.isToggled;
            }
        }

        const secondaryInfoRenderer = helpers.recursiveSearchForKey("videoSecondaryInfoRenderer", nextJSON)[0];
        if(secondaryInfoRenderer) {
            const descriptionContainer = secondaryInfoRenderer.description;
            if(descriptionContainer)
                this.description = helpers.recursiveSearchForKey("text", descriptionContainer).join("");
            
            const ownerContainer = secondaryInfoRenderer.owner;
            if(ownerContainer) {
                this.owner = new Channel(this.httpclient);
                this.owner.fromVideoOwnerRenderer(helpers.recursiveSearchForKey("videoOwnerRenderer", ownerContainer));
                this.owner.subscribed = helpers.recursiveSearchForKey("subscribed", nextJSON)[0];
            }
        }
        //TODO: Video Formats
    }

    async getCommentThreadList():Promise<ContinuatedList | undefined> {
        if(!this.commentThreadList) {
            await this.loadAll();
            if(!this.commentThreadList) throw new Error("This Video seems to have no comment section");
        }
        return this.commentThreadList;
    }

    async like() {
        if(this.canLike === false) throw new Error("This Video has disabled Like-Actions");
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_LIKE,
            data: {
                target: {
                    videoId: this.videoId
                }
            }
        });
        this.hasLiked = res.status == 200 ? true : this.hasLiked;
        return res.status == 200;   
    }

    async dislike() {
        if(this.canLike === false) throw new Error("This Video has disabled Like-Actions");
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_DISLIKE,
            data: {
                target: {
                    videoId: this.videoId
                }
            }
        });
        this.hasLiked = res.status == 200 ? false : this.hasLiked;
        return res.status == 200;
    }

    async removeLike() {
        if(this.canLike === false) throw new Error("This Video has disabled Like-Actions");
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_REMOVELIKE,
            data: {
                target: {
                    videoId: this.videoId
                }
            }
        });
        this.hasLiked = res.status == 200 ? undefined : this.hasLiked;
        return res.status == 200;
    }

    async comment(text: string):Promise<CommentThread> {
        var commentParams = atob(decodeURIComponent("EgtQSGdjOFE2cVRqYyoCCABQBw%3D%3D"));
        commentParams = commentParams.replace("PHgc8Q6qTjc", this.videoId);
        commentParams = encodeURIComponent(btoa(commentParams));
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_COMMENT_CREATE,
            data: {
                commentText: text,
                createCommentParams: commentParams
            }
        });
        const resJSON = JSON.parse(res.data);

        const commentThreadRenderer = helpers.recursiveSearchForKey("commentThreadRenderer", resJSON)[0];
        if(commentThreadRenderer) {
            var cmd = new CommentThread(this.httpclient);
            cmd.fromCommentThreadRenderer(commentThreadRenderer);
            return cmd;
        } else {
            throw new Error("Failed to create Comment on Video");
        }
    }
}