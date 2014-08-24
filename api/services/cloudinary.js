(function () {
	var cloudinary = require('cloudinary');

	var url = process.env.CLOUDINARY_URL;

	cloudinary.config({ 
	  url: url, 
	});
})();