var com = {'buzzfeed':{'newsAppPlugin':{}}};

com.buzzfeed.newsAppPlugin.injectFrame = function(){
    var iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('form.html');
    iframe.style.position = 'fixed';
    iframe.style.top = 0;
    iframe.style.left = 0;
    iframe.style.display = 'block';
    iframe.style.width = '100%';
    iframe.style.height = '80px';
    iframe.style.zIndex = 9999999999999;
    iframe.setAttribute("id", "com-buzzfeed-newsapp-iframe");
    document.body.appendChild(iframe);
};

com.buzzfeed.newsAppPlugin.injectFrame();
