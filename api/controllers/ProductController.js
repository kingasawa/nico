const { paymentRequestRule } = sails.config.validate

module.exports = {

  getProductData: async (req, res) => {
    let {product,page} = req.allParams()
    let productData

    if(page === 'walmart'){
      productData = await Walmart.getProduct({product})
    }

    console.log('Controller:productData', productData);
    res.json(productData)
  },

  quickAddProduct: async (req, res) => {
    let params = req.allParams();
    let {id} = req.session.passport.user
    console.log('req.session', req.session.passport);
    params.owner = id;
    let result = await Walmart.quickAdd(params)
    console.log('quickAddProduct result', result);
    return res.json(result)
  },

  sync: async (req, res) => {
    let params = req.allParams();
    console.log('params', params);
  },

};

