import { Thumbnail } from "./Thumbnail";

export interface ChannelLink {
    url: string;
    title: string;
    thumbnails?: Array<Thumbnail>;
}