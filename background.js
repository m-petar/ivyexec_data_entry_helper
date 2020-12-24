let ip;

(async function loadIP() {
  let response = await fetch("https://api.ipify.org/?format=json");
  console.log(response.status);
  if (response.status == 200) {
    let responseText = await response.text();
    ip = JSON.parse(responseText).ip;
    console.log(ip);
  }
})();

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.body.newValue == undefined) {
    chrome.browserAction.setIcon({ path: "images/ivyIconGreen16.png" });
  } else {
    chrome.browserAction.setIcon({ path: "images/ivyIconGreenBg16.png" });
  }
  // lists all changes in storage:
  // for (var key in changes) {
  //  var storageChange = changes[key];
  //  console.log(
  //    'Storage key "%s" in namespace "%s" changed. ' +
  //      'Old value was "%s", new value is "%s".',
  //    key,
  //    namespace,
  //    storageChange.oldValue,
  //    storageChange.newValue
  // );
  // }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  //console.log("Received %o from %o, frame", request, sender.tab, sender.frameId);
  
  if (request.tabAuth == "Is_IP_authorized?") { // currently takes no action other than logging, since main method has been commented out
    if (ip == "" || ip == "") {
      sendResponse({ tabAuthResponse: "IP Authorized" });
    } else {
      sendResponse({ tabAuthResponse: "Not Authorized!" });
      //chrome.tabs.remove(sender.tab.id); // immediately closes any tab that is being opened if client IP has not been authorized
    }
  }

  if (request.setBadge == "cityOrText") {
    chrome.browserAction.setBadgeText({ text: "C/T" });
    sendResponse({ farewell: "Badge added - cityOrText" });
  }
  if (request.setBadge == "title") {
    chrome.browserAction.setBadgeText({ text: "Title" });
    sendResponse({ farewell: "Badge added - title" });
  }
  if (request.setBadge == "city") {
    chrome.browserAction.setBadgeText({ text: "City" });
    sendResponse({ farewell: "Badge added - city" });
  }
  if (request.setBadge == "text") {
    chrome.browserAction.setBadgeText({ text: "Text" });
    sendResponse({ farewell: "Badge added - text" });
  }
  if (request.reloadExtension == "reload") {
    //chrome.runtime.reload(); // reloads extension itself
    chrome.tabs.reload(sender.tab.id); // reload active tab
    sendResponse({ farewell: "Tab reloaded" });
  }
});

let contextMenuItem = {
  id: "Ivy",
  title: "Ivy - Paste Data (F2)",
  "documentUrlPatterns": [ "https://www.ivyexec.com/employers/jobs/add"],
  "onclick": returnMessage  // event listener with callback
  //contexts: ["selection"] // enabled only when something is selected 
};

chrome.contextMenus.create(contextMenuItem);

function returnMessage() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { // this way only the currently active tab is taken into account
    chrome.tabs.sendMessage(tabs[0].id, {pasteForm: "OK"}); //  which is reffered to at index tabs[0] and message object is sent to ID of that active tab
  });
}


