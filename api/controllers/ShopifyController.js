/**
 * ShopifyController
 *
 * @description :: Server-side logic for managing Shopifies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const { shopifyApiKey, shopifySecret, baseUrl } = sails.config.custom

module.exports = {
  sync: (req,res) => {

    let params = req.allParams();
    let session_id = req.signedCookies['sails.sid'];
    // sails.sockets.join(req,session_id);
    Shop.findOne({name:params.shopifyname+'.myshopify.com'}).exec((err,foundShop)=>{
      if (!foundShop) {
        var Shopify = new ShopifyApi({
          shop: params.shopifyname,
          shopify_api_key: shopifyApiKey,
          shopify_shared_secret: shopifySecret,
          shopify_scope: shopifyScope,
          redirect_uri: `https://${baseUrl}/shopify/sync_callback`,
          nonce: params.uid // you must provide a randomly selected value unique for each authorization request
        });
        console.log('shopifyApiKey', shopifyApiKey);
        console.log('shopifySecret', shopifySecret);
        console.log('Shopify.buildAuthURL()', Shopify.buildAuthURL());
        res.json({success:Shopify.buildAuthURL()});
      } else {
        res.json({error:'shop exist'});
      }
    });
  },

  sync_callback: (req,res) => {
    let params = req.allParams();
    let sessionId = req.signedCookies['sails.sid'];

    let Shopify = new ShopifyApi({
      shop: params.shop,
      shopify_api_key: shopifyApiKey,
      shopify_shared_secret: shopifySecret,
    });
    let postData = {
      client_id:shopifyApiKey,
      client_secret:shopifySecret,
      code:params.code
    };


    Shopify.post('/admin/oauth/access_token', postData, (err,data) => {

      if(err) {
        return sails.log.error({
          controller: 'shopify',
          action: 'sync_callback',
          error: err,
        })
      }

      let createShopParams = {
        name: params.shop,
        owner: params.state,
        accessToken: data.access_token,
        scope: data.scope
      };

      Shop.create(createShopParams).then((createShop) => {

        let Shopify = new ShopifyApi({
          shop: params.shop,
          shopify_api_key: shopifyApiKey,
          access_token: data.access_token
        });

        let orderCreateHook = {
          webhook: {
            "topic": "orders\/create",
            "address": `https:\/\/${baseUrl}\/notification\/order?act=create&shop=${params.shop}`, // Update new address when public
            "format": "json"
          }
        };
        Shopify.post('/admin/webhooks.json',orderCreateHook, (err,orderCreate) => {
          if(err){
            return sails.log.error({
              controller:'shopify',
              action:'/admin/webhooks.json',
              error: err,
              params: orderCreateHook,
            })
          }

        });


        let orderUpdateHook = {
          webhook: {
            "topic": "orders\/updated",
            "address": `https:\/\/${baseUrl}\/notification\/order?act=updated&shop=${params.shop}`, // Update new address when public
            "format": "json"
          }
        };
        Shopify.post('/admin/webhooks.json',orderUpdateHook, (err,orderUpdate) => {
          if(err){
            return sails.log.error({
              controller:'shopify',
              action:'/admin/webhooks.json',
              error: err,
              params: orderUpdateHook,
            })
          }
        });

        let productCreateHook = {
          webhook: {
            "topic": "products\/create",
            "address": `https:\/\/${baseUrl}\/notification\/product?act=create&shop=${params.shop}`, // Update new address when public
            "format": "json"
          }
        };
        Shopify.post('/admin/webhooks.json',productCreateHook, (err,productCreate) => {
          if(err){
            return sails.log.error({
              controller:'shopify',
              action:'/admin/webhooks.json',
              error: err,
              params: productCreateHook,
            })
          }
        });

        let productDeleteHook = {
          webhook: {
            "topic": "products\/delete",
            "address": `https:\/\/${baseUrl}\/notification\/product?act=delete&shop=${params.shop}`, // Update new address when public
            "format": "json"
          }
        };
        Shopify.post('/admin/webhooks.json',productDeleteHook, (err,productDelete) => {
          if(err){
            return sails.log.error({
              controller:'shopify',
              action:'/admin/webhooks.json',
              error: err,
              params: productDeleteHook,
            })
          }
        });

        let productUpdateHook = {
          webhook: {
            "topic": "products\/update",
            "address": `https:\/\/${baseUrl}\/notification\/product?act=update&shop=${params.shop}`, // Update new address when public
            "format": "json"
          }
        };
        Shopify.post('/admin/webhooks.json',productUpdateHook, (err,productUpdate) => {
          if(err){
            return sails.log.error({
              controller:'shopify',
              action:'/admin/webhooks.json',
              error: err,
              params: productUpdateHook,
            })
          }
        });

        let appUninstallHook = {
          webhook: {
            "topic": "app\/uninstalled",
            "address": `https:\/\/${baseUrl}\/notification\/app?act=uninstalled&shop=${params.shop}`, // Update new address when public
            "format": "json"
          }
        };
        Shopify.post('/admin/webhooks.json',appUninstallHook, (err,appUninstall) => {
          if(err){
            return sails.log.error({
              controller:'shopify',
              action:'/admin/webhooks.json',
              error: err,
              params: orderUpdateHook,
            })
          }
        });

        res.redirect('/ucp/shop');

      }).catch((err)=>{
        console.log('err', err);
      })
    });
  },



  delete_store: async(req,res) => {
    let {id,shop} = req.allParams();

    Shop.destroy({name:shop}).then(()=>{
      console.log('delete store', shop);
      return res.json({result:shop})
    });
  },

};

