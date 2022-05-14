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
exports.decipher = void 0;
const helpers_1 = require("./fetchers/helpers");
const HTTPClient_1 = require("./interfaces/HTTPClient");
const REGEXES = [
    new RegExp("(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)" + "\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*\"\"\\s*\\)"),
    new RegExp("\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\)"),
    new RegExp("\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)"),
    new RegExp("([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(\"\"\\)\\s*;"),
    new RegExp("\\b([\\w$]{2,})\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(\"\"\\)\\s*;"),
    new RegExp("\\bc\\s*&&\\s*d\\.set\\([^,]+\\s*,\\s*(:encodeURIComponent\\s*\\()([a-zA-Z0-9$]+)\\(")
];
function decipher(formats, playerURL, httpClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const playerResults = yield httpClient.request({
            method: HTTPClient_1.HTTPRequestMethod.GET,
            url: playerURL
        });
        const playerJS = playerResults.data;
        let deobfuscateFunctionName = "";
        for (const reg of REGEXES) {
            deobfuscateFunctionName = matchGroup1(reg, playerJS);
            if (deobfuscateFunctionName) {
                break;
            }
        }
        const functionPattern = new RegExp("(" + deobfuscateFunctionName.replace("$", "\\$") + "=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})");
        const deobfuscateFunction = "var " + matchGroup1(functionPattern, playerJS) + ";";
        const helperObjectName = matchGroup1(new RegExp(";([A-Za-z0-9_\\$]{2})\\...\\("), deobfuscateFunction);
        const helperPattern = new RegExp("(var " + helperObjectName + "=\\{.+?\\}\\};)");
        const helperObject = matchGroup1(helperPattern, helpers_1.default.replaceAll("\n", "", playerJS));
        const finalFunc = eval(`(function getDecipherFunction() {
    ` + helperObject + `
    ` + deobfuscateFunction + `

    return (val) => ` + deobfuscateFunctionName + `;
  })()`)();
        for (const format of formats) {
            if (format.signatureCipher) {
                const signatureParams = parseQuery(format.signatureCipher);
                const resolvedSignature = finalFunc(signatureParams.s);
                const finalURL = new URL(signatureParams.url);
                finalURL.searchParams.set(signatureParams.sp, resolvedSignature);
                format.url = finalURL.toString();
            }
        }
        return formats;
    });
}
exports.decipher = decipher;
function matchGroup1(regex, str) {
    const res = regex.exec(str);
    if (!res)
        return "";
    return res[1];
}
function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}
