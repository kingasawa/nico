const { paymentRequestRule } = sails.config.validate

module.exports = {

  index: async(req,res) => {
    console.log('go ucp');
    return res.view('pages/ucp/index')
  },

  shop: async (req, res) => {
    let {id} = req.user
    console.log('req.user', req.user);
    let shops = await Shop.find({owner:id})
    console.log('shops', shops);
    return res.view('pages/ucp/shop',{shops})
  },

  product: async (req, res) => {
    let {id} = req.user
    console.log('req.user', req.user);
    let products = await Product.find({owner:id})
    let shops = await Shop.find({owner:id})

    console.log('products', products);
    return res.view('pages/ucp/product',{products,shops})
  }

};

