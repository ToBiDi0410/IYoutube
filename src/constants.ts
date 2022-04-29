export const DEBUG = false;
export const DEFAULT_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
export const DEFAULT_CLIENT_VERSION = "2.20220406.09.00";
export const DEFAULT_CLIENT_NAME = "1";
export const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36";
export const DEFAULT_CONTEXT = {
    client: {
        clientName: "WEB",
        clientVersion: DEFAULT_CLIENT_VERSION,
        hl: "en",
        gl: "DE",
        userAgent: DEFAULT_USER_AGENT,
        utcOffsetMinutes: "0"
    },
    request: {
        useSsl: "true",
        internalExperimentFlags: [],
        consistencyTokenJars: [],
    }
}

export const CONSOLE_COLORS = {
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

/* Endpoints */
export const ENDPOINT_BROWSE = "https://www.youtube.com/youtubei/v1/browse";
export const ENDPOINT_SEARCH = "https://www.youtube.com/youtubei/v1/search";
export const ENDPOINT_LIKE = "https://www.youtube.com/youtubei/v1/like/like";
export const ENDPOINT_DISLIKE = "https://www.youtube.com/youtubei/v1/like/dislike";
export const ENDPOINT_REMOVELIKE = "https://www.youtube.com/youtubei/v1/like/removelike";
export const ENDPOINT_SUBSCRIBE = "https://www.youtube.com/youtubei/v1/subscription/subscribe";
export const ENDPOINT_UNSUBSCRIBE = "https://www.youtube.com/youtubei/v1/subscription/unsubscribe";
export const ENDPOINT_ADDTOPLAYLIST = "https://www.youtube.com/youtubei/v1/playlist/get_add_to_playlist";
export const ENDPOINT_NEXT = "https://www.youtube.com/youtubei/v1/next";
export const ENDPOINT_COMMENT_ACTION = "https://www.youtube.com/youtubei/v1/comment/perform_comment_action";
export const ENDPOINT_PLAYER = "https://www.youtube.com/youtubei/v1/player";
export const ENDPOINT_COMMENT_CREATE = "https://www.youtube.com/youtubei/v1/comment/create_comment";

/* Error */
export const ERROR_DATA_INVALID_FORMAT = new Error("The Data recieved from the Google API seems to have an invalid format. It might be that Google updated their APIs and this Method no longer Works");