"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENDPOINT_COMMENT_CREATE = exports.ENDPOINT_PLAYER = exports.ENDPOINT_COMMENT_ACTION = exports.ENDPOINT_NEXT = exports.ENDPOINT_ADDTOPLAYLIST = exports.ENDPOINT_UNSUBSCRIBE = exports.ENDPOINT_SUBSCRIBE = exports.ENDPOINT_REMOVELIKE = exports.ENDPOINT_DISLIKE = exports.ENDPOINT_LIKE = exports.ENDPOINT_SEARCH = exports.ENDPOINT_BROWSE = exports.CONSOLE_COLORS = exports.DEFAULT_CONTEXT = exports.DEFAULT_USER_AGENT = exports.DEFAULT_CLIENT_NAME = exports.DEFAULT_CLIENT_VERSION = exports.DEFAULT_API_KEY = exports.DEBUG = void 0;
exports.DEBUG = false;
exports.DEFAULT_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
exports.DEFAULT_CLIENT_VERSION = "2.20220406.09.00";
exports.DEFAULT_CLIENT_NAME = "1";
exports.DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36";
exports.DEFAULT_CONTEXT = {
    client: {
        clientName: "WEB",
        clientVersion: exports.DEFAULT_CLIENT_VERSION,
        hl: "en",
        gl: "DE",
        userAgent: exports.DEFAULT_USER_AGENT,
        utcOffsetMinutes: "0"
    },
    request: {
        useSsl: "true",
        internalExperimentFlags: [],
        consistencyTokenJars: [],
    }
};
exports.CONSOLE_COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m"
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};
exports.ENDPOINT_BROWSE = "https://www.youtube.com/youtubei/v1/browse";
exports.ENDPOINT_SEARCH = "https://www.youtube.com/youtubei/v1/search";
exports.ENDPOINT_LIKE = "https://www.youtube.com/youtubei/v1/like/like";
exports.ENDPOINT_DISLIKE = "https://www.youtube.com/youtubei/v1/like/dislike";
exports.ENDPOINT_REMOVELIKE = "https://www.youtube.com/youtubei/v1/like/removelike";
exports.ENDPOINT_SUBSCRIBE = "https://www.youtube.com/youtubei/v1/subscription/subscribe";
exports.ENDPOINT_UNSUBSCRIBE = "https://www.youtube.com/youtubei/v1/subscription/unsubscribe";
exports.ENDPOINT_ADDTOPLAYLIST = "https://www.youtube.com/youtubei/v1/playlist/get_add_to_playlist";
exports.ENDPOINT_NEXT = "https://www.youtube.com/youtubei/v1/next";
exports.ENDPOINT_COMMENT_ACTION = "https://www.youtube.com/youtubei/v1/comment/perform_comment_action";
exports.ENDPOINT_PLAYER = "https://www.youtube.com/youtubei/v1/player";
exports.ENDPOINT_COMMENT_CREATE = "https://www.youtube.com/youtubei/v1/comment/create_comment";
