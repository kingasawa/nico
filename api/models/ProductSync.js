

module.exports = {


  attributes: {

    productid: {
      type: 'string'
    },
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
    vendor: {
      type: 'string'
    },
    product_type: {
      type: 'string'
    },
    handle: {
      type: 'string'
    },
    published_at: {
      type: 'string'
    },
    tags: {
      type: 'string'
    },
    published_scope: {
      type: 'string'
    },
    admin_graphql_api_id: {
      type: 'string'
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
    image: {
      type: 'json'
    },
    product: {
      model: 'product',
      required: true
    },

  },
};
