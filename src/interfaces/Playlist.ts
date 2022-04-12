import helpers from "../fetchers/helpers";
import { PlaylistContinuatedList } from "../fetchers/PlaylistContinuatedList";
import { HTTPRequestMethod } from "./HTTPClient";
import { Video, Thumbnail, ContinuatedList, Channel, WrappedHTTPClient } from "../main";
import { ENDPOINT_BROWSE, ENDPOINT_LIKE, ENDPOINT_REMOVELIKE } from "../constants";

export class Playlist {
    playlistId?: string;
    title?: string;
    description?: string;
    thumbnails?: Array<Thumbnail>;
    videoCount?: number;
    viewCount?: number;
    owner?: Channel;
    videos?:Array<Video>
    canReorder?: boolean;
    isEditable?:boolean;
    lastEditText?:string;
    canLike?: boolean;

    httpclient: WrappedHTTPClient;

    #continuatedList?: ContinuatedList;
    #likeParam?: string;

    constructor(httpclient : WrappedHTTPClient) {
        this.httpclient = httpclient;
    }

    fromPlaylistRenderer(obj:any) {
        this.playlistId = helpers.recursiveSearchForKey("playlistId", obj)[0];

        const titleContainer = helpers.recursiveSearchForKey("title", obj)[0];
        if(titleContainer)
            this.title = helpers.recursiveSearchForKey("simpleText", titleContainer)[0];

        let thumbnailContainer = helpers.recursiveSearchForKey("playlistVideoThumbnailRenderer", obj)[0];
        if(thumbnailContainer)
            this.thumbnails = helpers.recursiveSearchForKey("thumbnails", thumbnailContainer)[0];

        this.videoCount = helpers.recursiveSearchForKey("videoCount", obj)[0];

        const channelContainer = helpers.recursiveSearchForKey("shortBylineText", obj)[0];
        if(channelContainer) {
            this.owner = new Channel(this.httpclient);
            this.owner.fromPlaylistRenderer(obj);
        }
    }

    fromPlaylistAddToOptionRenderer(obj: any) {
        this.playlistId = helpers.recursiveSearchForKey("playlistId", obj)[0];
    }

    async loadAll() {
        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_BROWSE,
            data: {
                browseId: "VL" + this.playlistId
            }
        });
        if(res.status != 200) throw new Error("Invalid Response Code");
        const resJSON = await JSON.parse(res.data);
        if(!resJSON.contents) throw new Error("Playlist not found");

        const playlistRendererContainer = helpers.recursiveSearchForKey("playlistVideoListRenderer", resJSON)[0];

        if(playlistRendererContainer) {
            this.canReorder = helpers.recursiveSearchForKey("canReorder", playlistRendererContainer)[0];
            this.isEditable = helpers.recursiveSearchForKey("isEditable", playlistRendererContainer)[0];
        }

        const primaryInfoRendererContainer = helpers.recursiveSearchForKey("playlistSidebarPrimaryInfoRenderer", resJSON)[0];
        if(primaryInfoRendererContainer) {
            const statsContainer = helpers.recursiveSearchForKey("stats", primaryInfoRendererContainer)[0];
            if(statsContainer) {
                this.videoCount = helpers.getNumberFromText(helpers.recursiveSearchForKey("text", statsContainer[0])[0]);
                this.viewCount = helpers.getNumberFromText(helpers.recursiveSearchForKey("simpleText", statsContainer[1])[0]);
                this.lastEditText = helpers.recursiveSearchForKey("text", statsContainer[2]).join("");
            }

            //Can edit title
            const titleFormContainer = helpers.recursiveSearchForKey("titleForm", primaryInfoRendererContainer)[0];
            if(titleFormContainer)
                this.title = helpers.recursiveSearchForKey("simpleText", helpers.recursiveSearchForKey("textDisplayed", titleFormContainer)[0]).join("");

            //Cannot edit title
            const titleContainer = primaryInfoRendererContainer.title;
            if(titleContainer)
                this.title = helpers.recursiveSearchForKey("text", titleContainer).join("");

            //Can edit description
            const descriptionForm = helpers.recursiveSearchForKey("descriptionForm", primaryInfoRendererContainer)[0];
            if(descriptionForm)
                this.description = helpers.recursiveSearchForKey("simpleText", helpers.recursiveSearchForKey("textDisplayed", descriptionForm)[0]).join("");

            //Cannot edit description
            const descriptionContainer = helpers.recursiveSearchForKey("description", primaryInfoRendererContainer)[0];
            if(descriptionContainer)
                this.description= helpers.recursiveSearchForKey("text", descriptionContainer).join("");

            const thumbnailsContainer = helpers.recursiveSearchForKey("thumbnails", primaryInfoRendererContainer);
            if(thumbnailsContainer)
                this.thumbnails = thumbnailsContainer;

            const likeButtonContainer = helpers.recursiveSearchForKey("toggleButtonRenderer", primaryInfoRendererContainer)[0];
            if(likeButtonContainer) {
                this.canLike = true;
                this.#likeParam = helpers.recursiveSearchForKey("removeLikeParams", likeButtonContainer).join("");
            } else this.canLike = false;

        } else throw new Error("PrimaryInfoRenderer was missing");

        const videoOwnerContainer = helpers.recursiveSearchForKey("videoOwner", resJSON)[0];
        if(videoOwnerContainer) {
            this.owner = new Channel(this.httpclient);
            this.owner.fromVideoOwnerRenderer(videoOwnerContainer);
        }

    }

    getContinuatedList():PlaylistContinuatedList {
        if(this.#continuatedList) return this.#continuatedList;

        if(this.playlistId) {
            this.#continuatedList = new PlaylistContinuatedList(this.playlistId, this.httpclient);
            return this.getContinuatedList();
        }
        
        throw new Error("Cannot construct Continuated List for Playlist without the playlistID");
    }

    async like() {
        if(!this.#likeParam || !this.canLike) throw new Error("Cannot add or remove Playlist because not all Data is loaded or it is not possible");

        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_LIKE,
            params: { prettyPrint: false },
            data: {
                params: this.#likeParam,
                target: {
                    playlistId: this.playlistId
                }
            }
        });
        return res.status == 200;
    }

    async removeLike() {
        if(!this.#likeParam || !this.canLike) throw new Error("Cannot add or remove Playlist because not all Data is loaded or its forbidden");

        const res = await this.httpclient.request({
            method: HTTPRequestMethod.POST,
            url: ENDPOINT_REMOVELIKE,
            params: { prettyPrint: false },
            data: {
                params: this.#likeParam,
                target: {
                    playlistId: this.playlistId
                }
            }
        });
        return res.status == 200;
    }

    //TODO LOAD EXTENDED INFORMATION
}