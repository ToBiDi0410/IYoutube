import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { HTTPRequestOptions } from "../interfaces/HTTPClient";
import { List } from "../interfaces/List";
export declare class ContinuatedList extends List {
    endReached: boolean;
    requestOptions: HTTPRequestOptions;
    httpclient: WrappedHTTPClient;
    dataprocessor: Function;
    continuationToken: string;
    onlyContinuation: boolean;
    constructor(requestOptions: HTTPRequestOptions, dataprocessor: Function, httpclient: WrappedHTTPClient, onlyContinuation?: boolean);
    loadFurhter(): Promise<any>;
}
