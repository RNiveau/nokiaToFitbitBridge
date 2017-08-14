'use strict';

var fitbit_client = require('./src/fitbit_client'),
    logger = require('./src/logger'),
    moment = require('moment');

var app = async function () {
    await fitbit_client.refresh_token();
    let fitbit_data = await fitbit_client.get_weight_to_date(moment().format('YYYY-MM-DD'));
    logger.debug(fitbit_data);
};

try {
  logger.info("Start test fitbit");
  app()
      .then(() => logger.info("End test fitbit"))
      .catch(error => logger.error(error));
} catch (exception) {
  logger.error(exception);
}
