'use strict';

var fs = require('fs-extra'),
    config = require("../config.json"),
    config_nokia = require('../config.json').nokia,
    logger = require('./logger'),
    request = require('request-promise');

let write_config = function (data) {
    let token = JSON.parse(data);
    let access_token = token.access_token;
    let refresh_token = token.refresh_token;
    config_nokia.access_token = access_token;
    config_nokia.refresh_token = refresh_token;
    let path_to_file = config.path_to_file;
    let refresh_json = {
        access_token: access_token,
        refresh_token: refresh_token
    };
    fs.writeJson(path_to_file + '/refresh_token_nokia.json', refresh_json)
        .then(() => {
            logger.info("Nokia: Configuration override");
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
            refresh_token = require('../refresh_token_nokia.json').refresh_token;
        } catch (e) {
            refresh_token = config_nokia.refresh_token;
        }
        let options = {
            uri: "https://account.withings.com/oauth2/token",
            form: {
                "grant_type": "refresh_token",
                "client_id": config_nokia.client_id,
                "client_secret": config_nokia.client_secret,
                "refresh_token": refresh_token
            }
        };
        return request.post(options)
            .then(write_config).catch(err => logger.error(err));
    },


    get_last_weight: () => {
        let options = {
            uri: "https://wbsapi.withings.net/measure",
            qs: {
                action: "getmeas",
                access_token: config_nokia.access_token
            }
        };
        return request.get(options).then(data => JSON.parse(data));
    }
};
