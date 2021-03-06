'use strict';

var config = require('../config.json'),
    config_fitbit = config.fitbit,
    fs = require('fs-extra'),
    logger = require('./logger'),
    request = require('request-promise');
// require('request-debug')(request);

var access_token = config_fitbit.access_token;
var refresh_token = config_fitbit.refresh_token;

let write_config = function (data) {
  let token = JSON.parse(data);
  access_token = token.access_token;
  refresh_token = token.refresh_token;
  config_fitbit.access_token = access_token;
  config_fitbit.refresh_token = refresh_token;
  let path_to_file = config.path_to_file;
  let refresh_json = {
    refresh_token: refresh_token
  };
  fs.writeJson(path_to_file + '/refresh_token.json', refresh_json)
      .then(() => {
        logger.info("Fitbit: Configuration override");
      })
      .catch(err => {
        logger.error(err);
      });
  return data;
};

module.exports = {

  refresh_token: () => {
    let refresh_token;
    try {
      refresh_token = require('../refresh_token.json').refresh_token;
    } catch (e) {
      refresh_token = config_fitbit.refresh_token;
    }
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
        .then(write_config);
  },

  get_weight_to_date: function (date) {
    let self = this;
    let options = {
      uri: "https://api.fitbit.com/1/user/-/body/log/weight/date/" + date + ".json",
      headers: {
        Authorization: 'Bearer ' + access_token
      }
    };
    return request.get(options)
        .then(data => JSON.parse(data))
        .catch(error => {
          if (error.response.statusCode === 401) {
            let json_error = JSON.parse(error.response.body);
            if (json_error.errors[0].errorType === "expired_token") {
              logger.info("Fitbit: Need to refresh token for fitbit");
              return self.refresh_token().then(() => self.get_weight_to_date(date));
            } else {
              throw new Error(error.response.body);
            }
          }
        });
  },

  get_water_to_date: function (date) {
    let self = this;
    let options = {
      uri: "https://api.fitbit.com/1/user/-/foods/log/water/date/" + date + ".json",
      headers: {
        Authorization: 'Bearer ' + access_token
      }
    };
    return request.get(options)
        .then(data => JSON.parse(data))
        .catch(error => {
          if (error.response.statusCode === 401) {
            let json_error = JSON.parse(error.response.body);
            if (json_error.errors[0].errorType === "expired_token") {
              logger.info("Fitbit: Need to refresh token for fitbit");
              return self.refresh_token().then(() => self.get_water_to_date(date));
            } else {
              throw new Error(error.response.body);
            }
          }
        });
  },

  post_new_weight: function (weight, date, time) {
    let self = this;
    let options = {
      url: 'https://api.fitbit.com/1/user/-/body/log/weight.json',
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Accept-Language': 'fr_FR'
      },
      form: {
        weight: weight,
        date: date,
        time: time
      }
    };
    return request.post(options)
        .then(data => JSON.parse(data))
        .catch(error => {
          if (error.response.statusCode === 401) {
            let json_error = JSON.parse(error.response.body);
            if (json_error.errors[0].errorType === "expired_token") {
              logger.info("Fitbit: Need to refresh token for fitbit");
              return self.refresh_token().then(() => self.post_new_weight(weight, date, time));
            } else {
              throw new Error(error.response.body);
            }
          }
        });
  },

  post_new_fat: function (fat, date, time) {
    let self = this;
    let options = {
      url: 'https://api.fitbit.com/1/user/-/body/log/fat.json',
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Accept-Language': 'fr_FR'
      },
      form: {
        fat: fat,
        date: date,
        time: time
      }
    };
    return request.post(options).catch(error => {
      if (error.response.statusCode === 401) {
        let json_error = JSON.parse(error.response.body);
        if (json_error.errors[0].errorType === "expired_token") {
          logger.info("Fitbit: Need to refresh token for fitbit");
          return self.refresh_token().then(() => self.post_new_fat(weight, date, time));
        } else {
          throw new Error(error.response.body);
        }
      }
    });
  }
};
