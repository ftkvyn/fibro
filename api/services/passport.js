var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;

function findById(id, fn) {
  User.findOne(id).exec(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

function findByFacebookId(id, fn) {
  User.findOne({
    fb_id: id
  }).exec(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    enableProof: false
  }, function (accessToken, refreshToken, profile, done) {
    //console.log(profile);
    findByFacebookId(profile.id, function (err, user) {

      // Create a new User if it doesn't exist yet
      if (!user) {
        console.log('Create new user');
        User.create({

          fb_id: profile.id,
          fb_token: accessToken,
          name: profile.displayName,
          email: profile.emails[0].value,

          // You can also add any other data you are getting back from Facebook here 
          // as long as it is in your model

        }).exec(function (err, user) {
          if (user) {
            console.log('Logged In Successfully, new user');
            return done(null, user, {
              message: 'Logged In Successfully'
            });
          } else {
            return done(err, null, {
              message: 'There was an error logging you in with Facebook'
            });
          }
        });

      // If there is already a user, return it
      } else {
        console.log('Logged In Successfully, old user');
        user.fb_token = accessToken;
        user.save(function(){
          return done(null, user, {
            message: 'Logged In Successfully'
          });
        });
      }
    });
  }
));