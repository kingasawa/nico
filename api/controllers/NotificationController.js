/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const http = require('http');
// const { shopifyScope, shopifyApiKey, shopifySecretKey, baseUrl } = sails.config.custom



module.exports = {
  index: (req,res) => {
    res.ok();
  },
  join: (req,res) => {
    if(req.isSocket){
      let session_id = req.signedCookies['sails.sid'];
      let rooms = [session_id];
      if(req.session.authenticated){
        sails.sockets.join(req, req.session.user.id);
        rooms.push(req.session.user.id);
      }
      rooms.map(room => sails.sockets.join(req, room))
      res.json({ join: rooms });
    }else{
      res.redirect('/');
    }
  },

  app: async(req,res)=> {
    res.send(200);
    let params = req.allParams();
    // console.log('event app/uninstalled',params);

    let foundShop = await Promise.resolve(Shop.findOne({name:params.shop}));
    Shop.destroy({id:foundShop.id}).exec(function(){});
    ShopifyToken.destroy({shop:foundShop.id}).exec(function(){})

  },

  product: async(req,res) => {
    let params = req.allParams();
    let {act,shop} = params;
    params.productId = params.id;
    delete params.id;

    res.send(200);

    setTimeout(async() => {
      let findProduct = await Product.findOne({productId:params.productId});

      Shop.findOne({name:shop}).then((result)=>{
        console.log('result.owner', result.owner);
        params.owner = result.owner;


        console.log('params', params);
        if(act == 'create'){

          if(!findProduct){


            Product.create(params).then((createProduct)=>{
              console.log('create product done',createProduct.id);
            }).catch((err)=>{
              console.log('err', err);
            })
          }
        }

        if(act == 'update'){
          if(findProduct){

            Product.update({productId:params.productId},params).then((updateProduct)=>{
              let getStock = params.variants[0].inventory_quantity;
              Post.update({productid:params.productId},{stock:getStock}).then((result)=>{
                console.log('update stock')
              })
              console.log('update product done',updateProduct.id);
            }).catch((err)=>{
              console.log('err', err);
            })
          } else {
            console.log('product not found');
          }
        }

        if(act == 'delete'){
          if(findProduct){
            Product.destroy({productId:params.productId}).then((deleteProduct)=>{
              console.log('delete product done',deleteProduct.id);
            }).catch((err)=>{
              console.log('err', err);
            })
            Post.update({productid:params.productId},{
              store: '',
              productid: ''
            }).then((removeStore)=>{
              console.log('removeStore', removeStore);
            }).catch((err)=>{
              console.log('err', err);
            })
          } else {
            console.log('product not found');
          }
        }
      }).catch((err)=>{
        console.log('err', err);
      });
    },10000)
  },
  tracking: async(req,res) => {
    let params = req.allParams();
    console.log('params', params);

    let {event,msg,ts} = params;
    if(event == 'tracking_update'){
      let orderid = msg.title.replace('order-','')
      if(msg.tag=='Exception'){
        Order.update({orderid},{tracking_status:msg.tag,status:'Return'}).then((updateStatus)=>{
          console.log('updateStatus',updateStatus.orderid );
        }).catch((err)=>{
          console.log('err', err);
        })
      } else if(msg.tag=='Delivered'){
        Order.update({orderid},{tracking_status:msg.tag,status:'Delivered'}).then((updateStatus)=>{
          console.log('updateStatus',updateStatus.orderid );
        }).catch((err)=>{
          console.log('err', err);
        })
      } else {
        Order.update({orderid},{tracking_status:msg.tag}).then((updateStatus)=>{
          console.log('updateStatus',updateStatus.orderid );
        }).catch((err)=>{
          console.log('err', err);
        })
      }

    }

  },
};

