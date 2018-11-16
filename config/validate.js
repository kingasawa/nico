
module.exports.validate = {
  paymentRequestRule : {
    ref: {
      presence: true,
      format: {
        pattern: "[a-zA-Z0-9]{1,}",
        flags: "i",
        message: "REF must be [REFID]"
      }
    },
    amount: {
      presence: true,
      numericality: {
        greaterThan: 0,
        message: 'must be a number > 0'
      },
    },
    currency: {
      presence: true,
      inclusion: {
        within: ["USD", "usd"],
        message: `%{value} Not supported`
      }
    },
  }
}


