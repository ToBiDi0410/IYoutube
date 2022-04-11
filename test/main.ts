import { NodeFSStorageAdapater } from './NodeFSStorageAdapter';
import { NodeFetchClientAdapter } from './NodeFetchClientAdapter';
import { SearchType } from '../src/fetchers/SearchContinuatedList';
import IYoutube from '../src/main';

(async function() {
    var httpClient = new NodeFetchClientAdapter();
    var storageAdapater = new NodeFSStorageAdapater("./test/");

    var ytClient = new IYoutube(httpClient, storageAdapater);
    await ytClient.init();

    var search = await ytClient.search("Rock reviews", SearchType.ANY);
    console.log(search.results.length);

    var testPlaylist = await ytClient.getPlaylist("PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj");
    console.log(testPlaylist.title, testPlaylist.lastEditText);
    await testPlaylist.loadAll();
    console.log(testPlaylist.description);

    var testPlaylistVideos = testPlaylist.getContinuatedList();
    await testPlaylistVideos.loadFurhter();
    console.log(testPlaylistVideos.results.length);

    
    //await testPlaylist.loadAll();
    //console.log(testPlaylist.thumbnails);
    
    /*var subscriptionFeed = ytClient.getUser().getSubscriptionFeed();
    await subscriptionFeed.loadFurhter();
    console.log(subscriptionFeed.results.length);*/

    /*var explorer = ytClient.getExplorer();
    var trends = await explorer.getTrendsNow();
    console.log(trends.length);*/
})();