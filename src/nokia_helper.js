'use strict';

var _ = require('lodash');

const WEIGHT_CODE = 1,
 FAT_CODE = 6;

var filter = function (data, code) {
  if (data.body.measuregrps.length !== 0) {
    let weight = _.filter(data.body.measuregrps[0].measures, {type: code});
    if (weight.length !== 0) {
      if (weight[0].unit === 0)
        return weight[0].value;
      return weight[0].value / Math.pow(10, Math.abs(weight[0].unit));
    }
  }
  return 0;
};

module.exports = {
  get_weight: function (data) {
    return filter(data, WEIGHT_CODE);
  },

  get_fat: function (data) {
    return filter(data, FAT_CODE);
  }

};