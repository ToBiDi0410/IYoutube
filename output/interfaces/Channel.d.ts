import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { ChannelBadge } from "./ChannelBadge";
import { Thumbnail } from "./Thumbnail";
export declare class Channel {
    #private;
    channelId?: string;
    title?: string;
    shortDescription?: string;
    badges?: Array<ChannelBadge>;
    thumbnails?: Array<Thumbnail>;
    videoCount?: number;
    subscribed?: boolean;
    subscriberCount?: number;
    httpclient: WrappedHTTPClient;
    constructor(httpclient: WrappedHTTPClient);
    fromVideoRenderer(obj: any): void;
    fromChannelRenderer(obj: any): void;
    fromGridVideoRenderer(obj: any): void;
    fromPlaylistRenderer(obj: any): void;
    fromVideoOwnerRenderer(obj: any): void;
    fromPlaylistVideoRendererBylineText(obj: any): void;
    subscribe(): Promise<boolean>;
    unsubscribe(): Promise<boolean>;
}
