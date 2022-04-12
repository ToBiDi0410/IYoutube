//Import the nodeInst Export of IYoutube
//This export is already filled with an Storage Adapter and HTTPClient
//If you just want to use this Library generally with NodeJS you can ignore what this means
const ytClient = require("../").nodeInst;
// !IMPORTANT! You have to replace the ../ with IYoutube

(async function() {
    //Init the Client
    await ytClient.init();

    //Check if there needs to be User Login
    if (ytClient.authenticator.requiresLogin()) {
        //Get new Codes for Login
        var codes = await ytClient.authenticator.getNewLoginCode();

        //Display message with Code and URL for User Action
        console.log("This program requires Login at: " + codes.userUrl);
        console.log("Use the following Code: " + codes.userCode);

        //Load the Tokens with the Device Code (will wait until finished)
        await ytClient.authenticator.loadTokensWithDeviceCode(codes.deviceCode);
        console.log("Thank you for login!");
    }
    //We are now Authenticated and can get started

    var testPlaylist = await ytClient.getUser().getLikedPlaylist(); //Get the Watch Later Playlist
    await testPlaylist.loadAll(); //Load all Details we can get
    console.log(testPlaylist.videoCount);

    var testPlaylistVideos = testPlaylist.getContinuatedList(); //Get the Continuated List
    await testPlaylistVideos.loadFurhter(); //Load Batch of Videos into List
    console.log(testPlaylistVideos.getVideos().length);
    await testPlaylistVideos.loadFurhter(); //Load next Batch of Videos into List
    console.log(testPlaylistVideos.getVideos().length);
    console.log(testPlaylistVideos.endReached);

    //Dirty way of getting the Results (without any Type), use the Getters instead!
    console.log(testPlaylistVideos.results);

    // The Video Amount per Batch varies from List Type (e.g Playlist, Search) but also from Randomness of the Youtube API
    // Hint: loadFurther() returns the new Videos and adds them to the results at the same Time
})();