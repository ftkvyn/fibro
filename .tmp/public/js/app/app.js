fibroApp = angular.module('fibro', ['flow', 'ngModal']);

fibroApp.service('nicService', function(){
     
    this.create = function(id) { 
    	var options = {
    		buttonList: [
				 'italic'
    			,'bold'
				,'underline'
				,'left'
				,'center'
				,'right'
				,'justify'
				,'ol'
				,'ul'
				,'subscript'
				,'superscript'
				,'strikethrough'
				,'removeformat'
				,'indent'
				,'outdent'
				,'hr'
				,'image'
				,'forecolor'
				,'link'
				,'unlink' 
				,'fontSize'
				,'fontFormat']
			}
    	return new nicEditor(options).panelInstance(id); 
    };
 
});