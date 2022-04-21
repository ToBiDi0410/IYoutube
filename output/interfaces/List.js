"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const main_1 = require("../main");
class List {
    constructor(array) {
        if (array) {
            this.results = array;
        }
        else {
            this.results = new Array();
        }
    }
    getByType(type) {
        return this.results.filter((elem) => { return elem instanceof type; });
    }
    getVideos() {
        return this.getByType(main_1.Video);
    }
    getPlaylists() {
        return this.getByType(main_1.Playlist);
    }
    getChannels() {
        return this.getByType(main_1.Channel);
    }
    getComments() {
        return this.getByType(main_1.Comment);
    }
    getCommentThreads() {
        return this.getByType(main_1.CommentThread);
    }
}
exports.List = List;
