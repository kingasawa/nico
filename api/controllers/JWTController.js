module.exports = {
  index: async (req, res) => {
    const paymentParams  = req.paymentParams()

    res.json({
      paymentParams
    })
  },
  sign: async (req, res) => {
    const params = req.allParams()
    const token = TokenAuth.generateToken(params)

    res.json({
      token
    })
  },
  decode: async (req, res) => {
    const { token } = req.allParams()
    const decoded = TokenAuth.decodeToken(token)

    res.json({
      decoded
    })
  },
  verify: async (req, res) => {
    const { token } = req.allParams()
    const verified = TokenAuth.verifyToken(token)

    res.json({
      verified
    })
  }
};

