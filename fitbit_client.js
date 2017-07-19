'use strict';

var config = require('./config.json'),
    config_fitbit = config.fitbit,
    fs = require('fs-extra'),
    request = require('request-promise');
    // require('request-debug')(request);


var access_token = config_fitbit.access_token;
var refresh_token = config_fitbit.refresh_token;

module.exports = {

  refresh_token: () => {
    let options = {
      url: "https://api.fitbit.com/oauth2/token",
      headers: {
        Authorization: 'Basic ' + new Buffer(config_fitbit.client_id + ":"
                       + config_fitbit.api_secret).toString('base64')
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }
    };
    return request.post(options)
        .then(data => {
          let token = JSON.parse(data);
          access_token = token.access_token;
          refresh_token = token.refresh_token;
          config_fitbit.access_token = access_token;
          config_fitbit.refresh_token = refresh_token;
          fs.writeJson('./config.json', config)
              .then(() => {
                console.log('success!')
              })
              .catch(err => {
                console.error(err)
              });
          return data;
        });
  },

  get_weight_to_date: function (date) {
    let self = this;
    let options = {
      uri: "https://api.fitbit.com/1/user/-/body/log/weight/date/"+date+".json",
      headers: {
        Authorization: 'Bearer ' + access_token
      }
    };
    return request.get(options)
        .catch(error => {
          if (error.response.statusCode === 401) {
            let json_error = JSON.parse(error.response.body);
            if (json_error.errors[0].errorType === "expired_token") {
              return self.refresh_token().then(() => self.get_weight_to_date(date));
            } else {
              throw new Error(error.response.body);
            }
          }
        });
  }
};