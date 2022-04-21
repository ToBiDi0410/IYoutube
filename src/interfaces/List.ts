import { Video, Channel, Playlist, Comment, CommentThread } from "../main";

export class List {
    results: Array<Video | Channel | Playlist | Comment | CommentThread>;

    constructor() {
        this.results = new Array();
    }

    getByType(type: any) {
        return this.results.filter((elem) => { return elem instanceof type });
    }

    getVideos():Array<Video> {
        return this.getByType(Video) as Array<Video>
    }

    getPlaylists():Array<Playlist> {
        return this.getByType(Playlist) as Array<Playlist>;
    }

    getChannels():Array<Channel> {
        return this.getByType(Channel) as Array<Channel>;
    }

    getComments():Array<Comment> {
        return this.getByType(Comment) as Array<Comment>;
    }

    getCommentThreads():Array<CommentThread> {
        return this.getByType(CommentThread) as Array<CommentThread>;
    }
}