import { ContinuatedList, Thumbnail, ChannelBadge, WrappedHTTPClient } from "../main";
import { ChannelLink } from "./ChannelLink";
export declare class Channel {
    #private;
    channelId?: string;
    title?: string;
    description?: string;
    shortDescription?: string;
    badges?: Array<ChannelBadge>;
    thumbnails?: Array<Thumbnail>;
    banners?: Array<Thumbnail>;
    mobileBanners?: Array<Thumbnail>;
    tvBanners?: Array<Thumbnail>;
    videoCount?: number;
    subscribed?: boolean;
    subscriberCount?: number;
    country?: string;
    viewCount?: number;
    joinDate?: Date;
    channelLinks?: Array<ChannelLink>;
    otherChannels?: Array<Channel>;
    httpclient: WrappedHTTPClient;
    constructor(httpclient: WrappedHTTPClient);
    fromVideoRenderer(obj: any): void;
    fromChannelRenderer(obj: any): void;
    fromGridVideoRenderer(obj: any): void;
    fromPlaylistRenderer(obj: any): void;
    fromVideoOwnerRenderer(obj: any): void;
    fromPlaylistVideoRendererBylineText(obj: any): void;
    fromGridChannelRenderer(obj: any): void;
    fromCommentRenderer(obj: any): void;
    loadAll(): Promise<void>;
    loadDetailsFromAboutPage(): Promise<void>;
    loadDetailsFromChannelsPages(): Promise<void>;
    getUploadList(): ContinuatedList;
    subscribe(): Promise<boolean>;
    unsubscribe(): Promise<boolean>;
}
