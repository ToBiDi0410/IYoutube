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
exports.NodeFetchClientAdapter = void 0;
const fetch = require("node-fetch");
class NodeFetchClientAdapter {
    request(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var res = yield fetch(options.url, {
                headers: options.headers,
                method: options.method,
                body: options.data,
            });
            const refactoredHeaders = new Object();
            for (var pair of res.headers.entries()) {
                refactoredHeaders[pair[0]] = pair[1];
            }
            return {
                status: res.status,
                data: yield res.text(),
                headers: refactoredHeaders
            };
        });
    }
}
exports.NodeFetchClientAdapter = NodeFetchClientAdapter;
