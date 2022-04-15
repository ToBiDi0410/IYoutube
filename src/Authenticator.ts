import { CONSOLE_COLORS, DEBUG } from "./constants";
import { HTTPClient, HTTPRequestMethod } from "./interfaces/HTTPClient";
import { StorageAdapter } from "./interfaces/StorageAdapter";

// Extracted from Youtube APP (Originally from: pytube)
const CLIENT_ID = "861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com";
const CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT";

export class Authenticator {
    httpClient : HTTPClient;
    storageAdapter : StorageAdapter;

    token:any = {
        access: "NULL",
        refresh: "NULL",
        type: "NULL",
        expireDate: new Date()
    };

    constructor(httpclient : HTTPClient, storage : StorageAdapter) {
        this.httpClient = httpclient;
        this.storageAdapter = storage;
    }

    async init() {
        if(DEBUG) console.log(CONSOLE_COLORS.fg.cyan + "[AUTHENTICATOR] Initializing Authenticator...", CONSOLE_COLORS.reset);

        if((await this.storageAdapter.exists(TOKEN_FILE))) {
            if(DEBUG) console.log(CONSOLE_COLORS.fg.magenta + "[AUTHENTICATOR] Found Token File in Storage, reading it...", CONSOLE_COLORS.reset);
            var str = await this.storageAdapter.get(TOKEN_FILE);
            if(str) {
                this.token = JSON.parse(str);
                if(DEBUG) console.log(CONSOLE_COLORS.bright + CONSOLE_COLORS.fg.green + "[AUTHENTICATOR] Now using Token from Storage (expires: " + new Date(this.token.expireDate).toLocaleString() + ")", CONSOLE_COLORS.reset);
            }
        }
    }

    requiresLogin() {
        return Object.values(this.token).includes("NULL");
    }

    async getNewLoginCode() {
        const res = await this.httpClient.request({
            url: "https://oauth2.googleapis.com/device/code",
            method: HTTPRequestMethod.POST,
            data: JSON.stringify({
                client_id: CLIENT_ID,
                scope: "https://www.googleapis.com/auth/youtube"
            }),
            headers: {}
        });
        if(res.status != 200) throw new Error("Failed to get new Google Login Code");

        const resJSON:any = JSON.parse(res.data);
        if(DEBUG) console.log(CONSOLE_COLORS.bright + CONSOLE_COLORS.fg.yellow + "[AUTHENTICATOR] Started Authentication Method: Device Code", CONSOLE_COLORS.reset);
        return { userCode: resJSON.user_code, deviceCode: resJSON.device_code, userUrl: resJSON.verification_url, expiresIn: resJSON.expires_in, interval: 5 };
    }

    async loadTokensWithDeviceCode(deviceCode: string) {
        var res:any;
        while(!res || !res.refresh_token) {
            res = await this.httpClient.request({
                method: HTTPRequestMethod.POST,
                url: "https://oauth2.googleapis.com/token",
                data: JSON.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    device_code: deviceCode,
                    grant_type: "urn:ietf:params:oauth:grant-type:device_code"
                })
            });
            res = JSON.parse(res.data);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        this.token = { type: null, access: null, refresh: res.refresh_token, expireDate: null };
        if(DEBUG) console.log(CONSOLE_COLORS.bright + CONSOLE_COLORS.fg.yellow + "[AUTHENTICATOR] Authentication Method successfull: Device Code", CONSOLE_COLORS.reset);
        await this.getToken();
    }

    async getToken() {
        if(this.token.access == null || (Date.now() - this.token.expireDate) > 0) {
            let res:any = await this.httpClient.request({
                method: HTTPRequestMethod.POST,
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
            if(DEBUG) console.log(CONSOLE_COLORS.bright + CONSOLE_COLORS.fg.green + "[AUTHENTICATOR] Refreshed the Access Token using the refresh Token", CONSOLE_COLORS.reset);
            await this.storageAdapter.set(TOKEN_FILE, JSON.stringify({...this.token }));
            if(DEBUG) console.log(CONSOLE_COLORS.bright + CONSOLE_COLORS.fg.yellow + "[AUTHENTICATOR] Current Token written to Storage", CONSOLE_COLORS.reset);
        }
        return this.token;
    }

    async getAuthorizationHeader() {
        var currentToken:any = await this.getToken();
        return currentToken.type + " " + currentToken.access;
    }
}

const TOKEN_FILE = "IYoutubeTokens.json";

//Data needs to be strigified because we are working with the raw HTTPClient, not the WrappedHTTPClient