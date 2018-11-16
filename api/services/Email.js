const postmark = require("postmark");
const ejs = require('ejs');
const util = require('util');
const validator = require('validator');

const { baseUrl } = sails.config.custom

const client = new postmark.Client("66a88d31-ac5b-4a6e-9df9-1acde5f95840");

const renderFile = util.promisify(ejs.renderFile).bind(ejs);

module.exports = {
  send: async ({to = '', subject = '', template = '', data = {}}) => {
    if(!validator.isEmail(to)){
      return false
    }

    data.baseUrl = baseUrl

    const filepath = `./views/emailTemplates/${template}`;
    const htmlBody = await renderFile(filepath, data, {}).catch(err => {
      if (err) {
        console.log('err', err);
        return false
      }
    })

    console.log('htmlBody', htmlBody);
    // return client.sendEmail({
    //   "From": "noreply@syncfab.com",
    //   "To": to,
    //   "Subject": subject,
    //   "HtmlBody": htmlBody
    // })
  }
}
