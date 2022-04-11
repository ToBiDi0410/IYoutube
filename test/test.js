const ytClient = require("../").nodeInst;

console.log("HEY!");

(async function() {
    await ytClient.init();
    if (ytClient.authenticator.requiresLogin()) {
        var codes = await ytClient.authenticator.getNewLoginCode();

        console.log("This program requires Login at: " + codes.userUrl);
        console.log("Use the following Code: " + codes.userCode);

        await ytClient.authenticator.loadTokensWithDeviceCode(codes.deviceCode);
        console.log("Thank you for login!");
    }

    var testPlaylist = await ytClient.getUser().getWatchLaterPlaylist();
    await testPlaylist.loadAll(); //Load all Details we can get
    console.log(testPlaylist.canLike);
})();