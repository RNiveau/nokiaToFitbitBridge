'use strict';

var config_nokia = require('./config.json').nokia,
    request = require('request-promise');

module.exports = {
  get_data: () => {
    let options = {
      uri: "http://api.health.nokia.com/measure",
      qs: {
        action: "getmeas",
        oauth_consumer_key: config_nokia.api_key,
        oauth_nonce: "2e1e09a40d76128c8303fa4ee3da792b",
        oauth_signature: config_nokia.api_signature,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: new Date().getTime(),
        oauth_token: config_nokia.api_token,
        oauth_version: "1.0",
        userid: config_nokia.user_id
      }
    };
    return request.get(options);
  }
}