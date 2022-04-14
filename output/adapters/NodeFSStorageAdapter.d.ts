import { StorageAdapter } from "../interfaces/StorageAdapter";
export declare class NodeFSStorageAdapater implements StorageAdapter {
    basePath: string;
    constructor(basePath: string);
    set(paths: string, value: string): Promise<boolean>;
    get(paths: string): Promise<string>;
    exists(paths: string): Promise<boolean>;
}
