var com = {'buzzfeed':{'newsAppPlugin':{}}};


chrome.runtime.onMessage.addListener(function(options, sender, sendResponse) {
    if (options.action == "transfer"){
        com.buzzfeed.newsAppPlugin.model = options.data;
    }
});

setTimeout(function(){
    com.buzzfeed.newsAppPlugin.restore();
}, 400);

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementsByClassName('js-module-create')[0].click();
});


com.buzzfeed.newsAppPlugin.restore = function(){
    var model = com.buzzfeed.newsAppPlugin.model;
    try {
        document.getElementsByClassName('js-module-create')[0].click();
    } catch (e){
        console.log('Error: could not find create button.');
    }
    if (model.module_type == "url"){
         // TO DO : Support other types in the future
    }
    setTimeout(function(){
        com.buzzfeed.newsAppPlugin.setValue('js-anchor-input', model.anchor);
        com.buzzfeed.newsAppPlugin.setValue('js-url-input', model.url);
        com.buzzfeed.newsAppPlugin.setValue('js-image-credit', model.image_credit);
        com.buzzfeed.newsAppPlugin.setValue('js-image-caption', model.image_caption);
        com.buzzfeed.newsAppPlugin.setValue('js-headline-input', model.headline);
        com.buzzfeed.newsAppPlugin.setValue('js-dek-input', model.body);
        com.buzzfeed.newsAppPlugin.setValue('js-tags-input', model.tags);
        com.buzzfeed.newsAppPlugin.setValue('js-image-field', model.headline_image_url);
        document.getElementsByClassName('js-image-field').blur();
    }, 400);


};

com.buzzfeed.newsAppPlugin.setValue = function(className, data){
    document.getElementsByClassName(className)[0].value=data;
}


