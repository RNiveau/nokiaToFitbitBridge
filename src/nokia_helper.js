'use strict';

var _ = require('lodash');

const WEIGHT_CODE = 1;

module.exports = {
  get_weight: function (data) {
    if (data.body.measuregrps.length !== 0) {
      let weight = _.filter(data.body.measuregrps[0].measures, {type: WEIGHT_CODE});
      if (weight.length !== 0) {
        if (weight[0].unit === 0)
          return weight[0].value;
        return weight[0].value / Math.pow(10, Math.abs(weight[0].unit));
      }
    }
    return 0;
  }
};