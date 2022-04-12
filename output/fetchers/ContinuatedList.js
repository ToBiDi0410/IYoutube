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
var _ContinuatedList_requestOptions, _ContinuatedList_httpclient, _ContinuatedList_dataprocessor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContinuatedList = void 0;
const helpers_1 = require("./helpers");
const main_1 = require("../main");
class ContinuatedList {
    constructor(requestOptions, dataprocessor, httpclient, onlyContinuation) {
        this.endReached = false;
        _ContinuatedList_requestOptions.set(this, void 0);
        _ContinuatedList_httpclient.set(this, void 0);
        _ContinuatedList_dataprocessor.set(this, void 0);
        this.continuationToken = "";
        this.onlyContinuation = false;
        __classPrivateFieldSet(this, _ContinuatedList_requestOptions, requestOptions, "f");
        __classPrivateFieldSet(this, _ContinuatedList_httpclient, httpclient, "f");
        __classPrivateFieldSet(this, _ContinuatedList_dataprocessor, dataprocessor, "f");
        this.results = new Array();
        if (this.onlyContinuation)
            this.onlyContinuation = onlyContinuation;
    }
    loadFurhter() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.endReached)
                return [];
            var joinedData = __classPrivateFieldGet(this, _ContinuatedList_requestOptions, "f").data;
            if (!joinedData)
                joinedData = {};
            if (this.continuationToken != "") {
                joinedData.continuation = this.continuationToken;
                if (this.onlyContinuation)
                    joinedData = {
                        continuation: this.continuationToken
                    };
            }
            var res = yield __classPrivateFieldGet(this, _ContinuatedList_httpclient, "f").request({
                method: __classPrivateFieldGet(this, _ContinuatedList_requestOptions, "f").method,
                url: __classPrivateFieldGet(this, _ContinuatedList_requestOptions, "f").url,
                data: joinedData,
                headers: __classPrivateFieldGet(this, _ContinuatedList_requestOptions, "f").headers ? __classPrivateFieldGet(this, _ContinuatedList_requestOptions, "f").headers : {},
                params: __classPrivateFieldGet(this, _ContinuatedList_requestOptions, "f").params ? __classPrivateFieldGet(this, _ContinuatedList_requestOptions, "f").params : {},
            });
            const resJSON = yield JSON.parse(res.data);
            const continuationCommand = helpers_1.default.recursiveSearchForKey("continuationCommand", resJSON)[0];
            if (continuationCommand)
                this.continuationToken = continuationCommand.token;
            else
                this.endReached = true;
            let items = yield __classPrivateFieldGet(this, _ContinuatedList_dataprocessor, "f").call(this, resJSON);
            items = helpers_1.default.processRendererItems(items, __classPrivateFieldGet(this, _ContinuatedList_httpclient, "f"));
            this.results = this.results.concat(items);
            return items;
        });
    }
    getByType(type) {
        return this.results.filter((elem) => { return elem instanceof type; });
    }
    getVideos() {
        return this.getByType(main_1.Video);
    }
    getPlaylists() {
        return this.getByType(main_1.Playlist);
    }
    getChannels() {
        return this.getByType(main_1.Channel);
    }
    getComments() {
        return this.getByType(main_1.Comment);
    }
    getCommentThreads() {
        return this.getByType(main_1.CommentThread);
    }
}
exports.ContinuatedList = ContinuatedList;
_ContinuatedList_requestOptions = new WeakMap(), _ContinuatedList_httpclient = new WeakMap(), _ContinuatedList_dataprocessor = new WeakMap();
