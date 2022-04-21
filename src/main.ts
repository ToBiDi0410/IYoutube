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
import { CaptionTrack } from "./interfaces/CaptionTrack";
import { List } from "./interfaces/List";
import { default as IYoutube } from "./IYoutube";


export { IYoutube as IYoutube }
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
export { CaptionTrack as CaptionTrack }
export { List as List }

//Skips Webpack checks
export const nodeDefault = async ():Promise<IYoutube> => {
    const path = "./nodeDefault";
    const res = await import(path);
    return res.default;
}