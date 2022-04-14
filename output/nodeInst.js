"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeFetchClientAdapter_1 = require("./adapters/NodeFetchClientAdapter");
const NodeFSStorageAdapter_1 = require("./adapters/NodeFSStorageAdapter");
const path = require("path");
const main_1 = require("./main");
exports.default = new main_1.IYoutube(new NodeFetchClientAdapter_1.NodeFetchClientAdapter(), new NodeFSStorageAdapter_1.NodeFSStorageAdapater(path.resolve(__dirname, "../datastorage")));
