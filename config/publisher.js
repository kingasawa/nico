module.exports.publisher = {
  //control activeness of publisher
  //its active by default
  active: true,

  //default key prefix for kue in
  //redis server
  prefix: 'q',

  //default redis configuration
  redis: {
    //default redis server port
    port: 6380,
    //default redis server host
    host: '127.0.0.1'
  },
  //number of milliseconds
  //to wait
  //before shutdown publisher
  shutdownDelay: 5000
}
