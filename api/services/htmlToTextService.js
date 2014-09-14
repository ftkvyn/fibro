var htmlToText = require('html-to-text');

exports.convert = function (html){
	return htmlToText.fromString(html);
}