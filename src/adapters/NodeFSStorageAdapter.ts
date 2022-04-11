import { StorageAdapter } from "../interfaces/StorageAdapter";
import * as fs from 'fs';
import * as path from 'path';
/**
 * An Adapter for the Node FS Api, so that it can be used as Storage Adapter with
 * the IYoutube Client
 */
export class NodeFSStorageAdapater implements StorageAdapter {

    basePath : string;

    constructor(basePath:string) {
        this.basePath = basePath;
        fs.mkdirSync(basePath, { recursive: true });
    }

    set(paths: string, value: string): boolean {
        try {
            fs.writeFileSync(path.join(this.basePath, paths), value, { encoding: 'utf-8' });
            return true;
        } catch (err) {
            return false;
        }
    }

    get(paths: string): string {
        return fs.readFileSync(path.join(this.basePath, paths), { encoding: 'utf-8' }).toString();
    }

    exists(paths: string): boolean {
        return fs.existsSync(path.join(this.basePath, paths));
    }
    
}