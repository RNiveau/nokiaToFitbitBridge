'use strict';

var nokia_client = require('./nokia_client');

var app = async function () {

  let data = await nokia_client.get_data();

  console.log(data);
}

app();