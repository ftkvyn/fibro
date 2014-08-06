/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');
module.exports = {
 
  fb_authenticate: function (req, res) {
     passport.authenticate('facebook')
  },

  fb_authenticate_callback: function (req, res) {
     passport.authenticate('facebook', { successRedirect: '/test',
                                      failureRedirect: '/' });
  },

};

