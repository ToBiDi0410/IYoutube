import { HTTPClient, HTTPRequestOptions } from "../interfaces/HTTPClient";
export declare class NodeFetchClientAdapter implements HTTPClient {
    request(options: HTTPRequestOptions): Promise<{
        status: any;
        data: any;
        headers: any;
    }>;
}
