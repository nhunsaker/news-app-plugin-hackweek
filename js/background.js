var com = {'buzzfeed':{'newsAppPlugin':{ toggle:false, model:{} }}};

chrome.browserAction.onClicked.addListener(function(tab) {
    com.buzzfeed.newsAppPlugin.toggle = !com.buzzfeed.newsAppPlugin.toggle;
    if(com.buzzfeed.newsAppPlugin.toggle){
        chrome.browserAction.setIcon({path: "img/icon16-on.png", tabId:tab.id});
        com.buzzfeed.newsAppPlugin.activate();
    } else{
        com.buzzfeed.newsAppPlugin.deactivate();
    }
});

com.buzzfeed.newsAppPlugin.activate = function(){
    chrome.tabs.getSelected(null,function(tab) {
        var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
        if (!location.ancestorOrigins.contains(extensionOrigin)) {
            chrome.tabs.executeScript(tab.id, {file: "js/inject.js"});
        }
        setTimeout(function(){
            chrome.tabs.sendMessage(tab.id, {action: "init", url: tab.url});
        }, 200);
    });
};

com.buzzfeed.newsAppPlugin.deactivate = function(){
    chrome.tabs.getSelected(null,function(tab) {
        com.buzzfeed.newsAppPlugin.toggle = false;
        chrome.browserAction.setIcon({path: "img/icon16.png", tabId:tab.id});
        chrome.tabs.executeScript(tab.id, {file: "js/remove.js"});
    });
};

chrome.runtime.onMessage.addListener(function(options, sender, sendResponse) {
    chrome.tabs.getSelected(null,function(tab) {
        if (options.hasOwnProperty('action') && options.action == 'activateEdit'){
            chrome.tabs.executeScript(tab.id, {file: "js/activateEdit.js"}, function() {
                chrome.tabs.sendMessage(tab.id, {action:"editElement", data:options.data});
            });
        } else if (options.hasOwnProperty('action') && options.action == 'updateData'){
            chrome.tabs.executeScript(tab.id, {file: "js/removeEdit.js"});
            chrome.tabs.sendMessage(tab.id, {action:'update', data:options.data});
        } else if (options.hasOwnProperty('action') && options.action == 'close'){
            com.buzzfeed.newsAppPlugin.deactivate();
        } else if (options.hasOwnProperty('action') && options.action == 'save'){
            if (options.hasOwnProperty('data')){
                com.buzzfeed.newsAppPlugin.model = options.data;
            }
            com.buzzfeed.newsAppPlugin.save();
        }
    });
});

com.buzzfeed.newsAppPlugin.contextMenuAction = function(element, event){
    chrome.tabs.getSelected(null,function(tab) {
        if (event.hasOwnProperty('selectionText')){
            chrome.tabs.sendMessage(tab.id, {action:"define", element:element, value:event.selectionText});
        } else if (event.hasOwnProperty('srcUrl')){
            chrome.tabs.sendMessage(tab.id, {action:"define", element:element, value:event.srcUrl});
        }
    });
};


com.buzzfeed.newsAppPlugin.createContextMenu = function(){
    var parentMenu = chrome.contextMenus.create({
        "title": "News App",
        "contexts": ["page", "selection", "image", "link"]
    });
    chrome.contextMenus.create({
        "title": "Module: Headline",
        "parentId": parentMenu,
        "contexts": ["page", "selection", "image", "link"],
        "onclick" : function(e) {
            com.buzzfeed.newsAppPlugin.contextMenuAction('headline', e)
        }
    });
    chrome.contextMenus.create({
        "title": "Module: Body",
        "parentId": parentMenu,
        "contexts": ["page", "selection", "image", "link"],
        "onclick" : function(e) {
            com.buzzfeed.newsAppPlugin.contextMenuAction('body', e)
        }
    });
    chrome.contextMenus.create({
        "title": "Module: Image",
        "parentId": parentMenu,
        "contexts": ["page", "selection", "image", "link"],
        "onclick" : function(e) {
            com.buzzfeed.newsAppPlugin.contextMenuAction('headline_image_url', e)
        }
    });
    chrome.contextMenus.create({
        "title": "Module: Image Credit",
        "parentId": parentMenu,
        "contexts": ["page", "selection", "image", "link"],
        "onclick" : function(e) {
            com.buzzfeed.newsAppPlugin.contextMenuAction('image_credit', e)
        }
    });
    chrome.contextMenus.create({
        "title": "Module: Image Caption",
        "parentId": parentMenu,
        "contexts": ["page", "selection", "image", "link"],
        "onclick" : function(e) {
            com.buzzfeed.newsAppPlugin.contextMenuAction('image_caption', e)
        }
    });
    chrome.contextMenus.create({
        "title": "Module: Timestamp",
        "parentId": parentMenu,
        "contexts": ["page", "selection", "image", "link"],
        "onclick" : function(e) {
            com.buzzfeed.newsAppPlugin.contextMenuAction('created', e)
        }
    });
    chrome.contextMenus.create({
        "title": "Module: Anchor",
        "parentId": parentMenu,
        "contexts": ["page", "selection", "image", "link"],
        "onclick" : function(e) {
            com.buzzfeed.newsAppPlugin.contextMenuAction('anchor', e)
        }
    });
    chrome.contextMenus.create({
        "title": "Module: Tags",
        "parentId": parentMenu,
        "contexts": ["page", "selection", "image", "link"],
        "onclick" : function(e) {
            com.buzzfeed.newsAppPlugin.contextMenuAction('tags', e)
        }
    });
}

com.buzzfeed.newsAppPlugin.createContextMenu();


com.buzzfeed.newsAppPlugin.save = function(){
    chrome.tabs.create({url : 'http://{{SERVER_URL}}/cms/'}, function(tab) {
        setTimeout(function(){
            chrome.tabs.executeScript(tab.id, {file: 'js/save.js'}, function(){
                var model = com.buzzfeed.newsAppPlugin.model;
                chrome.tabs.sendMessage(tab.id, {action: "transfer", data: model});
            });
        }, 200);
    });
}


