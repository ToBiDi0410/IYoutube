import { Channel } from "../interfaces/Channel";
import { Playlist } from "../interfaces/Playlist";
import { Video } from "../interfaces/Video";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { Comment, CommentThread } from "../main";
declare function recursiveSearchForPair(searchKey: string, obj: any): any[];
declare function recursiveSearchForKey(searchKey: string, obj: any): any[];
declare function getNumberFromText(str: string): number;
declare function processRendererItems(arr: Array<any>, httpclient: WrappedHTTPClient): (Video | Channel | Playlist | Comment | CommentThread | undefined)[];
export declare function getVideoDefaultThumbnail(videoId: string): {
    url: string;
    height: number;
    width: number;
};
declare const _default: {
    recursiveSearchForPair: typeof recursiveSearchForPair;
    recursiveSearchForKey: typeof recursiveSearchForKey;
    getNumberFromText: typeof getNumberFromText;
    processRendererItems: typeof processRendererItems;
    getVideoDefaultThumbnail: typeof getVideoDefaultThumbnail;
};
export default _default;
