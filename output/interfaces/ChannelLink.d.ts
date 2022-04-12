import { Thumbnail } from "../main";
export interface ChannelLink {
    url: string;
    title: string;
    thumbnails?: Array<Thumbnail>;
}
