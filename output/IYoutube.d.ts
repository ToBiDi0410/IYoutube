import { Authenticator } from "./Authenticator";
import { HTTPClient } from "./interfaces/HTTPClient";
import { StorageAdapter } from "./interfaces/StorageAdapter";
import { WrappedHTTPClient } from "./WrappedHTTPClient";
import { SearchType } from "./fetchers/SearchContinuatedList";
import { Explorer } from "./fetchers/Explorer";
import { ContinuatedList } from "./fetchers/ContinuatedList";
import { User } from "./fetchers/User";
import { Playlist } from "./interfaces/Playlist";
import { Channel, Video } from "./main";
export default class IYoutube {
    rawHttpClient: HTTPClient;
    wrappedHttpClient: WrappedHTTPClient;
    storageAdapter: StorageAdapter;
    authenticator: Authenticator;
    explorer: Explorer;
    user: User;
    constructor(httpClient: HTTPClient, storageAdapater: StorageAdapter);
    init(): Promise<void>;
    search(term: string, type: SearchType): Promise<ContinuatedList>;
    getPlaylist(playlistId: string): Promise<Playlist>;
    getChannel(channelId: string): Promise<Channel>;
    getVideo(videoId: string): Promise<Video>;
    getWhatToWatch(): ContinuatedList;
    getExplorer(): Explorer;
    getUser(): User;
    throwErrorIfNotReady(): void;
}
