'use strict';

var assert = require('assert'),
    helpers = require('../lib/helpers');

var haystack = [
    {
      prop: 'a',
      propb: 'b'
    },
    {
      prop: 'c',
      propb: 'd'
    }
];

var classBlock =
    {
      type: 'class',
      content:
          [
              {
                type: 'ident',
                content: 'foo',
                syntax: 'scss',
                start: { line: 5, column: 2 },
                end: { line: 5, column: 4 },
                indexHasChanged: [ 0 ]
              }
          ],
      syntax: 'scss',
      start: { line: 5, column: 1 },
      end: { line: 5, column: 4 },
      indexHasChanged: [ 0 ]
    },

    otherClassBlock =
    {
      type: 'class',
      content:
          [
              {
                type: 'ident',
                content: 'test',
                syntax: 'scss',
                start: { line: 9, column: 2 },
                end: { line: 9, column: 5 },
                indexHasChanged: [ 0 ]
              }
          ],
      syntax: 'scss',
      start: { line: 9, column: 1 },
      end: { line: 9, column: 5 },
      indexHasChanged: [ 0 ]
    };

var detectTestA = {
      line: 1,
      column: 1
    },

    detectTestB = {
      line: 2,
      column: 2
    },

    detectTestC = {
      line: 1,
      column: 2
    };


