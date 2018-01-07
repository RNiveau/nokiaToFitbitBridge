'use strict';

var fitbit_client = require('./src/fitbit_client'),
    facebook_client = require('./src/facebook_client'),
    logger = require('./src/logger'),
    moment = require('moment'),
    _ = require('lodash');

var configuration = [
    {
      hour: 11,
      consumption: 250
    },
    {
      hour: 15,
      consumption: 250
    },
    {
      hour: 16,
      consumption: 500
    },
    {
      hour: 18,
      consumption: 750
    },
    {
      hour: 21,
      consumption: 1000
    },
    {
      hour: 22,
      consumption: 1200
    }
];

var app = async function () {
    let fitbit_data = await fitbit_client.get_water_to_date(moment().format('YYYY-MM-DD'));
    let hour = moment().format('HH');
    let conf = _.find(configuration, { hour: parseInt(hour)});
    if (conf !== undefined) {
        if (fitbit_data.summary.water < conf.consumption)
            facebook_client.send_message("Drink, you are less than "+conf.consumption+"ml ("+fitbit_data.summary.water+"ml)");
    }
};

try {
  logger.info("Start application");
  app()
      .then(() => logger.info("End application"))
      .catch(error => logger.error(error));
} catch (exception) {
  logger.error(exception);
}
