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
exports.SearchType = exports.SearchConitinuatedList = void 0;
const HTTPClient_1 = require("../interfaces/HTTPClient");
const helpers_1 = require("./helpers");
const ContinuatedList_1 = require("./ContinuatedList");
const constants_1 = require("../constants");
class SearchConitinuatedList extends ContinuatedList_1.ContinuatedList {
    constructor(term, searchType, httpclient) {
        super({
            url: constants_1.ENDPOINT_SEARCH,
            method: HTTPClient_1.HTTPRequestMethod.POST,
            data: {
                query: term,
                params: searchType
            }
        }, function (resJSON) {
            return __awaiter(this, void 0, void 0, function* () {
                let itemSectionRenderer = helpers_1.default.recursiveSearchForKey("itemSectionRenderer", resJSON);
                if (itemSectionRenderer.length > 0)
                    itemSectionRenderer = itemSectionRenderer[itemSectionRenderer.length - 1];
                else
                    itemSectionRenderer = itemSectionRenderer[0];
                const items = helpers_1.default.recursiveSearchForKey("contents", itemSectionRenderer)[0];
                return items;
            });
        }, httpclient);
    }
}
exports.SearchConitinuatedList = SearchConitinuatedList;
var SearchType;
(function (SearchType) {
    SearchType["VIDEO"] = "EgIQAQ%3D%3D";
    SearchType["CHANNEL"] = "EgIQAg%3D%3D";
    SearchType["PLAYLIST"] = "EgIQAw%3D%3D";
    SearchType["MOVIE"] = "EgIQBA%3D%3D";
    SearchType["ANY"] = "";
})(SearchType = exports.SearchType || (exports.SearchType = {}));
