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
                // req.session.user = user;
                // console.log('User is in the session');
                // console.log(user);
                // console.log(req.session);
                // res.redirect('/profile');
            
    })(req, res, next);
  },

  fb_authenticate_callback: function (req, res, next) {
     passport.authenticate('facebook',
        function (err, user, info) {
            req.session.user = user;
            //console.log('User is in the session');
            //console.log(user);
            //console.log(req.session);
            res.redirect('/profile');
        })(req, res, next);
  },

};

