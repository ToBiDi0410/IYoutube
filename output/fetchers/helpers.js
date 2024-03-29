"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Channel_1 = require("../interfaces/Channel");
const Playlist_1 = require("../interfaces/Playlist");
const Video_1 = require("../interfaces/Video");
const constants_1 = require("../constants");
const main_1 = require("../main");
function recursiveSearchForPair(searchKey, obj) {
    if (typeof obj != 'object')
        return [];
    let results = new Array();
    for (const [key, value] of Object.entries(obj)) {
        if (key == searchKey)
            results.push({ key: key, value: value });
        results = results.concat(recursiveSearchForPair(searchKey, value));
    }
    return results;
}
function recursiveSearchForKey(searchKey, obj) {
    if (typeof obj != 'object')
        return [];
    let results = new Array();
    for (const [key, value] of Object.entries(obj)) {
        if (key == searchKey)
            results.push(value);
        results = results.concat(recursiveSearchForKey(searchKey, value));
    }
    return results;
}
function getNumberFromText(str) {
    if (str == "No views")
        return 0;
    str = str.split(" ")[0];
    var number = 0.0;
    if (str.endsWith("M")) {
        number = parseFloat(replaceAll("M", "", str));
        number = number * 1000000;
    }
    else if (str.endsWith("K")) {
        number = parseFloat(replaceAll("K", "", str));
        number = number * 1000;
    }
    else {
        str = replaceAll(".", "", str);
        str = replaceAll(",", "", str);
        number = parseInt(str);
    }
    return number;
}
function replaceAll(search, value, source) {
    return source.replace(new RegExp(escapeRegExp(search), 'g'), value);
}
function processRendererItems(arr, httpclient) {
    let processedList = arr.map((elem) => {
        if (elem.videoRenderer) {
            var video = new Video_1.Video(httpclient);
            video.fromVideoRenderer(elem.videoRenderer);
            return video;
        }
        else if (elem.gridVideoRenderer) {
            var video = new Video_1.Video(httpclient);
            video.fromGridRenderer(elem.gridVideoRenderer);
            return video;
        }
        else if (elem.playlistVideoRenderer) {
            var video = new Video_1.Video(httpclient);
            video.fromPlaylistVideoRenderer(elem.playlistVideoRenderer);
            return video;
        }
        else if (elem.channelRenderer) {
            var channel = new Channel_1.Channel(httpclient);
            channel.fromChannelRenderer(elem.channelRenderer);
            return channel;
        }
        else if (elem.gridChannelRenderer) {
            var channel = new Channel_1.Channel(httpclient);
            channel.fromGridChannelRenderer(elem.gridChannelRenderer);
            return channel;
        }
        else if (elem.commentThreadRenderer) {
            var commentThread = new main_1.CommentThread(httpclient);
            commentThread.fromCommentThreadRenderer(elem.commentThreadRenderer);
            return commentThread;
        }
        else if (elem.commentRenderer) {
            var comment = new main_1.Comment(httpclient);
            comment.fromCommentRenderer(elem.commentRenderer);
            return comment;
        }
        else if (elem.playlistRenderer) {
            var playlist = new Playlist_1.Playlist(httpclient);
            playlist.fromPlaylistRenderer(elem.playlistRenderer);
            return playlist;
        }
        else if (elem.gridPlaylistRenderer) {
            var playlist = new Playlist_1.Playlist(httpclient);
            playlist.fromGridPlaylistRenderer(elem.gridPlaylistRenderer);
            return playlist;
        }
        else if (elem.continuationItemRenderer || elem.shelfRenderer) {
            return undefined;
        }
        else {
            console.warn(constants_1.CONSOLE_COLORS.fg.yellow + "[IYOUTUBE] Failed to Process Item with Type(s): " + Object.keys(elem), constants_1.CONSOLE_COLORS.reset);
            return undefined;
        }
    });
    processedList = processedList.filter((a) => { return a != undefined; });
    return processedList;
}
function getVideoDefaultThumbnail(videoId) {
    return {
        url: "https://i.ytimg.com/vi/" + videoId + "/maxresdefault.jpg",
        height: 1,
        width: 1
    };
}
function getIndexBefore(str, index, source) {
    var before = source.substring(0, index);
    return before.lastIndexOf(str);
}
function getIndexAfter(str, index, source) {
    var after = source.substring(index, source.length);
    return index + after.indexOf(str);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.default = {
    recursiveSearchForPair,
    recursiveSearchForKey,
    getNumberFromText,
    processRendererItems,
    getVideoDefaultThumbnail,
    replaceAll,
    getIndexAfter,
    getIndexBefore
};
