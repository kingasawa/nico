
module.exports = {
  smsgateway: async(req,res) => {
    let params = req.allParams()
    console.log('params', params);
    let updateSms = await Sms.create({params}).fetch()
    console.log('updateSms', updateSms);
    res.status(200).send(updateSms)

  }
};

