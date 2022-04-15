"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentThread = void 0;
const helpers_1 = require("../fetchers/helpers");
const main_1 = require("../main");
class CommentThread {
    constructor(httpclient) {
        this.httpclient = httpclient;
    }
    fromCommentThreadRenderer(obj) {
        this.comment = new main_1.Comment(this.httpclient);
        this.comment.fromCommentRenderer(obj.comment);
        const repliesRenderer = obj.replies;
        if (repliesRenderer) {
            this.replieList = new main_1.CommentThreadRepliesContinuatedList(helpers_1.default.recursiveSearchForKey("token", repliesRenderer).join(""), this.httpclient);
        }
    }
}
exports.CommentThread = CommentThread;
