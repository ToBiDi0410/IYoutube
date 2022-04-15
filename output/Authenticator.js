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
exports.Authenticator = void 0;
const constants_1 = require("./constants");
const HTTPClient_1 = require("./interfaces/HTTPClient");
const CLIENT_ID = "861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com";
const CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT";
class Authenticator {
    constructor(httpclient, storage) {
        this.token = {
            access: "NULL",
            refresh: "NULL",
            type: "NULL",
            expireDate: new Date()
        };
        this.httpClient = httpclient;
        this.storageAdapter = storage;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (constants_1.DEBUG)
                console.log(constants_1.CONSOLE_COLORS.fg.cyan + "[AUTHENTICATOR] Initializing Authenticator...", constants_1.CONSOLE_COLORS.reset);
            if ((yield this.storageAdapter.exists(TOKEN_FILE))) {
                if (constants_1.DEBUG)
                    console.log(constants_1.CONSOLE_COLORS.fg.magenta + "[AUTHENTICATOR] Found Token File in Storage, reading it...", constants_1.CONSOLE_COLORS.reset);
                var str = yield this.storageAdapter.get(TOKEN_FILE);
                if (str) {
                    this.token = JSON.parse(str);
                    if (constants_1.DEBUG)
                        console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.green + "[AUTHENTICATOR] Now using Token from Storage (expires: " + new Date(this.token.expireDate).toLocaleString() + ")", constants_1.CONSOLE_COLORS.reset);
                }
            }
        });
    }
    requiresLogin() {
        return Object.values(this.token).includes("NULL");
    }
    getNewLoginCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpClient.request({
                url: "https://oauth2.googleapis.com/device/code",
                method: HTTPClient_1.HTTPRequestMethod.POST,
                data: JSON.stringify({
                    client_id: CLIENT_ID,
                    scope: "https://www.googleapis.com/auth/youtube"
                }),
                headers: {}
            });
            if (res.status != 200)
                throw new Error("Failed to get new Google Login Code");
            const resJSON = JSON.parse(res.data);
            if (constants_1.DEBUG)
                console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.yellow + "[AUTHENTICATOR] Started Authentication Method: Device Code", constants_1.CONSOLE_COLORS.reset);
            return { userCode: resJSON.user_code, deviceCode: resJSON.device_code, userUrl: resJSON.verification_url, expiresIn: resJSON.expires_in, interval: 5 };
        });
    }
    loadTokensWithDeviceCode(deviceCode) {
        return __awaiter(this, void 0, void 0, function* () {
            var res;
            while (!res || !res.refresh_token) {
                res = yield this.httpClient.request({
                    method: HTTPClient_1.HTTPRequestMethod.POST,
                    url: "https://oauth2.googleapis.com/token",
                    data: JSON.stringify({
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                        device_code: deviceCode,
                        grant_type: "urn:ietf:params:oauth:grant-type:device_code"
                    })
                });
                res = JSON.parse(res.data);
                yield new Promise(resolve => setTimeout(resolve, 5000));
            }
            this.token = { type: null, access: null, refresh: res.refresh_token, expireDate: null };
            if (constants_1.DEBUG)
                console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.yellow + "[AUTHENTICATOR] Authentication Method successfull: Device Code", constants_1.CONSOLE_COLORS.reset);
            yield this.getToken();
        });
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.token.access == null || (Date.now() - this.token.expireDate) > 0) {
                let res = yield this.httpClient.request({
                    method: HTTPClient_1.HTTPRequestMethod.POST,
                    url: "https://oauth2.googleapis.com/token",
                    data: JSON.stringify({
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                        grant_type: "refresh_token",
                        refresh_token: this.token.refresh
                    })
                });
                res = JSON.parse(res.data);
                this.token = { type: res.token_type, access: res.access_token, refresh: this.token.refresh, expireDate: (new Date().getTime() + 1000 * res.expires_in) };
                if (constants_1.DEBUG)
                    console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.green + "[AUTHENTICATOR] Refreshed the Access Token using the refresh Token", constants_1.CONSOLE_COLORS.reset);
                yield this.storageAdapter.set(TOKEN_FILE, JSON.stringify(Object.assign({}, this.token)));
                if (constants_1.DEBUG)
                    console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.yellow + "[AUTHENTICATOR] Current Token written to Storage", constants_1.CONSOLE_COLORS.reset);
            }
            return this.token;
        });
    }
    getAuthorizationHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            var currentToken = yield this.getToken();
            return currentToken.type + " " + currentToken.access;
        });
    }
}
exports.Authenticator = Authenticator;
const TOKEN_FILE = "IYoutubeTokens.json";
