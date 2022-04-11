import { HTTPClient, HTTPRequestOptions } from "../src/interfaces/HTTPClient";
const fetch = require("node-fetch");

/**
 * An Adapter for the Node-Fetch Client, so that it can be used as HTTPClient with
 * the IYoutube Client
 */
export class NodeFetchClientAdapter implements HTTPClient {

    async request(options:HTTPRequestOptions) {
        var res = await fetch(options.url, {
            headers: options.headers,
            method: options.method,
            body: options.data,
        });

        const refactoredHeaders:any = new Object();
        for (var pair of res.headers.entries() as any) {
            refactoredHeaders[pair[0]] = pair[1]
        }

        return {
            status: res.status,
            data: await res.text(),
            headers: refactoredHeaders
        };
    }
}