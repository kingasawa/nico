let passport = require('passport'),
  _ = require('lodash'),
  LocalStrategy = require('passport-local').Strategy,
  // md5 = require('MD5');
  bcrypt = require('bcrypt-nodejs');

//After passport serializes the object, return the id
passport.serializeUser((user, done)=> {
  console.log('serializeUser user', user);
  done(null, user);
});

//Passport deserializes the user by id and returns the full user object.
passport.deserializeUser((user, done)=>{
  const id = user.id
  console.log('deserializeUser user', id, user);
  User.findOne(id).exec((err,userData)=> {
    console.log('deserializeUser ---> userData', userData);
    done(err, userData);
  });
});

//This is the holy grail of the strategy. When a request comes in
//we try and find the user by email and see if their passport
//is correct.

let verifyHandler = (req ,username, password, cb)=> {
  process.nextTick(()=> {
    User.findOne({ username: username }).exec((err, user)=> {
      if (err) return cb(err);
      if (!user) return cb(null, false, { message: 'Username not found' });
      bcrypt.compare(password, user.password, (err, res)=> {
        if (!res) return cb(null, false, { message: 'Invalid Password' });
        let userDetails = {
          email: user.email,
          username: user.username,
          id: user.id
        };
        return cb(null, userDetails, { message: 'Login Succesful' });
      });
      });
  });
};

//Register the LocalStrategywith Passport.
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true

}, verifyHandler));
