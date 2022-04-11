/// <reference types="node" />
import { Channel } from "diagnostics_channel";
import { ContinuatedList } from "./ContinuatedList";
import { Playlist } from "../interfaces/Playlist";
import IYoutubeClient from "../main";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
export declare class User {
    httpclient: WrappedHTTPClient;
    client: IYoutubeClient;
    constructor(httpclient: WrappedHTTPClient, client: IYoutubeClient);
    getPlaylists(): Promise<Array<Playlist>>;
    getWatchLaterPlaylist(): Promise<Playlist>;
    getLikedPlaylist(): Promise<Playlist>;
    getSubscriptions(): Promise<Array<Channel>>;
    getSubscriptionFeed(): ContinuatedList;
}
