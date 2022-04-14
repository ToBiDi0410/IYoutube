"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                fs.writeFileSync(path.join(this.basePath, paths), value, { encoding: 'utf-8' });
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    get(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            return fs.readFileSync(path.join(this.basePath, paths), { encoding: 'utf-8' }).toString();
        });
    }
    exists(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            return fs.existsSync(path.join(this.basePath, paths));
        });
    }
}
exports.NodeFSStorageAdapater = NodeFSStorageAdapater;
