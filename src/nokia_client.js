'use strict';

var config_nokia = require('../config.json').nokia,
    moment = require('moment'),
    request = require('request-promise');

module.exports = {
  get_last_weight: () => {
    let options = {
      uri: "https://wbsapi.withings.net/measure",
      qs: {
        action: "getmeas",
        access_token: config_nokia.api_token
      }
    };
    return request.get(options).then(data => JSON.parse(data));
  }
};
