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
exports.CommentThreadRepliesContinuatedList = void 0;
const constants_1 = require("../constants");
const HTTPClient_1 = require("../interfaces/HTTPClient");
const main_1 = require("../main");
const helpers_1 = require("./helpers");
class CommentThreadRepliesContinuatedList extends main_1.ContinuatedList {
    constructor(initialContinuationToken, httpclient) {
        super({
            url: constants_1.ENDPOINT_NEXT,
            method: HTTPClient_1.HTTPRequestMethod.POST,
        }, function (resJSON) {
            return __awaiter(this, void 0, void 0, function* () {
                const continuationItems = helpers_1.default.recursiveSearchForKey("continuationItems", resJSON)[0];
                return continuationItems;
            });
        }, httpclient, false);
        this.continuationToken = initialContinuationToken;
    }
}
exports.CommentThreadRepliesContinuatedList = CommentThreadRepliesContinuatedList;
