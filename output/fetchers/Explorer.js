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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Explorer = void 0;
const HTTPClient_1 = require("../interfaces/HTTPClient");
const helpers_1 = require("./helpers");
const constants_1 = require("../constants");
class Explorer {
    constructor(httpclient, client) {
        this.httpclient = httpclient;
        this.client = client;
    }
    getPopularVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.throwErrorIfNotReady();
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_BROWSE,
                params: {
                    prettyPrint: false
                },
                data: {
                    browseId: "FEexplore"
                }
            });
            const resJSON = yield JSON.parse(res.data);
            const popularShelf = helpers_1.default.recursiveSearchForKey("expandedShelfContentsRenderer", resJSON)[0];
            let items = popularShelf.items;
            items = helpers_1.default.processRendererItems(items, this.httpclient);
            return items;
        });
    }
    getTrendsNow() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.throwErrorIfNotReady();
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_BROWSE,
                params: {
                    prettyPrint: false
                },
                data: {
                    browseId: "FEtrending",
                    params: "6gQJRkVleHBsb3Jl"
                }
            });
            const resJSON = yield JSON.parse(res.data);
            const categorieShelfs = helpers_1.default.recursiveSearchForKey("tabs", resJSON)[0];
            const requestedShelf = categorieShelfs.find((a) => { return a.tabRenderer.title == "Now"; });
            const sectionListRenderer = helpers_1.default.recursiveSearchForKey("expandedShelfContentsRenderer", requestedShelf);
            let items = sectionListRenderer.map((a) => (a.items));
            items = [...items[0], ...items[1]];
            items = helpers_1.default.processRendererItems(items, this.httpclient);
            return items;
        });
    }
}
exports.Explorer = Explorer;
