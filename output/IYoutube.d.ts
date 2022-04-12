import { Authenticator } from "./Authenticator";
import { HTTPClient } from "./interfaces/HTTPClient";
import { StorageAdapter } from "./interfaces/StorageAdapter";
import { WrappedHTTPClient } from "./WrappedHTTPClient";
import { SearchType } from "./fetchers/SearchContinuatedList";
import { Explorer } from "./fetchers/Explorer";
import { ContinuatedList } from "./fetchers/ContinuatedList";
import { User } from "./fetchers/User";
import { Playlist } from "./interfaces/Playlist";
import { Channel } from "./main";
export default class IYoutube {
    #private;
    rawHttpClient: HTTPClient;
    wrappedHttpClient: WrappedHTTPClient;
    storageAdapter: StorageAdapter;
    authenticator: Authenticator;
    constructor(httpClient: HTTPClient, storageAdapater: StorageAdapter);
    init(): Promise<void>;
    search(term: string, type: SearchType): Promise<ContinuatedList>;
    getPlaylist(playlistId: string): Promise<Playlist>;
    getChannel(channelId: string): Promise<Channel>;
    getExplorer(): Explorer;
    getUser(): User;
    throwErrorIfNotReady(): void;
}
