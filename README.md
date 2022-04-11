## IYoutube

IYoutube is the ultimate dirty Youtube API Client covering the most Parts of the unofficial YoutubeI API.

#### Features
- Video Information (currently only from Search or Playlist)
- Playlist Support
- Like API (Videos & Playlists)
- Search with Filters
- Playlist Support
- User Authentication (allows private Videos)
- Support for most Platforms because of Adapters for HTTP Communication and Storage
- Typescript Types (for most things)


#### Usage

##### Adapters
In order to use this Libary you have to implement an Storage Adapter and an HTTPClient Adapter. These Adapters must implement the according interfaces ([StorageAdapter](./src/interfaces/StorageAdapter.ts) & [HTTPClient](./src/interfaces/HTTPClient.ts)). You can find two sample Adapters for the common Node Packages in the [Test Folder](./test/).

For most parts, this should be enough for use. So just include them like in the [Test File](./test/main.ts) and install the according Packages (node-fetch)

##### Authenticator
Currently, the entire Library requires you to be Authenticated. You can just use the Authenticator to create the needed Tokens. 

```js
var ytClient = YOUR_INSTANCE_OF_IYOUTUBE;
await ytClient.init();

//Check if there needs to be a relogin
if(ytClient.authenticator.requiresLogin()) {

    //Aquire a new Device and Login Code
    var codes = await ytClient.authenticator.getNewLoginCode();
    console.log("User Code: " + codes.userCode);

    /*❗Enter the User Code at https://google.com/device and Login
    This will resolve the loadTokensWithDeviceCode Promise and you are now authenticated */


    await ytClient.authenticator.loadTokensWithDeviceCode(codes.deviceCode);
    /* The Authenticator will save it's tokens in IYoutubeTokens.json */
}

//Do your calls to the API
```

##### Continuated List
```js
var list = await ytClient.search("test", SearchType.VIDEO);

//Load the next Results
list.loadFurther(); /* Returns the new Results */

//All Results
list.results

//End reached
list.endReached

```
Searches and Playlist Video Lists are using the Continuated List format. You have to load the next Results if you want to expand the list. You can also check if the list is at it's end

#### TODO
You can find the current TODO list [here](./todo.md)

#### Credits
- Authentication Method: https://github.com/pytube/pytube
- Consent Confirmation: https://github.com/ytdl-org/youtube-dl/
- Visual Studio Code for Development: https://code.visualstudio.com/
- Google for their API and Chrome Dev Tools to analyse it :)