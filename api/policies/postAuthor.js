module.exports = function(req, res, next) {

  if (!req.session.user) {
    return res.send(403);
  }
  var postId = req.param('id') || req.body.id;
  Post.findOne(postId)
  .exec(function(err, post){
  	if(err){
  		console.log(err);
  		return res.send(404);
  	}
  	if(post.author === req.session.user.id){
  		return next();
  	}else{
  		return res.send(403);
  	}
  });

};