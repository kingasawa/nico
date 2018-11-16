module.exports = {

  error: async (error) => {
    console.log('error keys', Object.keys(error));
    // console.log('error text', error.result);
    let message = _.get(error,'result.error',error.message)

    if(!message){
      message =  'Your transaction can not be sent, please try again!'
    }
    return message
  }
};
