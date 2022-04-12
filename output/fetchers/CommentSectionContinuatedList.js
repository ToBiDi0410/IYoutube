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
exports.CommentSectionContinuatedList = void 0;
const constants_1 = require("../constants");
const HTTPClient_1 = require("../interfaces/HTTPClient");
const ContinuatedList_1 = require("./ContinuatedList");
const helpers_1 = require("./helpers");
class CommentSectionContinuatedList extends ContinuatedList_1.ContinuatedList {
    constructor(videoId, httpclient) {
        super({
            url: constants_1.ENDPOINT_NEXT,
            method: HTTPClient_1.HTTPRequestMethod.POST,
            data: {
                autonavState: "STATE_ON",
                captionsRequested: true,
                contentCheckOK: false,
                params: "OALAAQHCAwtPUEhMX09MVzNkUQ%3D%3D",
                racyCheckOk: false,
                videoId: videoId,
            }
        }, function (resJSON) {
            return __awaiter(this, void 0, void 0, function* () {
                const itemSectionRenderers = helpers_1.default.recursiveSearchForKey("itemSectionRenderer", resJSON);
                const commentSectionRenderer = itemSectionRenderers.find((a) => a.targetId == 'comments-section');
                if (commentSectionRenderer)
                    return [];
                const continuationItems = helpers_1.default.recursiveSearchForKey("continuationItems", resJSON)[1];
                return continuationItems;
            });
        }, httpclient, false);
    }
}
exports.CommentSectionContinuatedList = CommentSectionContinuatedList;
