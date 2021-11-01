var globalObj = {};

function getDomainFromUrl(url) {
    var host = "null";
    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}
function checkForValidUrl(tabId, changeInfo, tab) {
    if (changeInfo.status != 'complete')
    return;
    console.log(getDomainFromUrl(tab.url).toLowerCase())
    if (getDomainFromUrl(tab.url).toLowerCase() == "www.accupass.com" || getDomainFromUrl(tab.url).toLowerCase() == "www.ticket.com.tw" || getDomainFromUrl(tab.url).toLowerCase() == "member.eztravel.com.tw" || getDomainFromUrl(tab.url).toLowerCase() == "www.colatour.com.tw") {
        globalObj.url = getDomainFromUrl(tab.url).toLowerCase();
        chrome.pageAction.show(tabId);
    }
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.tabs.onActivated.addListener(function(activeInfo, tab) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, function(tab){
       if (getDomainFromUrl(tab.url).toLowerCase() == "www.accupass.com" || getDomainFromUrl(tab.url).toLowerCase() == "www.ticket.com.tw" || getDomainFromUrl(tab.url).toLowerCase() == "member.eztravel.com.tw" || getDomainFromUrl(tab.url).toLowerCase() == "www.colatour.com.tw") {
            globalObj.url = getDomainFromUrl(tab.url).toLowerCase();
            chrome.pageAction.show(tabId);
        }
    });
});

// This function is called onload in the popup code
function getPageDetails(callback) {
    chrome.tabs.onUpdated.addListener(checkForValidUrl);
    // Inject the content script into the current page
    //chrome.tabs.executeScript(null, { file: './js/content_scripts.js' });
    switch (globalObj.url) {
        case "www.accupass.com":
            var codeRes = "accupass";
            break;
        case "www.ticket.com.tw":
            var codeRes = "ticket";
            break;
        case "member.eztravel.com.tw":
            var codeRes = "eztravel";
            break;
        case "www.colatour.com.tw":
            var codeRes = "colatour";
            break;
        default:
            //code block
    }
    chrome.tabs.executeScript(null, { file: "./js/jquery-2.0.0.min.js" }, function() {
        //all injected
        chrome.tabs.executeScript(null, { code: "var config = {param1:'" + codeRes + "'};" }, function() {
            chrome.tabs.executeScript(null, { file: "./js/content_scripts.js" }, function() {
                //all injected
            });
        });
    });
    chrome.runtime.onMessage.addListener(function(message) {
        callback(message);
    });
};
