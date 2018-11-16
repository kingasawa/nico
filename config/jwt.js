/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on any of these options, check out:
 * https://sailsjs.com/config/globals
 */

module.exports.jwt = {
  tokenSecret:  "abcD1213123102381209)(*)(*!#)(oId",
  expireAt: 15 * 60 //in second
}


