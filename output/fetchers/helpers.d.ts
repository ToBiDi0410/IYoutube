import { Channel } from "../interfaces/Channel";
import { Playlist } from "../interfaces/Playlist";
import { Video } from "../interfaces/Video";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
declare function recursiveSearchForPair(searchKey: string, obj: any): any[];
declare function recursiveSearchForKey(searchKey: string, obj: any): any[];
declare function getNumberFromText(str: string): number;
declare function processRendererItems(arr: Array<any>, httpclient: WrappedHTTPClient): (Channel | Video | Playlist | undefined)[];
declare const _default: {
    recursiveSearchForPair: typeof recursiveSearchForPair;
    recursiveSearchForKey: typeof recursiveSearchForKey;
    getNumberFromText: typeof getNumberFromText;
    processRendererItems: typeof processRendererItems;
};
export default _default;
