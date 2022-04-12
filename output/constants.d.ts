export declare const DEBUG = false;
export declare const DEFAULT_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
export declare const DEFAULT_CLIENT_VERSION = "2.20220406.09.00";
export declare const DEFAULT_CLIENT_NAME = "1";
export declare const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36";
export declare const DEFAULT_CONTEXT: {
    client: {
        clientName: string;
        clientVersion: string;
        hl: string;
        gl: string;
        userAgent: string;
        utcOffsetMinutes: string;
    };
    request: {
        useSsl: string;
        internalExperimentFlags: never[];
        consistencyTokenJars: never[];
    };
};
export declare const CONSOLE_COLORS: {
    reset: string;
    bright: string;
    dim: string;
    underscore: string;
    blink: string;
    reverse: string;
    hidden: string;
    fg: {
        black: string;
        red: string;
        green: string;
        yellow: string;
        blue: string;
        magenta: string;
        cyan: string;
        white: string;
        crimson: string;
    };
    bg: {
        black: string;
        red: string;
        green: string;
        yellow: string;
        blue: string;
        magenta: string;
        cyan: string;
        white: string;
        crimson: string;
    };
};
export declare const ENDPOINT_BROWSE = "https://www.youtube.com/youtubei/v1/browse";
export declare const ENDPOINT_SEARCH = "https://www.youtube.com/youtubei/v1/search";
export declare const ENDPOINT_LIKE = "https://www.youtube.com/youtubei/v1/like/like";
export declare const ENDPOINT_DISLIKE = "https://www.youtube.com/youtubei/v1/like/dislike";
export declare const ENDPOINT_REMOVELIKE = "https://www.youtube.com/youtubei/v1/like/removelike";
export declare const ENDPOINT_SUBSCRIBE = "https://www.youtube.com/youtubei/v1/subscription/subscribe";
export declare const ENDPOINT_UNSUBSCRIBE = "https://www.youtube.com/youtubei/v1/subscription/unsubscribe";
export declare const ENDPOINT_ADDTOPLAYLIST = "https://www.youtube.com/youtubei/v1/playlist/get_add_to_playlist";
export declare const ENDPOINT_NEXT = "https://www.youtube.com/youtubei/v1/next";
export declare const ENDPOINT_COMMENT_ACTION = "https://www.youtube.com/youtubei/v1/comment/perform_comment_action";
