import { List } from "../main";
import { ContinuatedList } from "./ContinuatedList";
import { Playlist } from "../interfaces/Playlist";
import IYoutube from "../IYoutube";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
export declare class User {
    httpclient: WrappedHTTPClient;
    client: IYoutube;
    constructor(httpclient: WrappedHTTPClient, client: IYoutube);
    getPlaylists(): Promise<List>;
    getEditablePlaylists(): Promise<List>;
    getWatchLaterPlaylist(): Promise<Playlist>;
    getLikedPlaylist(): Promise<Playlist>;
    getSubscriptions(): Promise<List>;
    getSubscriptionFeed(): ContinuatedList;
}
