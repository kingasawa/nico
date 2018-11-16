const { shopifyScope, shopifyApiKey, shopifySecretKey, baseUrl } = sails.config.custom

module.exports = {
  sync: async({shop,id}) => {

    let findShop = await Shop.findOne({name:`${shop}.myshopify.com`})

    if (findShop) return {
      error:'store existed'
    }

    let Shopify = new ShopifyApi({
      shop,
      shopify_api_key: shopifyApiKey,
      shopify_shared_secret: shopifySecretKey,
      shopify_scope: shopifyScope,
      redirect_uri: `https://${baseUrl}/shopify/sync_callback`,
      nonce: id // you must provide a randomly selected value unique for each authorization request
    });

    return {
      success:Shopify.buildAuthURL()
    }

  },
}
