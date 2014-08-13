/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');
module.exports = {
  
  logout: function (req, res){
    req.session.user = null;
    req.session.flash = 'You have logged out';
    res.redirect('/');
  },

  fb_authenticate: function (req, res, next) {
      passport.authenticate('facebook', { scope: ['email', 'user_about_me']},
        function (err, user) {
            console.log('fb_authenticate callback called.');            
    })(req, res, next);
  },

  fb_authenticate_callback: function (req, res, next) {
     passport.authenticate('facebook',
        function (err, user, info) {
          if(user){
            req.session.user = user;
            res.redirect('/profile/' + user.id);
          }
          else{
            console.log(info);
            console.log(err);
            res.serverError(info);
          }
        })(req, res, next);
  },

  loginById: function (req, res, next) {
      User.findOne(req.param('id'))
      .exec(function(err, user){
      if(err || (!user)){
        return res.badRequest('User not found.');
      }
      req.session.user = user;
      return res.view('home');
    }); 
  },

};

