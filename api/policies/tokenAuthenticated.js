// policies/authenticated.js

module.exports = function(req, res, next) {

  // adopt the User from the socket
  if(req.isSocket && req.socket.User) {
    req.User = req.socket.User;
    console.log('socket');
    return next();
  }

  // get token from header an validate it
  let token = req.headers["x-token"] || req.param('token');

  function sendFailed() {
    res.status(400).send({err: 'E_WRONG_TOKEN', message: 'Wrong Token'});
  }

  // validate we have all params
  if(!token) return sendFailed();

  // validate token and set req.User if we have a valid token
  sails.services.tokenauth.verifyToken(token, function(err, paymentParams) {
    if(err) return sendFailed()

    // check expireAt
    const currentTimestamp = Date.now() / 1000 | 0

    let expired = ((currentTimestamp - paymentParams.iat) > sails.config.jwt.expireAt )

    if(expired) return sendFailed()

    req.paymentParams = () => paymentParams
    next();

    // const { paymentId, userId, serviceId } = req


    // req.User = User;
    // sails.models.user.findOne({id: data.userId}, function(err, User) {
    //   if(err) sendFailed();
    //   req.User = User;
    //   next();
    // });
  });
};
