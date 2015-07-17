var com = {
	'buzzfeed':{
		'newsAppPlugin': {
			'original': {}
		}
	}
}

chrome.runtime.onMessage.addListener(function(options, sender, sendResponse) {
    if (options.action == "init"){
		com.buzzfeed.newsAppPlugin.sender = sender;
		com.buzzfeed.newsAppPlugin.init(options);
    } else if (options.action == "update"){
		com.buzzfeed.newsAppPlugin.updateModel(options.data);
	} else if (options.action == "define" ){
		com.buzzfeed.newsAppPlugin.defineProperty(options);
	}
});

com.buzzfeed.newsAppPlugin.defineProperty = function(options){
	var model = com.buzzfeed.newsAppPlugin.model;
	if (options.element == 'headline'){
		model.headline = options.value;
	}
	if (options.element ==  'body'){
		model.body = options.value;
	}
	if (options.element =='image_caption'){
		model.image_caption = options.value;
	}
	if (options.element =='image_credit'){
		model.image_credit = options.value;
	}
	if (options.element =='headline_image_url'){
		model.headline_image_url = options.value;
	}
	if (options.element =='created'){
		model.created = options.value;
	}
	if (options.element =='anchor'){
		model.anchor = options.value;
	}
	if (options.element =='tags'){
		model.tags = options.value;
	}
	com.buzzfeed.newsAppPlugin.model = model;
	com.buzzfeed.newsAppPlugin.refreshForm();
}


com.buzzfeed.newsAppPlugin.updateModel = function(data){
	var model = com.buzzfeed.newsAppPlugin.model;
	if (data.hasOwnProperty('headline')){
		model.headline = data.headline;
	}
	if (data.hasOwnProperty('body')){
		model.body = data.body;
	}
	if (data.hasOwnProperty('image_caption')){
		model.image_caption = data.image_caption;
	}
	if (data.hasOwnProperty('image_credit')){
		model.image_credit = data.image_credit;
	}
	if (data.hasOwnProperty('headline_image_url')){
		model.headline_image_url = data.headline_image_url;
	}
	if (data.hasOwnProperty('created')){
		model.created = data.created;
	}
	if (data.hasOwnProperty('anchor')){
		model.anchor = data.anchor;
	}
	if (data.hasOwnProperty('tags')){
		model.tags = data.tags;
	}
	com.buzzfeed.newsAppPlugin.model = model;
	com.buzzfeed.newsAppPlugin.refreshForm();
}


com.buzzfeed.newsAppPlugin.init = function(data){
	if ( data.hasOwnProperty('url') ){
		com.buzzfeed.newsAppPlugin.openGraphConversion(data.url);
	}
	$( "a.js-live-edit" ).click(function() {
		var data = {action: "activateEdit", data: com.buzzfeed.newsAppPlugin.model};
		chrome.runtime.sendMessage( com.buzzfeed.newsAppPlugin.sender.id, data);
	});
	$( "a.js-close" ).click(function() {
		chrome.runtime.sendMessage( com.buzzfeed.newsAppPlugin.sender.id, {action:'close'});
	});
	$( "a.js-save" ).click(function() {
		var model = com.buzzfeed.newsAppPlugin.model;
		chrome.runtime.sendMessage( com.buzzfeed.newsAppPlugin.sender.id, {action:'save', data: model});
	});
}

com.buzzfeed.newsAppPlugin.refreshForm = function(){
	var model = com.buzzfeed.newsAppPlugin.model;
	$('#headlineInput').val(model.headline);
	$('#imageLink').attr('href', model.headline_image_url);
	$('#imageInputDisplay').attr('src', model.headline_image_url);
	$('#captionInput').val( model.image_caption);
	$('#creditInput').val(model.image_credit);
	$('#bodyInput').val(model.body);
	$('#inputTimestamp').val(model.created);
	$('#inputAnchor').val(model.anchor);
	$('#inputTags').val(model.tags);
}

com.buzzfeed.newsAppPlugin.refreshModel = function(){
	var model = com.buzzfeed.newsAppPlugin.model;
}

com.buzzfeed.newsAppPlugin.openGraphConversion = function(url){
	$.ajax({
		cache: false,
		url: 'http://{{SERVER_URL}}/api/opengraph/',
		type: 'GET',
		datatype: 'json',
		data: {'url' : url},
		success: function (data) {
			com.buzzfeed.newsAppPlugin.model = data;
			com.buzzfeed.newsAppPlugin.refreshForm();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			if (jqXHR.status == 500) {
				console.log('Internal error: ' + jqXHR.responseText);
			} else {
				console.log('Unexpected error.');
			}
		}
	});
};