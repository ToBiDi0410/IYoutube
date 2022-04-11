"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _IYoutube_instances, _IYoutube_explorer, _IYoutube_user, _IYoutube_throwErrorIfNotReady;
Object.defineProperty(exports, "__esModule", { value: true });
const Authenticator_1 = require("./Authenticator");
const WrappedHTTPClient_1 = require("./WrappedHTTPClient");
const SearchContinuatedList_1 = require("./fetchers/SearchContinuatedList");
const Explorer_1 = require("./fetchers/Explorer");
const User_1 = require("./fetchers/User");
const Playlist_1 = require("./interfaces/Playlist");
const constants_1 = require("./constants");
class IYoutube {
    constructor(httpClient, storageAdapater) {
        _IYoutube_instances.add(this);
        _IYoutube_explorer.set(this, void 0);
        _IYoutube_user.set(this, void 0);
        this.rawHttpClient = httpClient;
        this.wrappedHttpClient = new WrappedHTTPClient_1.WrappedHTTPClient(this.rawHttpClient);
        this.storageAdapter = storageAdapater;
        this.authenticator = new Authenticator_1.Authenticator(this.rawHttpClient, this.storageAdapter);
        this.wrappedHttpClient.authorizationHeaderCallback = () => { return this.authenticator.getAuthorizationHeader(); };
        __classPrivateFieldSet(this, _IYoutube_explorer, new Explorer_1.Explorer(this.wrappedHttpClient, this), "f");
        __classPrivateFieldSet(this, _IYoutube_user, new User_1.User(this.wrappedHttpClient, this), "f");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (constants_1.DEBUG)
                console.log("");
            yield this.authenticator.init();
        });
    }
    search(term, type) {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _IYoutube_instances, "m", _IYoutube_throwErrorIfNotReady).call(this);
            var list = new SearchContinuatedList_1.SearchConitinuatedList(term, type, this.wrappedHttpClient);
            return list;
        });
    }
    getPlaylist(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _IYoutube_instances, "m", _IYoutube_throwErrorIfNotReady).call(this);
            var pl = new Playlist_1.Playlist(this.wrappedHttpClient);
            pl.playlistId = playlistId;
            yield pl.loadAll();
            return pl;
        });
    }
    getExplorer() {
        __classPrivateFieldGet(this, _IYoutube_instances, "m", _IYoutube_throwErrorIfNotReady).call(this);
        return __classPrivateFieldGet(this, _IYoutube_explorer, "f");
    }
    getUser() {
        __classPrivateFieldGet(this, _IYoutube_instances, "m", _IYoutube_throwErrorIfNotReady).call(this);
        return __classPrivateFieldGet(this, _IYoutube_user, "f");
    }
}
exports.default = IYoutube;
_IYoutube_explorer = new WeakMap(), _IYoutube_user = new WeakMap(), _IYoutube_instances = new WeakSet(), _IYoutube_throwErrorIfNotReady = function _IYoutube_throwErrorIfNotReady() {
    if (!this.storageAdapter)
        throw new Error("The provided Storage Adapter was invalid");
    if (!this.rawHttpClient)
        throw new Error("The provided HTTP Client was invalid");
    if (this.authenticator.requiresLogin())
        throw new Error("This Instance of IYoutube is not authenticated");
};
module.exports = IYoutube;
