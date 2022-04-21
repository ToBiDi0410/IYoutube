import helpers from "./helpers";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { HTTPRequestOptions } from "../interfaces/HTTPClient";
import { List } from "../interfaces/List";

export class ContinuatedList extends List {

    endReached = false;
    requestOptions: HTTPRequestOptions;
    httpclient: WrappedHTTPClient;
    dataprocessor: Function;
    continuationToken = "";
    onlyContinuation = false;

    constructor(requestOptions: HTTPRequestOptions, dataprocessor: Function, httpclient : WrappedHTTPClient, onlyContinuation?:boolean) {
        super();
        this.requestOptions = requestOptions;
        this.httpclient = httpclient;
        this.dataprocessor = dataprocessor;
        if(this.onlyContinuation) this.onlyContinuation = onlyContinuation as boolean;
    }

    async loadFurhter() {
        if(this.endReached) return [];
        var joinedData = this.requestOptions.data;
        if(!joinedData) joinedData = {};
        if(this.continuationToken != "") {
            joinedData.continuation = this.continuationToken;
            if(this.onlyContinuation) joinedData = {
                continuation: this.continuationToken
            }
        }

        var res = await this.httpclient.request({
            method: this.requestOptions.method,
            url: this.requestOptions.url,
            data: joinedData,
            headers: this.requestOptions.headers ? this.requestOptions.headers : {},
            params: this.requestOptions.params ? this.requestOptions.params : {},
        });
        const resJSON = await JSON.parse(res.data);

        const continuationCommand = helpers.recursiveSearchForKey("continuationCommand", resJSON)[0];
        if(continuationCommand) this.continuationToken = continuationCommand.token;
        else this.endReached = true;

        let items = await this.dataprocessor(resJSON);
        items = helpers.processRendererItems(items, this.httpclient);
        this.results = this.results.concat(items);
        return items;
    }
}