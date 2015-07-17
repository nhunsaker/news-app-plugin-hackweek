var com = {'buzzfeed':{'newsAppPlugin':{}}};

com.buzzfeed.newsAppPlugin.removeFrame = function(){
    var frame = document.getElementById("com-buzzfeed-newsapp-iframe");
    if (frame){
        frame.parentNode.removeChild(frame);
    }
};

com.buzzfeed.newsAppPlugin.removeFrame();
