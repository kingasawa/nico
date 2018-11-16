const { paymentRequestRule } = sails.config.validate

module.exports = {
  index: async(req,res) => {
    return res.notFound()
  },

  all_user: async(req,res) => {
    let foundUser = await User.find();
    res.json(foundUser)
  },

  list: (req, res) => {
    res.view('user/index');
  },

  info: function(req, res) {
    console.log('req session', req.session);
    let userInfo = _.get(req,'session.passport', null)
    console.log('userInfo', userInfo);
    if(!userInfo) {
      // return res.status(404).send({
      //   message: 'user not found'
      // })
      return res.badRequest({ description: 'Please login!', message: 'User not found' })
    }
    return res.status(200).send(userInfo)
  },
};

