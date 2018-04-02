'use strict';

var config_nokia = require('../config.json').nokia,
    moment = require('moment'),
    request = require('request-promise');

module.exports = {
  get_last_weight: () => {
    let options = {
      uri: "http://api.health.nokia.com/measure",
      qs: {
        action: "getmeas",
        oauth_consumer_key: config_nokia.api_key,
        oauth_nonce: config_nokia.nonce,
        oauth_signature: config_nokia.api_signature,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: config_nokia.timestamp,
        oauth_token: config_nokia.api_token,
        oauth_version: "1.0",
        userid: config_nokia.user_id
      }
    };
    return request.get(options).then(data => JSON.parse(data));
  }
};