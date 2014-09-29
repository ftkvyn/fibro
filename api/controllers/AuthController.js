/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');
var passport = require('passport');
var gravatar = require('gravatar');
var uuid = require('node-uuid');

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
            if(user.isNew){
              res.redirect('/profile/edit');
            }else{
              res.redirect('/profile/' + user.id);
            }
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
      return res.redirect('/');
    }); 
  },

  loginByEmail: function(req, res){
      var email = req.body.email;
      var password = req.body.password;
      User.findOne({email:email}).exec(
        function(err,user){
          if(err){
            console.log(err);
            return res.badRequest('User not found');
          }
          if(!user){
            return res.send({
              success: false,
              message: 'Given email or password is incorrect.'
            });
          }
          else if(user.fb_id && !user.password){
            return res.send({
              success: false,
              message: 'Account with the same email already exists and connected to Facebook account. Try log in using Facebook or register using the other email address.'
            });
          }else{
            //check password here.
            bcrypt.compare(password, user.password, function(err, result) {
              if (!result){ 
                return res.send({
                  success: false,
                  message: 'Given email or password is incorrect.'
                });
              }
              req.session.user = user;
              return res.send({success: true, userId: user.id});
            });
          }
        });

  },

  register: function(req, res){
      var email = req.body.email;
      var password = req.body.password;
      if(password.length < 6){
        return res.send({
                  success: false,
                  message: 'Password should be at least 6 characters long.'
                });
      }
      User.findOne({email:email}).exec(
        function(err,user){
          if(err){
            console.log(err);
            return res.badRequest('Error.');
          }
          if(user && user.fb_id){
              return res.send({
                  success: false,
                  message: 'Account with the same email already exists and connected to Facebook account. Try log in using Facebook or register using the other email address.'
                });
          }
          if(user){
            return res.send({
                  success: false,
                  message: 'User with this email is already registered.'
                });
          }
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
              if (err) {
                console.log(err);
                return res.badRequest('Error.');
              }else{
                var pic = gravatar.url(email, {
                  size:50,
                  // default:'/images/anonymous.jpg'
                });
                var picLarge = gravatar.url(email, {
                  size:200,
                  // default:'/images/anonymous.jpg'
                });
                var userData = {
                  email: email,
                  password: hash,
                  name: req.body.name,
                  profilePic: pic,
                  profilePicLarge: picLarge,
                };
                // console.log(userData);
                User.create(userData).exec(function (err, user) {
                  if (user) {            
                    req.session.user = user;
                    res.send({success:true, userId: user.id});
                    emailService.registeredMail(user.email);
                  } else {
                    console.log(err);
                    return res.send({success:false,message:'Error occured.'});
                  }
                });
              }
            });
          });
        });
      },


  recoverPassword: function(req, res){
    var email = req.body.email;
    User.findOne({email: email}).exec(function(err, user){
      if(err){
        console.log(err);
        return res.send({message: 'Unable process request.'});
      }
      if(!user)
      {
        return res.send({message: 'User with given email not found.'});
      }
      if(!user.password && user.fb_id){
        return res.send({message: 'User with given email was registered using facebok. Try to login with facebook.'}); 
      }
      user.recoveryKey = uuid.v4();
      user.save(function(err,user){
          if(err){
            console.log(err);
            return res.send({message: 'Unable process request.'});
          }
          emailService.resetPassword(user);   
          return res.send({message: 'Instructions on reset password were sent to ' + user.email});
        }
      );

    })
  },

  resetPassword: function(req,res){
      var password = req.body.password;
      if(password.length < 6){
        return res.send({
                  success: false,
                  message: 'Password should be at least 6 characters long.'
                });
      }
      var key = req.session.key;

      User.findOne({recoveryKey:key}).exec(
        function(err,user){
          if(err){
            console.log(err);
            return res.send({
                  success: false,
                  message: 'Unable process request.'
                });
          }
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
              if (err) {
                console.log(err);
                return res.badRequest('Error.');
              }else{
                user.password = hash;
                user.recoveryKey = null;
                req.session.key = null;
                user.save(function (err, user) {
                  if (user) {            
                    res.send({success:true, message: 'Password was changed successfuly.'});
                  } else {
                    console.log(err);
                    return res.send({success:false,message:'Error occured.'});
                  }
                });
              }
            });
          });
        });

  }
};