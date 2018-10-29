var accesstoken = "145243009455737|SJzWMGrgPvuiMwZ6iJ23TWgOIBI"
var fbgroupid="NMSSGENT";
function loadFB(callback) {
    $.ajaxSetup({ cache: true });
    $.getScript('https://connect.facebook.net/be_nl/sdk.js', function () {
        FB.init({
            appId: '145243009455737',
            version: 'v2.11' // or v2.1, v2.2, v2.3, ...
        });
        console.log("FB loaded");
        callback();
    });

}