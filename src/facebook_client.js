'use strict';

var config = require('../config.json'),
    config_facebook = config.facebook,
    logger = require('./logger'),
    request = require('request-promise');
 require('request-debug')(request);

module.exports = {

  send_message: function (message) {
    let self = this;
    let options = {
      method: "POST",
      uri: "https://graph.facebook.com/v2.6/me/messages?access_token="+config_facebook.page_id,
      body: {
          "messaging_type": "UPDATE",
          "recipient": {
            "id": config_facebook.sender_id
          },
          "message": {
            "text": "hello, world!"
          }
      },
      json: true
    };
    return request(options)
        .then(data => {result: 'ok'})
        .catch(error => {
            logger.error(error);
        });
  }
};
