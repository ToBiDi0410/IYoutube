import { StorageAdapter } from "../interfaces/StorageAdapter";
export declare class NodeFSStorageAdapater implements StorageAdapter {
    basePath: string;
    constructor(basePath: string);
    set(paths: string, value: string): boolean;
    get(paths: string): string;
    exists(paths: string): boolean;
}
