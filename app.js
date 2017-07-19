'use strict';

var nokia_client = require('./nokia_client'),
    fitbit_client = require('./fitbit_client'),
    date_format = require('date-format');

var app = async function () {

  let data = await nokia_client.get_last_weight();
  console.log(data);
  data = await fitbit_client.get_weight_to_date(date_format.asString('yyyy-MM-dd'));
  console.log(data);
};

app();