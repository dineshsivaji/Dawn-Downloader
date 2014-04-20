
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   if(changeInfo.status=="complete") { 
       var url = tab.url;
       if(url == "https://www.facebook.com/" || url == "http://www.facebook.com/"){return;}
       chrome.tabs.sendMessage(tab.id,{greeting: "UPDATE"});
   }
});


/*
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.query({}, function(tabs) { 
       	for (var i = 0; i < tabs.length; i++) {
    		var code = 'window.location.reload();';
    		if(tabs[i].url.indexOf("facebook")>0){
    			chrome.tabs.executeScript(tabs[i].id, {code: code});	
    		}
    	}
       });
    }
});
*/


