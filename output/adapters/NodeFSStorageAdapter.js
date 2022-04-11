"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFSStorageAdapater = void 0;
const fs = require("fs");
const path = require("path");
class NodeFSStorageAdapater {
    constructor(basePath) {
        this.basePath = basePath;
        fs.mkdirSync(basePath, { recursive: true });
    }
    set(paths, value) {
        try {
            fs.writeFileSync(path.join(this.basePath, paths), value, { encoding: 'utf-8' });
            return true;
        }
        catch (err) {
            return false;
        }
    }
    get(paths) {
        return fs.readFileSync(path.join(this.basePath, paths), { encoding: 'utf-8' }).toString();
    }
    exists(paths) {
        return fs.existsSync(path.join(this.basePath, paths));
    }
}
exports.NodeFSStorageAdapater = NodeFSStorageAdapater;
