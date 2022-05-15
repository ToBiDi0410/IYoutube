export interface HTTPClient {
    request(options: HTTPRequestOptions):Promise<HTTPResponse>;
}

export interface HTTPRequestOptions {
    headers?: HTTPMap,
    params?: HTTPMap
    data?: any,
    method: HTTPRequestMethod,
    url: string,
    noCache?: boolean
}

export interface HTTPResponse {
    status: number,
    data: string,
    headers: HTTPMap
}

export enum HTTPRequestMethod {
    GET = "GET",
    POST = "POST"
}

export type HTTPMap = any;