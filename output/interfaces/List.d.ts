import { Video, Channel, Playlist, Comment, CommentThread } from "../main";
export declare class List {
    results: Array<Video | Channel | Playlist | Comment | CommentThread>;
    constructor(array?: Array<any>);
    getByType(type: any): (Video | Channel | Playlist | Comment | CommentThread)[];
    getVideos(): Array<Video>;
    getPlaylists(): Array<Playlist>;
    getChannels(): Array<Channel>;
    getComments(): Array<Comment>;
    getCommentThreads(): Array<CommentThread>;
}
