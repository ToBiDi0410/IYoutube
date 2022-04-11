import { HTTPClient, HTTPMap, HTTPRequestOptions } from "./interfaces/HTTPClient";
export declare class WrappedHTTPClient {
    client: HTTPClient;
    headers: HTTPMap;
    authorizationHeaderCallback?: Function;
    cookieString: string;
    constructor(client: HTTPClient);
    request(options: HTTPRequestOptions): Promise<import("./interfaces/HTTPClient").HTTPResponse>;
}
