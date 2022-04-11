import { WrappedHTTPClient } from "../WrappedHTTPClient";
import { ContinuatedList } from "./ContinuatedList";
export declare class SearchConitinuatedList extends ContinuatedList {
    constructor(term: string, searchType: SearchType, httpclient: WrappedHTTPClient);
}
export declare enum SearchType {
    VIDEO = "EgIQAQ%3D%3D",
    CHANNEL = "EgIQAg%3D%3D",
    PLAYLIST = "EgIQAw%3D%3D",
    MOVIE = "EgIQBA%3D%3D",
    ANY = ""
}
