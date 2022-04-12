"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Channel_instances, _Channel_parseC4FromHeader, _Channel_parseOwnerBadges, _Channel_cleanup;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const constants_1 = require("../constants");
const helpers_1 = require("../fetchers/helpers");
const HTTPClient_1 = require("./HTTPClient");
const main_1 = require("../main");
class Channel {
    constructor(httpclient) {
        _Channel_instances.add(this);
        this.httpclient = httpclient;
    }
    fromVideoRenderer(obj) {
        const ownerTextContainer = helpers_1.default.recursiveSearchForKey("ownerText", obj)[0];
        if (ownerTextContainer) {
            this.title = helpers_1.default.recursiveSearchForKey("text", ownerTextContainer)[0];
            this.channelId = helpers_1.default.recursiveSearchForKey("browseId", ownerTextContainer)[0];
        }
        const ownerBadgeContainer = helpers_1.default.recursiveSearchForKey("ownerBadges", obj);
        __classPrivateFieldGet(this, _Channel_instances, "m", _Channel_parseOwnerBadges).call(this, ownerBadgeContainer);
        const ownerThumbnailContainer = helpers_1.default.recursiveSearchForKey("channelThumbnailWithLinkRenderer", obj)[0];
        if (ownerThumbnailContainer) {
            this.thumbnails = helpers_1.default.recursiveSearchForKey("thumbnails", ownerThumbnailContainer)[0];
        }
        __classPrivateFieldGet(this, _Channel_instances, "m", _Channel_cleanup);
    }
    fromChannelRenderer(obj) {
        this.channelId = helpers_1.default.recursiveSearchForKey("channelId", obj)[0];
        const titleContainer = helpers_1.default.recursiveSearchForKey("title", obj)[0];
        if (titleContainer)
            this.title = helpers_1.default.recursiveSearchForKey("simpleText", titleContainer)[0];
        const thumbnailContainer = helpers_1.default.recursiveSearchForKey("thumbnail", obj)[0];
        if (thumbnailContainer) {
            this.thumbnails = helpers_1.default.recursiveSearchForKey("thumbnails", thumbnailContainer)[0];
        }
        const descriptionContainer = helpers_1.default.recursiveSearchForKey("descriptionSnippet", obj)[0];
        if (descriptionContainer)
            this.shortDescription = helpers_1.default.recursiveSearchForKey("text", descriptionContainer).join("");
        const videoCountContainer = helpers_1.default.recursiveSearchForKey("videoCountText", obj)[0];
        if (videoCountContainer)
            this.videoCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("text", videoCountContainer).join(""));
        const subscriberCountContainer = helpers_1.default.recursiveSearchForKey("subscriberCountText", obj)[0];
        if (subscriberCountContainer)
            this.subscriberCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("simpleText", subscriberCountContainer)[0]);
        const ownerBadgeContainer = helpers_1.default.recursiveSearchForKey("ownerBadges", obj);
        __classPrivateFieldGet(this, _Channel_instances, "m", _Channel_parseOwnerBadges).call(this, ownerBadgeContainer);
        this.subscribed = helpers_1.default.recursiveSearchForKey("subscribed", obj)[0];
        __classPrivateFieldGet(this, _Channel_instances, "m", _Channel_cleanup).call(this);
    }
    fromGridVideoRenderer(obj) {
        const shortBylineText = helpers_1.default.recursiveSearchForKey("shortBylineText", obj)[0];
        if (shortBylineText) {
            this.title = helpers_1.default.recursiveSearchForKey("text", shortBylineText)[0];
            this.channelId = helpers_1.default.recursiveSearchForKey("browseId", shortBylineText)[0];
        }
        const ownerBadgeContainer = helpers_1.default.recursiveSearchForKey("ownerBadges", obj);
        if (ownerBadgeContainer.length > 0) {
            const badgeRenderers = helpers_1.default.recursiveSearchForKey("metadataBadgeRenderer", ownerBadgeContainer);
            if (badgeRenderers.length > 0) {
                this.badges = new Array();
                for (const badgeRenderer of badgeRenderers) {
                    this.badges.push({
                        name: helpers_1.default.recursiveSearchForKey("label", badgeRenderer)[0],
                        icon: helpers_1.default.recursiveSearchForKey("iconType", badgeRenderer)[0],
                    });
                }
            }
        }
    }
    fromPlaylistRenderer(obj) {
        this.fromGridVideoRenderer(obj);
    }
    fromVideoOwnerRenderer(obj) {
        const browseEndpoint = helpers_1.default.recursiveSearchForKey("browseEndpoint", obj)[0];
        if (browseEndpoint)
            this.channelId = helpers_1.default.recursiveSearchForKey("browseId", browseEndpoint).join("");
        const titleContainer = helpers_1.default.recursiveSearchForKey("title", obj);
        if (titleContainer)
            this.title = helpers_1.default.recursiveSearchForKey("text", titleContainer).join("");
        const thumbnailContainer = helpers_1.default.recursiveSearchForKey("thumbnails", obj)[0];
        if (thumbnailContainer)
            this.thumbnails = thumbnailContainer;
    }
    fromPlaylistVideoRendererBylineText(obj) {
        this.title = helpers_1.default.recursiveSearchForKey("text", obj).join("");
        this.channelId = helpers_1.default.recursiveSearchForKey("browseId", obj).join("");
    }
    fromGridChannelRenderer(obj) {
        this.channelId = helpers_1.default.recursiveSearchForKey("channelId", obj).join("");
        this.subscribed = helpers_1.default.recursiveSearchForKey("subscribed", obj)[0];
        const titleContainer = helpers_1.default.recursiveSearchForKey("title", obj)[0];
        if (titleContainer) {
            this.title = helpers_1.default.recursiveSearchForKey("simpleText", titleContainer).join("");
        }
        const thumbnailContainer = helpers_1.default.recursiveSearchForKey("thumbnails", obj)[0];
        if (thumbnailContainer) {
            this.thumbnails = thumbnailContainer;
        }
    }
    loadAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadDetailsFromAboutPage();
            yield this.loadDetailsFromChannelsPages();
        });
    }
    loadDetailsFromAboutPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const channelAbout = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_BROWSE,
                data: {
                    browseId: this.channelId,
                    params: channelBrowseType.DETAILS
                }
            });
            const aboutJSON = yield JSON.parse(channelAbout.data);
            __classPrivateFieldGet(this, _Channel_instances, "m", _Channel_parseC4FromHeader).call(this, aboutJSON);
            const aboutRenderer = helpers_1.default.recursiveSearchForKey("channelAboutFullMetadataRenderer", aboutJSON);
            const descriptionContainer = helpers_1.default.recursiveSearchForKey("description", aboutRenderer)[0];
            if (descriptionContainer)
                this.description = helpers_1.default.recursiveSearchForKey("simpleText", descriptionContainer).join("");
            const countryContainer = helpers_1.default.recursiveSearchForKey("country", aboutRenderer)[0];
            if (countryContainer)
                this.country = helpers_1.default.recursiveSearchForKey("simpleText", countryContainer).join("");
            const joinDateContainer = helpers_1.default.recursiveSearchForKey("joinedDateText", aboutRenderer)[0];
            if (joinDateContainer) {
                const dateParts = helpers_1.default.recursiveSearchForKey("text", joinDateContainer).join("").split(" ");
                dateParts.shift();
                this.joinDate = new Date(dateParts.join(", "));
            }
            const viewCountContainer = helpers_1.default.recursiveSearchForKey("viewCountText", aboutRenderer)[0];
            if (viewCountContainer)
                this.viewCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("simpleText", viewCountContainer).join(""));
            const links = helpers_1.default.recursiveSearchForKey("primaryLinks", aboutRenderer)[0];
            if (links) {
                this.channelLinks = links.map((link) => {
                    var linkObj = {
                        title: helpers_1.default.recursiveSearchForKey("simpleText", link).join(""),
                        url: helpers_1.default.recursiveSearchForKey("url", helpers_1.default.recursiveSearchForKey("navigationEndpoint", link)[0])[0],
                        thumbnails: helpers_1.default.recursiveSearchForKey("thumbnails", link)[0]
                    };
                    if (linkObj.url && linkObj.url.startsWith("https://www.youtube.com/redirect?")) {
                        linkObj.url = new URL(linkObj.url).searchParams.get("q");
                    }
                    return linkObj;
                });
            }
        });
    }
    loadDetailsFromChannelsPages() {
        return __awaiter(this, void 0, void 0, function* () {
            const channelChannels = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_BROWSE,
                data: {
                    browseId: this.channelId,
                    params: channelBrowseType.CHANNELS
                }
            });
            const channelsJSON = yield JSON.parse(channelChannels.data);
            __classPrivateFieldGet(this, _Channel_instances, "m", _Channel_parseC4FromHeader).call(this, channelsJSON);
            let channelsTabRenderer = helpers_1.default.recursiveSearchForKey("tabRenderer", channelsJSON);
            channelsTabRenderer = channelsTabRenderer.find((a) => a.title.toLowerCase() == "channels");
            let channelItems = helpers_1.default.recursiveSearchForKey("items", channelsTabRenderer);
            if (channelItems.length > 0) {
                channelItems = channelItems.flat(1);
                this.otherChannels = helpers_1.default.processRendererItems(channelItems, this.httpclient);
            }
        });
    }
    getUploadList() {
        return new main_1.ContinuatedList({
            method: HTTPClient_1.HTTPRequestMethod.POST,
            url: constants_1.ENDPOINT_BROWSE,
            data: {
                browseId: this.channelId,
                params: channelBrowseType.VIDEOS
            }
        }, (data) => {
            let videosTabRenderer = helpers_1.default.recursiveSearchForKey("tabRenderer", data);
            videosTabRenderer = videosTabRenderer.find((a) => a.title.toLowerCase() == "videos");
            if (videosTabRenderer) {
                const gridRendererContainer = helpers_1.default.recursiveSearchForKey("gridRenderer", videosTabRenderer)[0];
                if (gridRendererContainer) {
                    const items = helpers_1.default.recursiveSearchForKey("items", gridRendererContainer)[0];
                    return items;
                }
            }
            else {
                return helpers_1.default.recursiveSearchForKey("continuationItems", data)[0];
            }
        }, this.httpclient, true);
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_SUBSCRIBE,
                params: {
                    prettyPrint: false
                },
                data: {
                    channelIds: [this.channelId],
                    params: "EgIIAhgA"
                }
            });
            const resJSON = yield JSON.parse(res.data);
            return res.status == 200;
        });
    }
    unsubscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpclient.request({
                method: HTTPClient_1.HTTPRequestMethod.POST,
                url: constants_1.ENDPOINT_UNSUBSCRIBE,
                params: {
                    prettyPrint: false
                },
                data: {
                    channelIds: [this.channelId],
                    params: "CgIIAhgA"
                }
            });
            const resJSON = yield JSON.parse(res.data);
            return res.status == 200;
        });
    }
}
exports.Channel = Channel;
_Channel_instances = new WeakSet(), _Channel_parseC4FromHeader = function _Channel_parseC4FromHeader(obj) {
    const headerContainer = helpers_1.default.recursiveSearchForKey("c4TabbedHeaderRenderer", obj)[0];
    if (headerContainer) {
        this.title = headerContainer.title;
        this.subscribed = helpers_1.default.recursiveSearchForKey("subscribed", headerContainer)[0];
        __classPrivateFieldGet(this, _Channel_instances, "m", _Channel_parseOwnerBadges).call(this, helpers_1.default.recursiveSearchForKey("badges", headerContainer));
        const subscriberCountContainer = helpers_1.default.recursiveSearchForKey("subscriberCountText", headerContainer)[0];
        if (subscriberCountContainer)
            this.subscriberCount = helpers_1.default.getNumberFromText(helpers_1.default.recursiveSearchForKey("simpleText", subscriberCountContainer).join(""));
        this.thumbnails = helpers_1.default.recursiveSearchForKey("thumbnails", headerContainer.avatar)[0];
        this.banners = helpers_1.default.recursiveSearchForKey("thumbnails", headerContainer.banner)[0];
        this.mobileBanners = helpers_1.default.recursiveSearchForKey("thumbnails", headerContainer.mobileBanner)[0];
        this.tvBanners = helpers_1.default.recursiveSearchForKey("thumbnails", headerContainer.tvBanner)[0];
    }
}, _Channel_parseOwnerBadges = function _Channel_parseOwnerBadges(ownerBadgeContainer) {
    if (ownerBadgeContainer.length > 0) {
        const badgeRenderers = helpers_1.default.recursiveSearchForKey("metadataBadgeRenderer", ownerBadgeContainer);
        if (badgeRenderers.length > 0) {
            this.badges = badgeRenderers.map((badgeRenderer) => ({
                name: helpers_1.default.recursiveSearchForKey("label", badgeRenderer)[0],
                icon: helpers_1.default.recursiveSearchForKey("iconType", badgeRenderer)[0],
            }));
        }
    }
}, _Channel_cleanup = function _Channel_cleanup() {
    if (this.thumbnails)
        this.thumbnails.forEach((a) => {
            if (a.url.startsWith("//"))
                a.url = "https:" + a.url;
        });
};
var channelBrowseType;
(function (channelBrowseType) {
    channelBrowseType["DETAILS"] = "EgVhYm91dA%3D%3D";
    channelBrowseType["CHANNELS"] = "EghjaGFubmVscw%3D%3D";
    channelBrowseType["VIDEOS"] = "EgZ2aWRlb3M%3D";
})(channelBrowseType || (channelBrowseType = {}));
