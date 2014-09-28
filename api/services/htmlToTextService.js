var htmlToText = require('html-to-text');

exports.convert = function (html){
	if(html){
		return htmlToText.fromString(html);
	}else{
		return html;
	}
}