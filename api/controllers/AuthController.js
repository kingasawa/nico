const passport = require('passport');

module.exports = {

  login: function(req, res) {
    passport.authenticate('local', function(err, user, info){
      console.log('result', {err, user, info});
      if((err) || (!user)) {
        return res.status(403).send(info);
      }
      else {
        req.logIn(user, function(err) {
          if(err) res.send(err);
          console.log('info.message', info.message);
          console.log('info.user', user);
          // return res.status(200).send({
          //   ...user
          // })
          res.redirect('/ucp')
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
