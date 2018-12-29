

module.exports = {


  attributes: {

    title: {
      type: 'string'
    },
    body_html: {
      type: 'string'
    },
    store:{
      type: 'string',
      allowNull: true
    },
    compare_at_price: {
      type: 'number'
    },
    price: {
      type: 'number'
    },
    sku: {
      type: 'string'
    },
    stock: {
      type: 'number',
      defaultsTo: 0,
    },
    weight: {
      type: 'number',
      defaultsTo: 0,
    },
    weight_unit: {
      type: 'string'
    },
    vendor: {
      type: 'string'
    },
    brand: {
      type: 'string'
    },
    mpn: {
      type: 'string'
    },
    gtin: {
      type: 'string'
    },
    merchant: {
      type: 'json'
    },
    collections: {
      type: 'string'
    },
    product_type: {
      type: 'string'
    },
    tags: {
      type: 'string'
    },
    option1: {
      type: 'string'
    },
    option2: {
      type: 'string'
    },
    option3: {
      type:'string'
    },
    variants: {
      type: 'json'
    },
    options: {
      type: 'json'
    },
    images: {
      type: 'json'
    },

    global: {
      type: 'number',
      defaultsTo: 1,
      isIn: [0,1] // 0: private, 1:global
    },
    status: {
      type: 'string',
      defaultsTo: 'Unsync'
    },
    productid:{
      type: 'string',
      unique: true
    },
    sync_id: {
      type: 'string',
      allowNull: true
    },
    productpage:{
      type: 'string'
    },
    owner: {
      model: 'user',
      required: true
    }

  },
};
