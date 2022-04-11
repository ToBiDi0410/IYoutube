export interface StorageAdapter {
    set(path: string, value: string): boolean;
    get(path: string): string;
    exists(path: string): boolean;
}
