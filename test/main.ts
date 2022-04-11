import { NodeFSStorageAdapater } from './NodeFSStorageAdapter';
import { NodeFetchClientAdapter } from './NodeFetchClientAdapter';
import { SearchType } from '../src/fetchers/SearchContinuatedList';
import IYoutube from '../src/main';

(async function() {
    //Construct the two default Adapters 
    var httpClient = new NodeFetchClientAdapter();
    var storageAdapater = new NodeFSStorageAdapater("./test/"); //Using the Test Folder as Base Directory

    //Construct the IYoutube API with the two Adapters and Init it
    var ytClient = new IYoutube(httpClient, storageAdapater);
    await ytClient.init();

    //Check if there need to be a user Login
    if(ytClient.authenticator.requiresLogin()) {
        //Aquire a new Device and Login Code
        var codes = await ytClient.authenticator.getNewLoginCode();
        console.log("User Code: " + codes.userCode);
        
        /*❗Enter the User Code at https://google.com/device and Login
        This will resolve the loadTokensWithDeviceCode Promise and you are now authenticated */
    
        await ytClient.authenticator.loadTokensWithDeviceCode(codes.deviceCode);
        /* The Authenticator will save it's tokens in IYoutubeTokens.json */
    }

    //Do the API Calls
    var search = await ytClient.search("Rock reviews", SearchType.ANY); //Get Continuated List for Search 'Rock reviews'
    await search.loadFurhter(); //Load first 17-20 Results from List
    console.log(search.results.length);
    await search.loadFurhter(); //Load further 17-20 Results from List

    var testPlaylist = await ytClient.getPlaylist("PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj");
    await testPlaylist.loadAll(); //Fill out all Information about the Playlist
    console.log(testPlaylist.title, testPlaylist.lastEditText);
    console.log(testPlaylist.description);

    var testPlaylistVideos = testPlaylist.getContinuatedList(); //Get the Playlists Videos as Continuated List
    await search.loadFurhter(); //Load first 17-20 Results from List
    console.log(testPlaylistVideos.results.length); //Print out the Results length
})();