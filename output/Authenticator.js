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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Authenticator_token;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticator = void 0;
const constants_1 = require("./constants");
const HTTPClient_1 = require("./interfaces/HTTPClient");
const CLIENT_ID = "861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com";
const CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT";
class Authenticator {
    constructor(httpclient, storage) {
        _Authenticator_token.set(this, {
            access: "NULL",
            refresh: "NULL",
            type: "NULL",
            expireDate: new Date()
        });
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
                    __classPrivateFieldSet(this, _Authenticator_token, JSON.parse(str), "f");
                    if (constants_1.DEBUG)
                        console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.green + "[AUTHENTICATOR] Now using Token from Storage (expires: " + new Date(__classPrivateFieldGet(this, _Authenticator_token, "f").expireDate).toLocaleString() + ")", constants_1.CONSOLE_COLORS.reset);
                }
            }
        });
    }
    requiresLogin() {
        return Object.values(__classPrivateFieldGet(this, _Authenticator_token, "f")).includes("NULL");
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
            __classPrivateFieldSet(this, _Authenticator_token, { type: null, access: null, refresh: res.refresh_token, expireDate: null }, "f");
            if (constants_1.DEBUG)
                console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.yellow + "[AUTHENTICATOR] Authentication Method successfull: Device Code", constants_1.CONSOLE_COLORS.reset);
            yield this.getToken();
        });
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _Authenticator_token, "f").access == null || (Date.now() - __classPrivateFieldGet(this, _Authenticator_token, "f").expireDate) > 0) {
                let res = yield this.httpClient.request({
                    method: HTTPClient_1.HTTPRequestMethod.POST,
                    url: "https://oauth2.googleapis.com/token",
                    data: JSON.stringify({
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                        grant_type: "refresh_token",
                        refresh_token: __classPrivateFieldGet(this, _Authenticator_token, "f").refresh
                    })
                });
                res = JSON.parse(res.data);
                __classPrivateFieldSet(this, _Authenticator_token, { type: res.token_type, access: res.access_token, refresh: __classPrivateFieldGet(this, _Authenticator_token, "f").refresh, expireDate: (new Date().getTime() + 1000 * res.expires_in) }, "f");
                if (constants_1.DEBUG)
                    console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.green + "[AUTHENTICATOR] Refreshed the Access Token using the refresh Token", constants_1.CONSOLE_COLORS.reset);
                yield this.storageAdapter.set(TOKEN_FILE, JSON.stringify(Object.assign({}, __classPrivateFieldGet(this, _Authenticator_token, "f"))));
                if (constants_1.DEBUG)
                    console.log(constants_1.CONSOLE_COLORS.bright + constants_1.CONSOLE_COLORS.fg.yellow + "[AUTHENTICATOR] Current Token written to Storage", constants_1.CONSOLE_COLORS.reset);
            }
            return __classPrivateFieldGet(this, _Authenticator_token, "f");
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
_Authenticator_token = new WeakMap();
const TOKEN_FILE = "IYoutubeTokens.json";