describe('helpers', function () {

  //////////////////////////////
  // Helpers is loaded
  //////////////////////////////

  it('helpers should not be undefined', function (done) {

    var loaded = typeof (helpers) === 'object' ? true : false;

    assert.equal(true, loaded);
    done();
  });

  //////////////////////////////
  // propertySearch
  //////////////////////////////

  it('propertySearch should not find a property', function (done) {

    var needle = 'e',
        property = 'prop',
        result = helpers.propertySearch(haystack, needle, property);

    assert.equal(-1, result);
    done();
  });

  it('propertySearch should find a property', function (done) {

    var needle = 'a',
        property = 'prop',
        result = helpers.propertySearch(haystack, needle, property);

    assert.equal(0, result);
    done();
  });

  it('propertySearch should find a deeper property', function (done) {

    var needle = 'd',
        property = 'propb',
        result = helpers.propertySearch(haystack, needle, property);

    assert.equal(1, result);
    done();
  });

  //////////////////////////////
  // isEqual
  //////////////////////////////

  it('isEqual should return true', function (done) {

    var testBlock =
        {
          type: 'class',
          content:
              [
                  {
                    type: 'ident',
                    content: 'foo',
                    syntax: 'scss',
                    start: { line: 5, column: 2 },
                    end: { line: 5, column: 4 },
                    indexHasChanged: [ 0 ]
                  }
              ],
          syntax: 'scss',
          start: { line: 5, column: 1 },
          end: { line: 5, column: 4 },
          indexHasChanged: [ 0 ]
        },
        result = helpers.isEqual(classBlock, testBlock);

    assert.equal(true, result);
    done();
  });

  it('isEqual should return false - [objA.type !== objB.type]', function (done) {

    var testBlock = {
          type: 'block',
          start: {line: 5},
          end: {line: 5},
          content: [1]
        },
        result = helpers.isEqual(classBlock, testBlock);

    assert.equal(false, result);
    done();
  });

  it('isEqual should return false - [objA.start.line !== objB.start.line]', function (done) {

    var testBlock = {
          type: 'class',
          start: {line: 7},
          end: {line: 5},
          content: [1]
        },
        result = helpers.isEqual(classBlock, testBlock);

    assert.equal(false, result);
    done();
  });

  it('isEqual should return false - [objA.end.line !== objB.end.line]', function (done) {

    var testBlock = {
          type: 'class',
          start: {line: 5},
          end: {line: 7},
          content: [1]
        },
        result = helpers.isEqual(classBlock, testBlock);

    assert.equal(false, result);
    done();
  });

  it('isEqual should return false - [objA.content.length !== objB.content.length]', function (done) {

    var testBlock = {
          type: 'class',
          start: {line: 5},
          end: {line: 5},
          content: [1, 2, 3, 4]
        },
        result = helpers.isEqual(classBlock, testBlock);

    assert.equal(false, result);
    done();
  });

  //////////////////////////////
  // isUnique
  //////////////////////////////

  it('isUnique should return false - [objA === objB]', function (done) {


    var ledger = [];
    ledger.push(classBlock);

    var result = helpers.isUnique(ledger, classBlock);

    assert.equal(false, result);
    done();
  });

  it('isUnique should return true - [objA !== objB]', function (done) {


    var ledger = [];
    ledger.push(classBlock);

    var result = helpers.isUnique(ledger, otherClassBlock);

    assert.equal(false, result);
    done();
  });

  //////////////////////////////
  // addUnique
  //////////////////////////////

  it('addUnique should return a modified results array - [objA !== objB]', function (done) {

    var ledger = [];
    ledger.push(classBlock);

    var result = helpers.addUnique(ledger, otherClassBlock);

    ledger.push(otherClassBlock);

    assert.equal(ledger, result);
    done();
  });

  it('addUnique should return an unmodified results array - [objA === objB]', function (done) {

    var ledger = [];
    ledger.push(classBlock);

    var result = helpers.addUnique(ledger, classBlock);

    assert.equal(ledger, result);
    done();
  });

  //////////////////////////////
  // sortDetects
  //////////////////////////////

  it('sortDetects should return -1 - [a.line < b.line]', function (done) {

    var result = helpers.sortDetects(detectTestA, detectTestB);

    assert.equal(-1, result);
    done();
  });

  it('sortDetects should return 1 - [a.line > b.line]', function (done) {

    var result = helpers.sortDetects(detectTestB, detectTestA);

    assert.equal(1, result);
    done();
  });

  it('sortDetects should return 0 - [a === b]', function (done) {

    var result = helpers.sortDetects(detectTestA, detectTestA);

    assert.equal(0, result);
    done();
  });

  it('sortDetects should return -1 - [a.column < b.column]', function (done) {

    var result = helpers.sortDetects(detectTestA, detectTestC);

    assert.equal(-1, result);
    done();
  });

  it('sortDetects should return 1 - [a.column > b.column]', function (done) {

    var result = helpers.sortDetects(detectTestC, detectTestA);

    assert.equal(1, result);
    done();
  });

  //////////////////////////////
  // isNumber
  //////////////////////////////

  it('isNumber - [10 - true]', function (done) {

    var result = helpers.isNumber(10);

    assert.equal(true, result);
    done();
  });

  it('isNumber - [\'10\' - true]', function (done) {

    var result = helpers.isNumber('10');

    assert.equal(true, result);
    done();
  });

  it('isNumber - [\'ten\' - false]', function (done) {

    var result = helpers.isNumber('ten');

    assert.equal(false, result);
    done();
  });

  it('isNumber - [\'ff00ff\' - false]', function (done) {

    var result = helpers.isNumber('ff00ff');

    assert.equal(false, result);
    done();
  });

  //////////////////////////////
  // isUpperCase
  //////////////////////////////

  it('isUpperCase - [\'TEST\' - true]', function (done) {

    var result = helpers.isUpperCase('TEST');

    assert.equal(true, result);
    done();
  });

  it('isUpperCase - [\'test\' - false]', function (done) {

    var result = helpers.isUpperCase('test');

    assert.equal(false, result);
    done();
  });

  it('isUpperCase - [abcDEF - false]', function (done) {

    var result = helpers.isUpperCase('abcDEF');

    assert.equal(false, result);
    done();
  });

  it('isUpperCase - [\'123\' - false]', function (done) {

    var result = helpers.isUpperCase('123');

    assert.equal(false, result);
    done();
  });

  //////////////////////////////
  // isLowerCase
  //////////////////////////////

  it('isLowerCase - [\'TEST\' - false]', function (done) {

    var result = helpers.isLowerCase('TEST');

    assert.equal(false, result);
    done();
  });

  it('isLowerCase - [\'test\' - true]', function (done) {

    var result = helpers.isLowerCase('test');

    assert.equal(true, result);
    done();
  });

  it('isLowerCase - [abcDEF - false]', function (done) {

    var result = helpers.isLowerCase('abcDEF');

    assert.equal(false, result);
    done();
  });

  it('isLowerCase - [\'123\' - false]', function (done) {

    var result = helpers.isLowerCase('123');

    assert.equal(false, result);
    done();
  });

  //////////////////////////////
  // isValidHex
  //////////////////////////////

  it('isValidHex - [\'abcdef\' - true]', function (done) {

    var result = helpers.isValidHex('abcdef');

    assert.equal(true, result);
    done();
  });

  it('isValidHex - [\'ABCDEF\' - true]', function (done) {

    var result = helpers.isValidHex('ABCDEF');

    assert.equal(true, result);
    done();
  });

  it('isValidHex - [\'123456\' - true]', function (done) {

    var result = helpers.isValidHex('123456');

    assert.equal(true, result);
    done();
  });

  it('isValidHex - [\'ABC123\' - true]', function (done) {

    var result = helpers.isValidHex('ABC123');

    assert.equal(true, result);
    done();
  });

  it('isValidHex - [\'abc123\' - true]', function (done) {

    var result = helpers.isValidHex('abc123');

    assert.equal(true, result);
    done();
  });

  it('isValidHex - [\'fff\' - true]', function (done) {

    var result = helpers.isValidHex('fff');

    assert.equal(true, result);
    done();
  });

  it('isValidHex - [\'123\' - true]', function (done) {

    var result = helpers.isValidHex('123');

    assert.equal(true, result);
    done();
  });

  it('isValidHex - [\'efghij\' - false]', function (done) {

    var result = helpers.isValidHex('efghij');

    assert.equal(false, result);
    done();
  });

  it('isValidHex - [\'thj\' - false]', function (done) {

    var result = helpers.isValidHex('thj');

    assert.equal(false, result);
    done();
  });

  it('isValidHex - [\'ab\' - false]', function (done) {

    var result = helpers.isValidHex('ab');

    assert.equal(false, result);
    done();
  });

  it('isValidHex - [\'12\' - false]', function (done) {

    var result = helpers.isValidHex('12');

    assert.equal(false, result);
    done();
  });

  it('isValidHex - [\'1234567\' - false]', function (done) {

    var result = helpers.isValidHex('1234567');

    assert.equal(false, result);
    done();
  });

  it('isValidHex - [\'abc1234\' - false]', function (done) {

    var result = helpers.isValidHex('abc1234');

    assert.equal(false, result);
    done();
  });

  //////////////////////////////
  // loadConfigFile
  //////////////////////////////

  it('loadConfigFile', function (done) {

    var result = helpers.loadConfigFile('../../tests/testFile.txt'),
        expect = 'This is a test file that test\'s the loadConfigFile helper function.';

    assert.equal(expect, result);
    done();
  });

  //////////////////////////////
  // hasEOL
  //////////////////////////////

  it('hasEOL - [\'\\n\' - true]', function (done) {

    var result = helpers.hasEOL('\n');

    assert.equal(true, result);
    done();
  });

  it('hasEOL - [\'\\r\\n\' - true]', function (done) {

    var result = helpers.hasEOL('\r\n');

    assert.equal(true, result);
    done();
  });

  //////////////////////////////
  // isEmptyLine
  //////////////////////////////

  it('isEmptyLine - [\'\\n\\n\' - true]', function (done) {

    var result = helpers.isEmptyLine('\n\n');

    assert.equal(true, result);
    done();
  });

  it('isEmptyLine - [\'\\r\\n\\r\\n\' - true]', function (done) {

    var result = helpers.isEmptyLine('\r\n\r\n');

    assert.equal(true, result);
    done();
  });

  it('isEmptyLine - [\'\\n \\n\' - false]', function (done) {

    var result = helpers.isEmptyLine('\n \n');

    assert.equal(false, result);
    done();
  });

  it('isEmptyLine - [\'\\r\\nabc\\r\\n\' - false]', function (done) {

    var result = helpers.isEmptyLine('\r\nabc\r\n');

    assert.equal(false, result);
    done();
  });

  //////////////////////////////
  // stripPrefix
  //////////////////////////////

  it('stripPrefix - [-webkit-transition - transition]', function (done) {

    var result = helpers.stripPrefix('-webkit-transition');

    assert.equal('transition', result);
    done();
  });

  it('stripPrefix - [-moz-transition - transition]', function (done) {

    var result = helpers.stripPrefix('-moz-transition');

    assert.equal('transition', result);
    done();
  });

  it('stripPrefix - [-webkit-border-color - border-color]', function (done) {

    var result = helpers.stripPrefix('-webkit-border-color');

    assert.equal('border-color', result);
    done();
  });

});
