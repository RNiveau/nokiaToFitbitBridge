'use strict';

var nokia_client = require('./src/nokia_client'),
    logger = require('./src/logger');

var app = async function () {
    await nokia_client.refresh_token();
    let nokia_data = await nokia_client.get_last_weight();
    logger.debug(nokia_data);
};

try {
  logger.info("Start test nokia");
  app()
      .catch(error => logger.error(error));
} catch (exception) {
  logger.error(exception);
}
