import { Channel } from "diagnostics_channel";
import helpers from "./helpers";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { HTTPRequestMethod, HTTPRequestOptions } from "../interfaces/HTTPClient";
import { Playlist } from "../interfaces/Playlist";
import { Video } from "../interfaces/Video";

export class ContinuatedList {

    results: Array<Video | Channel | Playlist>;
    endReached = false;

    #requestOptions: HTTPRequestOptions;
    #httpclient: WrappedHTTPClient;
    #dataprocessor: Function;
    #continuationToken = "";
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
        if(this.#continuationToken != "") {
            joinedData.continuation = this.#continuationToken;
            if(this.onlyContinuation) {
                delete joinedData["browseId"];
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
        if(continuationCommand) this.#continuationToken = continuationCommand.token;
        else this.endReached = true;

        let items = await this.#dataprocessor(resJSON);
        items = helpers.processRendererItems(items, this.#httpclient);
        this.results = this.results.concat(items);
        return items;
    }

    getByType(type: typeof Video | typeof Playlist | typeof Channel) {
        const refactoredType:any = type;
        return this.results.filter((elem) => { return elem instanceof refactoredType });
    }
}