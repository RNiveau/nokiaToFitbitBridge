'use strict';

var assert = require('assert'),
    nokia_helper = require('../src/nokia_helper'),
    _ = require('lodash'),
    data = require('./data/nokia.json');

describe('Nokia helper', function () {
  describe('get_weight', function () {

    it('should return 57.364 from nokia json', function () {
      assert.equal(nokia_helper.get_weight(data), 57.364);
    });

    it('should return 57364 from nokia json with 0 as unit', function () {
      let copy_data = _.cloneDeep(data);
      copy_data.body.measuregrps[0].measures[0].unit = 0;
      assert.equal(nokia_helper.get_weight(copy_data), 57364);
    });

    it('should return 0 when no measure is present', function () {
      let copy_data = _.cloneDeep(data);
      copy_data.body.measuregrps = [];
      assert.equal(nokia_helper.get_weight(copy_data), 0);

      copy_data.body.measuregrps = [{measures: []}];
      assert.equal(nokia_helper.get_weight(copy_data), 0);
    });

  });
});