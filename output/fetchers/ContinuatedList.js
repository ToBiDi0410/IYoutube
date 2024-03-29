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
exports.ContinuatedList = void 0;
const helpers_1 = require("./helpers");
const List_1 = require("../interfaces/List");
class ContinuatedList extends List_1.List {
    constructor(requestOptions, dataprocessor, httpclient, onlyContinuation) {
        super();
        this.endReached = false;
        this.continuationToken = "";
        this.onlyContinuation = false;
        this.requestOptions = requestOptions;
        this.httpclient = httpclient;
        this.dataprocessor = dataprocessor;
        if (this.onlyContinuation)
            this.onlyContinuation = onlyContinuation;
    }
    loadFurhter() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.endReached)
                return [];
            var joinedData = this.requestOptions.data;
            if (!joinedData)
                joinedData = {};
            if (this.continuationToken != "") {
                joinedData.continuation = this.continuationToken;
                if (this.onlyContinuation)
                    joinedData = {
                        continuation: this.continuationToken
                    };
            }
            var res = yield this.httpclient.request({
                method: this.requestOptions.method,
                url: this.requestOptions.url,
                data: joinedData,
                headers: this.requestOptions.headers ? this.requestOptions.headers : {},
                params: this.requestOptions.params ? this.requestOptions.params : {},
            });
            const resJSON = yield JSON.parse(res.data);
            const continuationCommand = helpers_1.default.recursiveSearchForKey("continuationCommand", resJSON)[0];
            if (continuationCommand)
                this.continuationToken = continuationCommand.token;
            else
                this.endReached = true;
            let items = yield this.dataprocessor(resJSON);
            items = helpers_1.default.processRendererItems(items, this.httpclient);
            this.results = this.results.concat(items);
            return items;
        });
    }
}
exports.ContinuatedList = ContinuatedList;
