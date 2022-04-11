import { HTTPClient } from "./interfaces/HTTPClient";
import { StorageAdapter } from "./interfaces/StorageAdapter";
export declare class Authenticator {
    #private;
    httpClient: HTTPClient;
    storageAdapter: StorageAdapter;
    constructor(httpclient: HTTPClient, storage: StorageAdapter);
    init(): Promise<void>;
    requiresLogin(): boolean;
    getNewLoginCode(): Promise<{
        userCode: any;
        deviceCode: any;
        userUrl: any;
        expiresIn: any;
        interval: number;
    }>;
    loadTokensWithDeviceCode(deviceCode: string): Promise<void>;
    getToken(): Promise<any>;
    getAuthorizationHeader(): Promise<string>;
}
