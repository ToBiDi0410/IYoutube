import { NodeFetchClientAdapter } from "./adapters/NodeFetchClientAdapter";
import { NodeFSStorageAdapater } from "./adapters/NodeFSStorageAdapter";

//Default Export for most NodeJS
import * as path from 'path';
import { IYoutube } from "./main";

export default new IYoutube(new NodeFetchClientAdapter(), new NodeFSStorageAdapater(path.resolve(__dirname, "../datastorage")));