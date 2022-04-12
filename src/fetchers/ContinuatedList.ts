import helpers from "./helpers";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { HTTPRequestOptions } from "../interfaces/HTTPClient";
import { Video, Channel, Playlist, Comment, CommentThread } from "../main";

export class ContinuatedList {

    results: Array<Video | Channel | Playlist | Comment | CommentThread>;
    endReached = false;

    #requestOptions: HTTPRequestOptions;
    #httpclient: WrappedHTTPClient;
    #dataprocessor: Function;
    continuationToken = "";
    onlyContinuation = false;

    constructor(requestOptions: HTTPRequestOptions, dataprocessor: Function, httpclient : WrappedHTTPClient, onlyContinuation?:boolean) {
        this.#requestOptions = requestOptions;
        this.#httpclient = httpclient;
        this.#dataprocessor = dataprocessor;
        this.results = new Array();
        if(this.onlyContinuation) this.onlyContinuation = onlyContinuation as boolean;
    }

    async loadFurhter() {
        if(this.endReached) return [];
        var joinedData = this.#requestOptions.data;
        if(!joinedData) joinedData = {};
        if(this.continuationToken != "") {
            joinedData.continuation = this.continuationToken;
            if(this.onlyContinuation) joinedData = {
                continuation: this.continuationToken
            }
        }

        var res = await this.#httpclient.request({
            method: this.#requestOptions.method,
            url: this.#requestOptions.url,
            data: joinedData,
            headers: this.#requestOptions.headers ? this.#requestOptions.headers : {},
            params: this.#requestOptions.params ? this.#requestOptions.params : {},
        });
        const resJSON = await JSON.parse(res.data);

        const continuationCommand = helpers.recursiveSearchForKey("continuationCommand", resJSON)[0];
        if(continuationCommand) this.continuationToken = continuationCommand.token;
        else this.endReached = true;

        let items = await this.#dataprocessor(resJSON);
        items = helpers.processRendererItems(items, this.#httpclient);
        this.results = this.results.concat(items);
        return items;
    }

    getByType(type: any) {
        return this.results.filter((elem) => { return elem instanceof type });
    }

    getVideos():Array<Video> {
        return this.getByType(Video) as Array<Video>
    }

    getPlaylists():Array<Playlist> {
        return this.getByType(Playlist) as Array<Playlist>;
    }

    getChannels():Array<Channel> {
        return this.getByType(Channel) as Array<Channel>;
    }

    getComments():Array<Comment> {
        return this.getByType(Comment) as Array<Comment>;
    }

    getCommentThreads():Array<CommentThread> {
        return this.getByType(CommentThread) as Array<CommentThread>;
    }
}