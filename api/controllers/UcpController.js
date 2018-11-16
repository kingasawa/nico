const { paymentRequestRule } = sails.config.validate

module.exports = {
  index: async(req,res) => {
    console.log('go ucp');
    return res.view('pages/ucp/index')
  },

  shop: async (req, res) => {
    let {id} = req.user
    let shops = await Shop.find({owner:id})
    console.log('shops', shops);
    return res.view('pages/ucp/shop',{shops})
  },

  product: async (req, res) => {
    let {id} = req.user
    let products = await Product.find({owner:id})
    console.log('products', products);
    return res.view('pages/ucp/product',{products})
  },

  addShop: async (req, res) => {
    let {shop} = req.allParams();
    console.log('shop', shop);
    let {id} = req.user
    let result = await Shopify.sync({shop,id})
    console.log('result', result);
    if(result.success) res.redirect(result.success)
    res.json(result)
  },

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

};

