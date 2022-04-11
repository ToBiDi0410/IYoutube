import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { Video } from "../interfaces/Video";
import IYoutubeClient from "../main";
export declare class Explorer {
    httpclient: WrappedHTTPClient;
    client: IYoutubeClient;
    constructor(httpclient: WrappedHTTPClient, client: IYoutubeClient);
    getPopularVideos(): Promise<Array<Video>>;
    getTrendsNow(): Promise<Array<Video>>;
}
