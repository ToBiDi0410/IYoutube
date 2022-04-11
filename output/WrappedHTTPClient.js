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
exports.WrappedHTTPClient = void 0;
const constants_1 = require("./constants");
class WrappedHTTPClient {
    constructor(client) {
        this.cookieString = "";
        this.client = client;
        this.headers = new Object();
    }
    request(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.params)
                options.params = new Object();
            if (!options.headers)
                options.headers = new Object();
            options.headers["x-youtube-client-version"] = constants_1.DEFAULT_CLIENT_VERSION;
            options.headers["x-youtube-client-name"] = constants_1.DEFAULT_CLIENT_NAME;
            options.headers["user-agent"] = constants_1.DEFAULT_USER_AGENT;
            options.headers["cookie"] = this.cookieString;
            options.headers = Object.assign(Object.assign({}, options.headers), this.headers);
            if (this.authorizationHeaderCallback)
                options.headers["Authorization"] = yield this.authorizationHeaderCallback();
            else
                options.params["key"] = constants_1.DEFAULT_API_KEY;
            const finalURL = new URL(options.url);
            if (options.params)
                for (const [key, value] of Object.entries(options.params))
                    finalURL.searchParams.set(key, value.toString());
            options.url = finalURL.toString();
            if (typeof options.data == 'object')
                options.data.context = Object.assign(Object.assign({}, constants_1.DEFAULT_CONTEXT), options.data.context);
            if (typeof options.data != 'string') {
                options.data = JSON.stringify(options.data);
                options.headers["Content-Type"] = "application/json";
            }
            if (constants_1.DEBUG)
                console.log(constants_1.CONSOLE_COLORS.fg.cyan + "[WHTTPCLIENT] Requesting Data from Endpoint: " + options.url.toString(), constants_1.CONSOLE_COLORS.reset);
            var res = yield this.client.request(options);
            if (constants_1.DEBUG)
                console.log(constants_1.CONSOLE_COLORS.fg.cyan + "[WHTTPCLIENT] Got respone with Code: " + res.status, constants_1.CONSOLE_COLORS.reset);
            if (res.headers["set-cookie"]) {
                var newCookies = parseCookies(res.headers["set-cookie"]);
                if (constants_1.DEBUG)
                    console.log(constants_1.CONSOLE_COLORS.fg.magenta + "[WHTTPCLIENT] Recieved new Cookies: " + Object.keys(newCookies).join(", "), constants_1.CONSOLE_COLORS.reset);
                if (newCookies["CONSENT"]) {
                    newCookies["CONSENT"] = "YES+cb.20210328-17-p0.en+FX+" + newCookies["CONSENT"].split("+")[1];
                    if (constants_1.DEBUG)
                        console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.green + "[WHTTPCLIENT] Accepted Consent and modified Cookie: " + newCookies["CONSENT"], constants_1.CONSOLE_COLORS.reset);
                }
                this.cookieString = joinCookies(newCookies, this.cookieString);
            }
            if (res.data.includes("STATE_TAG_BROWSE_INSTRUCTION_MARK_AS_DIRTY"))
                if (constants_1.DEBUG)
                    console.warn(constants_1.CONSOLE_COLORS.fg.yellow + "[WHTTPCLIENT] Youtube detected this as a dirty client!", constants_1.CONSOLE_COLORS.reset);
            return res;
        });
    }
}
exports.WrappedHTTPClient = WrappedHTTPClient;
var ignoreCookieData = ["expires", "path", "domain", "priority"];
function parseCookies(str) {
    const pairs = str.split(";");
    let pairArrays = pairs.map(v => v.split("="));
    pairArrays.forEach((obj) => obj[0] = obj[0].replaceAll(" ", ""));
    pairArrays = pairArrays.filter((obj) => { return obj[0].length > 0 && !ignoreCookieData.includes(obj[0]); });
    const pairsObject = new Object();
    for (const pairArray of pairArrays) {
        pairsObject[pairArray[0]] = pairArray[1];
    }
    return pairsObject;
}
function serializeCookies(obj) {
    let cookieString = "";
    for (const [key, value] of Object.entries(obj)) {
        if (key != null && key.length > 0) {
            const partString = (key + "=" + (value ? value : '') + "; ");
            cookieString += partString;
        }
    }
    cookieString = cookieString.trimEnd();
    return cookieString;
}
function joinCookies(str1, str2) {
    const resObj = Object.assign(Object.assign({}, (typeof str1 == 'string' ? parseCookies(str1) : str1)), (typeof str2 == 'string' ? parseCookies(str2) : str2));
    const resString = serializeCookies(resObj);
    return resString;
}
