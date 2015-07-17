var com = {'buzzfeed':{'newsAppPlugin':{'elements':{},'observers':[],'data':{}}}};

com.buzzfeed.newsAppPlugin.highlight = function(el, text, id){
    if (!document.getElementById(id)){
        var results = document.evaluate("//"+el+"[contains(text(),'"+text+"')]", document.documentElement, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        // TO DO: refactor to match more than one instance of found text
        if (results.snapshotLength){
            var thisHeading = results.snapshotItem(0);
            thisHeading.setAttribute("id", id);
            var targetElement = document.getElementById(id);
            com.buzzfeed.newsAppPlugin.elements[id] = targetElement.innerHTML;
            var modifiedElement = targetElement.innerHTML.replace(text, "<div style='background-color:yellow;'><span class='editElement' contentEditable='true'>"+text+"</span></div>").toString();
            targetElement.innerHTML = modifiedElement;
            targetElement.removeAttribute("href");
            com.buzzfeed.newsAppPlugin.addObserver(id);
        }
    } else {
        var targetElement = document.getElementById(id);
        targetElement.innerHTML = com.buzzfeed.newsAppPlugin.elements[id];
        delete com.buzzfeed.newsAppPlugin.elements[id];
        com.buzzfeed.newsAppPlugin.removeObservers();
    }
};

com.buzzfeed.newsAppPlugin.highlightImage = function(src, id){
    if (!document.getElementById(id)){
        var results = document.evaluate("//img[@src='"+src+"']", document.documentElement, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        // TO DO: refactor to match more than one instance of found text
        if (results.snapshotLength){
            var thisHeading = results.snapshotItem(0);
            thisHeading.setAttribute("id", id);
            var targetElement = document.getElementById(id);
            targetElement.style.background = "yellow";
            targetElement.style.padding = "4px";
            targetElement.className = targetElement.className + " highlight";
        }
    } else {
        var targetElement = document.getElementById(id);
        targetElement = document.getElementById(id);
        targetElement.className.replace(/\highlight\b/,'');
        targetElement.style.background = "";
        targetElement.style.padding = "";
        delete com.buzzfeed.newsAppPlugin.elements[id];
    }
};



com.buzzfeed.newsAppPlugin.removeObservers = function(id){
    com.buzzfeed.newsAppPlugin.observers.forEach(function(observer) {
        observer.disconnect();
    });
    com.buzzfeed.newsAppPlugin.observers = [];
};


com.buzzfeed.newsAppPlugin.addObserver = function(id){
    var targetElement = document.getElementById(id);
    var observer = new MutationObserver(function(mutations) {
        com.buzzfeed.newsAppPlugin.updateElements();
    });
    observer.observe( targetElement, { childList:true, characterData:true, subtree:true });
    com.buzzfeed.newsAppPlugin.observers.push(observer);
};

com.buzzfeed.newsAppPlugin.editElement = function(data){
    if (data.hasOwnProperty('headline')){
        com.buzzfeed.newsAppPlugin.highlight('h1',data.headline,'com-buzzfeed-newsapp-model-header');
    }
    if (data.hasOwnProperty('body')){
        com.buzzfeed.newsAppPlugin.highlight('p',data.body,'com-buzzfeed-newsapp-model-body');
    }
    if (data.hasOwnProperty('image_caption')){
        com.buzzfeed.newsAppPlugin.highlight('*',data.image_caption,'com-buzzfeed-newsapp-model-image-caption');
    }
    if (data.hasOwnProperty('image_credit')){
        com.buzzfeed.newsAppPlugin.highlight('*',data.image_credit,'com-buzzfeed-newsapp-model-image-credit');
    }

    if (data.hasOwnProperty('headline_image_url')){
        com.buzzfeed.newsAppPlugin.highlightImage(data.headline_image_url,'com-buzzfeed-newsapp-model-headline-image');
    }
    if (data.hasOwnProperty('created')){
        com.buzzfeed.newsAppPlugin.highlight('*',data.created,'com-buzzfeed-newsapp-model-created');
    }
    if (data.hasOwnProperty('anchor')){
        com.buzzfeed.newsAppPlugin.highlight('a',data.anchor,'com-buzzfeed-newsapp-model-anchor');
    }
    if (data.hasOwnProperty('tags')){
        com.buzzfeed.newsAppPlugin.highlight('a',data.tags,'com-buzzfeed-newsapp-model-tags');
    }
};

com.buzzfeed.newsAppPlugin.fetchElement = function(id){
    try {
        var el = document.getElementById(id);
        if (el){
            return el.getElementsByClassName('editElement')[0].innerText;
        }
    }
    catch(err) {
        console.log('Error: '+id+' does not exist.');
    }
}

com.buzzfeed.newsAppPlugin.updateElements = function(){
    var data = {};
    data.headline = com.buzzfeed.newsAppPlugin.fetchElement('com-buzzfeed-newsapp-model-header');
    data.body = com.buzzfeed.newsAppPlugin.fetchElement('com-buzzfeed-newsapp-model-body');
    data.image_caption = com.buzzfeed.newsAppPlugin.fetchElement('com-buzzfeed-newsapp-model-image-caption');
    data.image_credit = com.buzzfeed.newsAppPlugin.fetchElement('com-buzzfeed-newsapp-model-image-credit');
    data.created = com.buzzfeed.newsAppPlugin.fetchElement('com-buzzfeed-newsapp-model-created');
    data.anchor = com.buzzfeed.newsAppPlugin.fetchElement('com-buzzfeed-newsapp-model-anchor');
    data.tags = com.buzzfeed.newsAppPlugin.fetchElement('com-buzzfeed-newsapp-model-tags');
    chrome.runtime.sendMessage( com.buzzfeed.newsAppPlugin.sender.id, {action:'updateData', data:data});
};






chrome.runtime.onMessage.addListener(function(options, sender, sendResponse) {
    if (options.hasOwnProperty('action') && options.action==="editElement"){
        com.buzzfeed.newsAppPlugin.sender = sender;
        com.buzzfeed.newsAppPlugin.options = options;
        com.buzzfeed.newsAppPlugin.editElement(options.data);
    }
});


