const { baseUrl } = sails.config.custom

module.exports = {
  index: async (req, res) => {
    const { email, token } = req.allParams()
    const data = { users: ['geddy', 'neil', 'alex'],email ,token};
    const html = Email.send({
      to: email,
      subject: 'Verify your email',
      template: 'verifyEmail.ejs',
      data
    })

    return res.json({
      data,
      html,
    })
  },
};

