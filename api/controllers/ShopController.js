const { paymentRequestRule } = sails.config.validate

module.exports = {

  add: async (req, res) => {
    let {shop} = req.allParams();
    console.log('shop', shop);
    let {id} = req.user
    let result = await Shopify.sync({shop,id})
    console.log('result', result);
    if(result.success) res.redirect(result.success)
    else {
      res.json(result.error)
    }
  }

};

