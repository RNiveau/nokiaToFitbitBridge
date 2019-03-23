'use strict';

var nokia_client = require('./src/nokia_client'),
    fitbit_client = require('./src/fitbit_client'),
    logger = require('./src/logger'),
    nokia_helper = require('./src/nokia_helper'),
    moment = require('moment');

var app = async function () {

  nokia_client.refresh_token()
  let nokia_data = await nokia_client.get_last_weight();
  if (nokia_data.body.measuregrps.length == 0) {
    logger.info('No data from nokia');
    return Promise.resolve({});
  }
  let date = moment.unix(nokia_data.body.measuregrps[0].date);
  if (moment(date).isSame(moment(), 'day')) {
    let fitbit_data = await fitbit_client.get_weight_to_date(moment().format('YYYY-MM-DD'));
    if (fitbit_data.weight.length != 0) {
      logger.info('Fitbit data already exist');
    } else {
      let weight = nokia_helper.get_weight(nokia_data);
      let fat = nokia_helper.get_fat(nokia_data);
      await fitbit_client.post_new_weight(weight, date.format('YYYY-MM-DD'),
                                          date.format('HH:mm:ss'));
      await fitbit_client.post_new_fat(fat, date.format('YYYY-MM-DD'), date.format('HH:mm:ss'));
      logger.info("New data save at %s: %s, %s", date, weight, fat);
    }
  } else {
    logger.info('No data to push to fitbit');
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
