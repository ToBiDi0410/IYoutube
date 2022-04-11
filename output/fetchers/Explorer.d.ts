import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { Video } from "../interfaces/Video";
import IYoutube from "../IYoutube";
export declare class Explorer {
    httpclient: WrappedHTTPClient;
    client: IYoutube;
    constructor(httpclient: WrappedHTTPClient, client: IYoutube);
    getPopularVideos(): Promise<Array<Video>>;
    getTrendsNow(): Promise<Array<Video>>;
}
