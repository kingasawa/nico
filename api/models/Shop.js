

module.exports = {


  attributes: {
    name: {
      type: 'string',
      required: true
    },
    accessToken: {
      type: 'string',
      required: true,
      unique: true,
    },
    scope: {
      type: 'string',
      required: true,
    },
    owner: {
      model: 'user',
      required: true
    },
  }
};
