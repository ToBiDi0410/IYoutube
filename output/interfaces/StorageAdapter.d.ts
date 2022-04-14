export interface StorageAdapter {
    set(path: string, value: string): Promise<boolean>;
    get(path: string): Promise<string>;
    exists(path: string): Promise<boolean>;
}
