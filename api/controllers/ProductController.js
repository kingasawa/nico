const { paymentRequestRule } = sails.config.validate
const { shopifyApiKey, shopifySecret, baseUrl } = sails.config.custom

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

  sync: async(req,res) => {
    const session_id = req.signedCookies['sails.sid'];
    let {selectedProducts,shop} = req.allParams();

    selectedProducts.map(async(productid)=>{
      let findProduct = await Product.findOne({id:productid})
      let {title,body_html,brand,product_type,tags,options,variants,images} = findProduct
      let syncData = {
        "product": {
          title, body_html, product_type, tags,
          options, variants, images,
          "vendor": brand,
          "published": true,
        }
      }

      // console.log('findProduct', findProduct);

      // variants.map((item)=>{
      //   let discountPrice = item.compare_at_price*discount
      //   item.price = Math.ceil(item.compare_at_price - discountPrice) - 0.01
      // })

      let findShop = await Shop.findOne({name:shop});

      let shopifyAuth = {
        shop:shop,
        shopify_api_key: shopifyApiKey,
        access_token:findShop.accessToken,
      };

      let apiConfig = {
        rate_limit_delay: 10000, // 10 seconds (in ms) => if Shopify returns 429 response code
        backoff: 5, // limit X of 40 API calls => default is 35 of 40 API calls
        backoff_delay: 2000 // 1 second (in ms) => wait 1 second if backoff option is exceeded
      };

      shopifyAuth = Object.assign(apiConfig, shopifyAuth);
      const Shopify = new ShopifyApi(shopifyAuth);

      let shopifyPostUrl = `/admin/products.json`;

      const publisher = sails.hooks.kue_publisher;
      const publishData = {
        syncData,
        shopifyPostUrl,
        shopifyAuth,
        title: shopifyAuth.shop
      };

      publisher.create('syncproduct', publishData)
               .priority('high')
               // .searchKeys( ['title', 'putImg'] )
               .attempts(1)
               .backoff( { delay: 3 * 1000, type: 'fixed'} )
               .on('complete', async(result) => {
                 console.log('Sync product Job completed with data ', result);
                 let {product} = result

                 let productUpdate = await Product.update({id:productid},{
                   store:shop,
                   sync_id: product.id,
                   status: 'Synced'
                 }).fetch()
                 console.log('productUpdate', productUpdate);

                 product.store = shop
                 product.product = productid
                 product.productid = product.id
                 delete product.id
                 let createSync = await ProductSync.create(product).fetch()
                 console.log('createSync', createSync);

                 sails.sockets.broadcast(session_id, 'pushto/shopify',createSync)
               })
               .removeOnComplete( true )
               .ttl(600000)
               .save();
    })
  },

};

