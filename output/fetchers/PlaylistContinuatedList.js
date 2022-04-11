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
exports.PlaylistContinuatedList = void 0;
const HTTPClient_1 = require("../interfaces/HTTPClient");
const helpers_1 = require("./helpers");
const ContinuatedList_1 = require("./ContinuatedList");
const constants_1 = require("../constants");
class PlaylistContinuatedList extends ContinuatedList_1.ContinuatedList {
    constructor(playlistId, httpclient) {
        super({
            url: constants_1.ENDPOINT_BROWSE,
            method: HTTPClient_1.HTTPRequestMethod.POST,
            data: {
                browseId: "VL" + playlistId
            }
        }, function (resJSON) {
            return __awaiter(this, void 0, void 0, function* () {
                const continuationItemsContainer = helpers_1.default.recursiveSearchForKey("continuationItems", resJSON)[0];
                if (continuationItemsContainer) {
                    return continuationItemsContainer;
                }
                else {
                    let itemSectionRenderer = helpers_1.default.recursiveSearchForKey("playlistVideoListRenderer", resJSON)[0];
                    const items = helpers_1.default.recursiveSearchForKey("contents", itemSectionRenderer)[0];
                    return items;
                }
            });
        }, httpclient, true);
    }
}
exports.PlaylistContinuatedList = PlaylistContinuatedList;
