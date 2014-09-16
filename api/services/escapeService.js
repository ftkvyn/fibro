exports.escapeScript = function (val){
	return val.replace(/<script/,'&lt;script', '\i');
}