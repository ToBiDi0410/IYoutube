import { Authenticator } from "./Authenticator";
import { HTTPClient } from "./interfaces/HTTPClient";
import { StorageAdapter } from "./interfaces/StorageAdapter";
import { WrappedHTTPClient } from "./WrappedHTTPClient";

import { SearchConitinuatedList, SearchType } from "./fetchers/SearchContinuatedList";
import { Explorer } from "./fetchers/Explorer";
import { ContinuatedList } from "./fetchers/ContinuatedList";
import { User } from "./fetchers/User";
import { Playlist } from "./interfaces/Playlist";
import { DEBUG } from "./constants";
import { Channel, Video } from "./main";

export default class IYoutube {

    rawHttpClient: HTTPClient;
    wrappedHttpClient: WrappedHTTPClient;

    storageAdapter : StorageAdapter;
    authenticator: Authenticator;

    #explorer : Explorer;
    #user : User;

    constructor(httpClient : HTTPClient, storageAdapater : StorageAdapter) {
        this.rawHttpClient = httpClient;
        this.wrappedHttpClient = new WrappedHTTPClient(this.rawHttpClient);
        this.storageAdapter = storageAdapater;

        this.authenticator = new Authenticator(this.rawHttpClient, this.storageAdapter);
        this.wrappedHttpClient.authorizationHeaderCallback = () => { return this.authenticator.getAuthorizationHeader() };

        this.#explorer = new Explorer(this.wrappedHttpClient, this);
        this.#user = new User(this.wrappedHttpClient, this);
    }

    async init() {
        if(DEBUG) console.log("");
        await this.authenticator.init();
    }

    async search(term: string, type : SearchType):Promise<ContinuatedList> {
        this.throwErrorIfNotReady();
        var list = new SearchConitinuatedList(term, type, this.wrappedHttpClient);
        return list;
    }

    async getPlaylist(playlistId: string):Promise<Playlist> {
        this.throwErrorIfNotReady();
        var pl = new Playlist(this.wrappedHttpClient);
        pl.playlistId = playlistId;
        await pl.loadAll();
        return pl;
    }

    async getChannel(channelId: string):Promise<Channel> {
        this.throwErrorIfNotReady();
        var ch = new Channel(this.wrappedHttpClient);
        ch.channelId = channelId;
        await ch.loadAll();
        return ch;
    }

    async getVideo(videoId: string):Promise<Video> {
        this.throwErrorIfNotReady();
        var v = new Video(this.wrappedHttpClient);
        v.videoId = videoId;
        await v.loadAll();
        return v;
    }

    getExplorer():Explorer {
        return this.#explorer;
    }

    getUser():User {
        return this.#user;
    }

    throwErrorIfNotReady(){
        if(!this.storageAdapter) throw new Error("The provided Storage Adapter was invalid");
        if(!this.rawHttpClient) throw new Error("The provided HTTP Client was invalid");
        if(this.authenticator.requiresLogin()) throw new Error("This Instance of IYoutube is not authenticated");
    }
}