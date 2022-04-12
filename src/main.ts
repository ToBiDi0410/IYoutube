import { NodeFetchClientAdapter } from "./adapters/NodeFetchClientAdapter";
import { NodeFSStorageAdapater } from "./adapters/NodeFSStorageAdapter";
import { Explorer } from "./fetchers/Explorer";
import { ContinuatedList } from "./fetchers/ContinuatedList";
import { User } from "./fetchers/User";
import { Authenticator } from "./Authenticator";
import { Channel } from "./interfaces/Channel";
import { Video } from "./interfaces/Video";
import { Playlist } from "./interfaces/Playlist";
import { Thumbnail } from "./interfaces/Thumbnail";
import { ChannelBadge } from "./interfaces/ChannelBadge";
import { HTTPClient } from "./interfaces/HTTPClient";
import { StorageAdapter } from "./interfaces/StorageAdapter";
import { CommentSectionContinuatedList } from "./fetchers/CommentSectionContinuatedList";
import { Comment } from "./interfaces/Comment";
import { CommentThread } from "./interfaces/CommentThread";
import { WrappedHTTPClient } from "./WrappedHTTPClient";
import { CommentThreadRepliesContinuatedList } from "./fetchers/CommentThreadRepliesContinuatedList";
import { default as IYoutube } from "./Iyoutube";


export { IYoutube as IYoutube }
export { NodeFSStorageAdapater as NodeFSStorageAdapater }
export { NodeFetchClientAdapter as NodeFetchClientAdapter } 
export { HTTPClient as HTTPClient }
export { StorageAdapter as StorageAdapter }
export { WrappedHTTPClient as WrappedHTTPClient }

export { Explorer as Explorer }
export { User as User }
export { ContinuatedList as ContinuatedList }

export { Authenticator as Authenticator }
export { Channel as Channel }
export { Video as Video }
export { Playlist as Playlist }
export { Thumbnail as Thumbnail }
export { ChannelBadge as ChannelBadge }
export { CommentSectionContinuatedList as CommentSectionContinuatedList }
export { Comment as Comment }
export { CommentThread as CommentThread }
export { CommentThreadRepliesContinuatedList as CommentThreadRepliesContinuatedList }

//Default Export for most NodeJS
import * as path from 'path';
export const nodeInst = new IYoutube(new NodeFetchClientAdapter() , new NodeFSStorageAdapater(path.resolve(__dirname, "../datastorage")));