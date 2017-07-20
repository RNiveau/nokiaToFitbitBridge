'use strict';

var assert = require('assert'),
    nokia_helper = require('../src/nokia_helper'),
    data = require('./data/nokia.json');

describe('Nokia helper', function () {
  describe('get_weight', function () {

    it('should return 57.364 from nokia json', function () {
      assert.equal(nokia_helper.get_weight(data), 57.364);
    });

    it('should return 0 when no measure is present', function () {
      data.body.measuregrps = [];
      assert.equal(nokia_helper.get_weight(data), 0);

      data.body.measuregrps = [{measures: []}];
      assert.equal(nokia_helper.get_weight(data), 0);
    });

  });
});