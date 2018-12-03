const passport = require('passport');

module.exports = {

  // login: function(req, res) {
  //   passport.authenticate('local', function(err, user, info){
  //     console.log('result', {err, user, info});
  //     if((err) || (!user)) {
  //       return res.status(403).send(info);
  //     }
  //     else {
  //       req.logIn(user, function(err) {
  //         if(err) res.send(err);
  //         console.log('info.message', info.message);
  //         console.log('info.user', user);
  //         // return res.status(200).send({
  //         //   ...user
  //         // })
  //         res.redirect('/ucp')
  //       });
  //     }
  //
  //   })(req, res);
  // },

  login: function(req, res) {
    req.wantsJSON = true
    passport.authenticate('local', function(err, user, info) {
      sails.log.debug('result', {
        err,
        user,
        info
      });
      if ((err) || (!user)) {
        return res.status(403).send(info);
      } else {
        let token = TokenAuth.generateToken(user)

        console.log('user', user);
        user.token = token
        req.logIn(user, function(err) {
          if (err) {
            sails.log.error('Auth.logIn', err);
            res.send(err);
          }
          sails.log.debug('info.message', info.message);
          sails.log.debug('info.user', user);
          sails.log.debug('session', req.session);

          // return res.status(200).send({
          //   ...user,
          //   token
          // })
          return res.redirect('/ucp')
        });
      }

    })(req, res);
  },

  register: async(req, res) => {
    let {username,password,email} = req.allParams()
    console.log('params', req.allParams());
    User.create({username,email,password}).then((result)=>{
      return res.redirect(`/login?username=${username}`);
    }).catch((err)=>{
      res.json(err)
    })
  },

  logout: function(req, res) {
    req.logout();
    setTimeout(()=>{
      res.redirect(`/login`);
    },1000)
  },

  session: async(req, res) =>{
    res.status(200).send(req.session)
  },

};
