import { HTTPClient } from './main';
export declare class CiphService {
    httpClient: HTTPClient;
    constructor(httpClient: HTTPClient);
    cache: Map<any, any>;
    getTokens(html5playerfile: any, options: any): Promise<string[]>;
    extractActions(body: any): string[] | null;
    decipherFormats(formats: any, html5player: any, options: any): Promise<any>;
    decipher: (tokens: any, sig: any) => any;
    setDownloadURL(format: any, sig: any): void;
}
