import { Channel } from "../interfaces/Channel";
import { Playlist } from "../interfaces/Playlist";
import { Video } from "../interfaces/Video";
import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { CONSOLE_COLORS } from "../constants";
import { Comment, CommentThread } from "../main";

function recursiveSearchForPair(searchKey: string, obj: any) {
    if(typeof obj != 'object') return [];

    let results = new Array();
    for(const [key, value] of Object.entries(obj)) {
        if(key == searchKey) results.push({key: key, value: value});
        results = results.concat(recursiveSearchForPair(searchKey, value));
    }

    return results;
}

function recursiveSearchForKey(searchKey: string, obj: any) {
    if(typeof obj != 'object') return [];

    let results = new Array();
    for(const [key, value] of Object.entries(obj)) {
        if(key == searchKey) results.push(value);
        results = results.concat(recursiveSearchForKey(searchKey, value));
    }

    return results;
}

function getNumberFromText(str: string):number {
    if(str == "No views") return 0;

    str = str.split(" ")[0];

    var number = 0.0;
    if(str.endsWith("M")) {
        number = parseFloat(replaceAll("M", "", str));
        number = number * 1000000;
    } else if(str.endsWith("K")) {
        number = parseFloat(replaceAll("K", "", str));
        number = number * 1000;
    } else {
        str = replaceAll(".", "", str);
        str = replaceAll(",", "", str);
        number = parseInt(str);
    }

    return number;
}

function replaceAll(regex:string, value: string, source:string) {
    while(source.includes(regex)) {
        source = source.replace(regex, value);
    }
    return source;
}

function processRendererItems(arr : Array<any>, httpclient: WrappedHTTPClient) {
    let processedList = arr.map((elem:any) => {
        /* Video */
        if(elem.videoRenderer) {
            var video = new Video(httpclient);
            video.fromVideoRenderer(elem.videoRenderer);
            return video;
        } else if (elem.gridVideoRenderer) {
            var video = new Video(httpclient);
            video.fromGridRenderer(elem.gridVideoRenderer);
            return video;
        } else if (elem.playlistVideoRenderer) {
            var video = new Video(httpclient);
            video.fromPlaylistVideoRenderer(elem.playlistVideoRenderer);
            return video;
        }

        /* Channel */
        else if (elem.channelRenderer) {
            var channel = new Channel(httpclient);
            channel.fromChannelRenderer(elem.channelRenderer);
            return channel;
        } else if(elem.gridChannelRenderer) {
            var channel = new Channel(httpclient);
            channel.fromGridChannelRenderer(elem.gridChannelRenderer);
            return channel;
        }

        /* Comments */
        else if(elem.commentThreadRenderer) {
            var commentThread = new CommentThread(httpclient);
            commentThread.fromCommentThreadRenderer(elem.commentThreadRenderer)
            return commentThread;
        } else if(elem.commentRenderer) {
            var comment = new Comment(httpclient);
            comment.fromCommentRenderer(elem.commentRenderer);
            return comment;
        }
        
        /* Playlist */
        else if(elem.playlistRenderer) {
            var playlist = new Playlist(httpclient);
            playlist.fromPlaylistRenderer(elem.playlistRenderer);
            return playlist;
        }

        else if(elem.gridPlaylistRenderer) {
            var playlist = new Playlist(httpclient);
            playlist.fromGridPlaylistRenderer(elem.gridPlaylistRenderer);
            return playlist;
        }

        /* Ignored */
        else if(elem.continuationItemRenderer || elem.shelfRenderer) {
            return undefined;
        }

        /* Unknown */
        else {
            console.warn(CONSOLE_COLORS.fg.yellow + "[IYOUTUBE] Failed to Process Item with Type(s): " + Object.keys(elem), CONSOLE_COLORS.reset);
            return undefined;
        }
    });
    processedList = processedList.filter((a:any) => { return a != undefined;});
    return processedList;
}

export function getVideoDefaultThumbnail(videoId:string) {
    return {
        url: "https://i.ytimg.com/vi/" + videoId + "/maxresdefault.jpg",
        height: 1,
        width: 1
    }
}
export default {
    recursiveSearchForPair: recursiveSearchForPair,
    recursiveSearchForKey: recursiveSearchForKey,
    getNumberFromText: getNumberFromText,
    processRendererItems: processRendererItems,
    getVideoDefaultThumbnail: getVideoDefaultThumbnail,
}