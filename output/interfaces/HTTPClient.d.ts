export interface HTTPClient {
    request(options: HTTPRequestOptions): Promise<HTTPResponse>;
}
export interface HTTPRequestOptions {
    headers?: HTTPMap;
    params?: HTTPMap;
    data?: any;
    method: HTTPRequestMethod;
    url: string;
}
export interface HTTPResponse {
    status: number;
    data: string;
    headers: HTTPMap;
}
export declare enum HTTPRequestMethod {
    GET = "GET",
    POST = "POST"
}
export declare type HTTPMap = any;
