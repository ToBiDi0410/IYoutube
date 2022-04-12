import helpers from "../fetchers/helpers";
import { WrappedHTTPClient, Comment, CommentThreadRepliesContinuatedList } from "../main"

export class CommentThread {
    httpclient: WrappedHTTPClient;

    comment?: Comment
    replieList?: CommentThreadRepliesContinuatedList;

    constructor(httpclient: WrappedHTTPClient) {
        this.httpclient = httpclient;
    }

    fromCommentThreadRenderer(obj: any) {
        this.comment = new Comment(this.httpclient);
        this.comment.fromCommentRenderer(obj.comment);

        const repliesRenderer = obj.replies;
        if(repliesRenderer) {
            this.replieList = new CommentThreadRepliesContinuatedList(helpers.recursiveSearchForKey("token", repliesRenderer).join(""), this.httpclient);
        }
    }
}

"Eg0SC3d0OXk2djdGTkFZGAYyfhpLEhpVZ3hIdzdpTU1RTXhsWGZTRHVGNEFhQUJBZyICCAAqGFVDWHVxU0JsSEFFNlh3LXllSkEwVHVudzILd3Q5eTZ2N0ZOQVlAAUgKQi9jb21tZW50LXJlcGxpZXMtaXRlbS1VZ3hIdzdpTU1RTXhsWGZTRHVGNEFhQUJBZw%3D%3D"
"Eg0SC3d0OXk2djdGTkFZGAYyswIKsAFHQUl5WGdvOElQYnYzT0hKd19jQ01qRVF0TnlGczdXZTdRSVlfX19fX19fX19fOV9JQUVvQlRBS09oWTVSMVkyYW5GbmQxVklNemxIVmpkVE1WSlZZeTF6RWg0SUJSSWFWV2Q0U0hjM2FVMU5VVTE0YkZobVUwUjFSalJCWVVGQ1FXYzZJQWdCRWh3MU9sVm5lRWgzTjJsTlRWRk5lR3hZWmxORWRVWTBRV0ZCUWtGbhpLEhpVZ3hIdzdpTU1RTXhsWGZTRHVGNEFhQUJBZyICCAAqGFVDWHVxU0JsSEFFNlh3LXllSkEwVHVudzILd3Q5eTZ2N0ZOQVlAAUgyKApCL2NvbW1lbnQtcmVwbGllcy1pdGVtLVVneEh3N2lNTVFNeGxYZlNEdUY0QWFBQkFn"