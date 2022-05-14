import { CONSOLE_COLORS, DEBUG, DEFAULT_API_KEY, DEFAULT_CLIENT_NAME, DEFAULT_CLIENT_VERSION, DEFAULT_CONTEXT, DEFAULT_USER_AGENT } from "./constants";
import { HTTPClient, HTTPMap, HTTPRequestOptions } from "./interfaces/HTTPClient";

export class WrappedHTTPClient {
    client : HTTPClient;
    headers : HTTPMap;
    authorizationHeaderCallback?: Function;
    cookieString = "";

    constructor(client : HTTPClient) {
        this.client = client;
        this.headers = new Object();
    }

    async request(options : HTTPRequestOptions) {
        //If there are no Headers or Parameters, add an empty array
        if(!options.params) options.params = new Object();
        if(!options.headers) options.headers = new Object();

        //Add Headers
        options.headers["x-youtube-client-version"] = DEFAULT_CLIENT_VERSION;
        options.headers["x-youtube-client-name"] = DEFAULT_CLIENT_NAME;
        options.headers["user-agent"] = DEFAULT_USER_AGENT;
        options.headers["cookie"] = this.cookieString;
        options.headers = {...options.headers, ...this.headers};

        //Set Authorization Headers or Key
        if(this.authorizationHeaderCallback) options.headers["Authorization"] = await this.authorizationHeaderCallback();
        else options.params["key"] = DEFAULT_API_KEY;

        //Create URL String with Parameters
        const finalURL = new URL(options.url);
        if(options.params) 
            for(const [key, value] of Object.entries(options.params) as any)
                finalURL.searchParams.set(key, value.toString());
        options.url = finalURL.toString();

        //Add Default Context to Body
        if(typeof options.data == 'object') options.data.context = {... DEFAULT_CONTEXT, ...options.data.context};

        //Convert the passed Object Body to JSON String Body
        if(typeof options.data != 'string') {
            options.data = JSON.stringify(options.data);
            options.headers["Content-Type"] = "application/json";
        }
      
        //Request using the HTTPClient
        if(DEBUG) console.log(CONSOLE_COLORS.fg.cyan + "[WHTTPCLIENT] Requesting Data from Endpoint: " + options.url.toString(), CONSOLE_COLORS.reset);
        var res = await this.client.request(options);
        if(DEBUG) console.log(CONSOLE_COLORS.fg.cyan + "[WHTTPCLIENT] Got respone with Code: " + res.status, CONSOLE_COLORS.reset);

        //Parse Recieved Cookies and save them
        if(res.headers["set-cookie"]) {
            var newCookies = parseCookies(res.headers["set-cookie"]);
            if(DEBUG) console.log(CONSOLE_COLORS.fg.magenta + "[WHTTPCLIENT] Recieved new Cookies: " + Object.keys(newCookies).join(", "), CONSOLE_COLORS.reset);

            if(newCookies["CONSENT"]) {
                newCookies["CONSENT"] = "YES+cb.20210328-17-p0.en+FX+" + newCookies["CONSENT"].split("+")[1];
                if(DEBUG) console.log(CONSOLE_COLORS.bright + CONSOLE_COLORS.fg.green + "[WHTTPCLIENT] Accepted Consent and modified Cookie: " + newCookies["CONSENT"], CONSOLE_COLORS.reset);
            }
            this.cookieString = joinCookies(newCookies, this.cookieString);
        }

        //Detect if Youtube knows this is a dirty Client
        if(res.data.includes("STATE_TAG_BROWSE_INSTRUCTION_MARK_AS_DIRTY")) 
            if(DEBUG) console.warn(CONSOLE_COLORS.fg.yellow + "[WHTTPCLIENT] Youtube detected this as a dirty client!", CONSOLE_COLORS.reset);

        return res;
    }
}

var ignoreCookieData = ["expires", "path", "domain", "priority"]
function parseCookies(str : string) {
    const pairs = str.split(";");
    let pairArrays = pairs.map(v => v.split("="));
    pairArrays.forEach((obj:any) => obj[0] = obj[0].replaceAll(" ", ""));
    pairArrays = pairArrays.filter((obj:any) => { return obj[0].length > 0 && !ignoreCookieData.includes(obj[0])});

    const pairsObject:any = new Object();
    for(const pairArray of pairArrays) {
        pairsObject[pairArray[0]] = pairArray[1];
    }
    return pairsObject;
}

function serializeCookies(obj: any) {
    let cookieString = "";
    for(const [key, value] of Object.entries(obj) as any) {
        if(key != null && key.length > 0) {
            const partString = (key + "=" + (value ? value : '') + "; ");
            cookieString += partString;
        }
    }

    cookieString = cookieString.trimEnd();
    return cookieString;
}

function joinCookies(str1: string | any, str2: string | any) {
    const resObj = {
        ... (typeof str1 == 'string' ? parseCookies(str1) : str1),
        ... (typeof str2 == 'string' ? parseCookies(str2) : str2)
    };
    const resString = serializeCookies(resObj);
    return resString;
}