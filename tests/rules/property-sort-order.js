'use strict';

var lint = require('./_lint');

var file = lint.file('property-sort-order.scss');

describe('property sort order', function () {
  it('[order: alphabetical]', function (done) {
    lint.test(file, {
      'property-sort-order': 1
    }, function (data) {
      lint.assert.equal(6, data.warningCount);
      done();
    });
  });

  it('[order: custom]', function (done) {
    lint.test(file, {
      'property-sort-order': [
        1,
        {
          'order': [
            'height',
            'width',
            'display',
            'color'
          ]
        }
      ]
    }, function (data) {
      lint.assert.equal(4, data.warningCount);
      done();
    });
  });

  it('[order: recess]', function (done) {
    lint.test(file, {
      'property-sort-order': [
        1,
        {
          'order': 'recess'
        }
      ]
    }, function (data) {
      lint.assert.equal(5, data.warningCount);
      done();
    });
  });

  it('[order: smacss]', function (done) {
    lint.test(file, {
      'property-sort-order': [
        1,
        {
          'order': 'smacss'
        }
      ]
    }, function (data) {
      lint.assert.equal(5, data.warningCount);
      done();
    });
  });

  it('[order: concentric]', function (done) {
    lint.test(file, {
      'property-sort-order': [
        1,
        {
          'order': 'concentric'
        }
      ]
    }, function (data) {
      lint.assert.equal(7, data.warningCount);
      done();
    });
  });
});
