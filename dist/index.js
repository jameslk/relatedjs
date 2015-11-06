(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.relatedjs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = _dereq_("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = _dereq_("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = _dereq_("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = _dereq_("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = _dereq_("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _from = _dereq_("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _map = _dereq_("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Support class for bi-directional key-value maps used internally to power
 * storing relationships for a `Graph`.
 */

var Bimap = (function () {
    function Bimap() {
        (0, _classCallCheck3.default)(this, Bimap);

        this._keys = new _map2.default();
        this._values = new _map2.default();
    }

    (0, _createClass3.default)(Bimap, [{
        key: "set",
        value: function set(key, value) {
            this._removeLinksToKey(key);
            this._removeLinksToValue(value);
            this._setKeyLinkTo(key, value);
            this._setValueLinkTo(value, key);
        }
    }, {
        key: "appendValueToKey",
        value: function appendValueToKey(key, value) {
            this._removeLinksToValue(value);
            this._appendKeyLinkTo(key, value);
            this._setValueLinkTo(value, key);
        }
    }, {
        key: "appendKeyToValue",
        value: function appendKeyToValue(key, value) {
            this._removeLinksToKey(key);
            this._appendValueLinkTo(value, key);
            this._setKeyLinkTo(key, value);
        }
    }, {
        key: "append",
        value: function append(key, value) {
            this._appendKeyLinkTo(key, value);
            this._appendValueLinkTo(value, key);
        }
    }, {
        key: "remove",
        value: function remove(key, value) {
            if (this.has(key, value)) {
                this._removeKeyLinkTo(key, value);
                this._removeValueLinkTo(value, key);
            }
        }
    }, {
        key: "removeKey",
        value: function removeKey(key) {
            this._removeLinksToKey(key);
            this._keys.delete(key);
        }
    }, {
        key: "removeValue",
        value: function removeValue(value) {
            this._removeLinksToValue(value);
            this._values.delete(value);
        }
    }, {
        key: "getKeyValues",
        value: function getKeyValues(key) {
            return this._keys.get(key);
        }
    }, {
        key: "getValueKeys",
        value: function getValueKeys(value) {
            return this._values.get(value);
        }
    }, {
        key: "has",
        value: function has(key, value) {
            return this._keys.has(key) && this._keys.get(key).has(value);
        }
    }, {
        key: "toLiteral",
        value: function toLiteral() {
            var keys = {};

            this._keys.forEach(function (values, key) {
                keys[key] = (0, _from2.default)(values);
            });

            var values = {};

            this._values.forEach(function (keys, value) {
                values[value] = (0, _from2.default)(keys);
            });

            return { keys: keys, values: values };
        }
    }, {
        key: "_setKeyLinkTo",
        value: function _setKeyLinkTo(key, value) {
            this._keys.set(key, new _set2.default([value]));
        }
    }, {
        key: "_appendKeyLinkTo",
        value: function _appendKeyLinkTo(key, value) {
            var keyLinks = this._keys.get(key) || new _set2.default();
            keyLinks.add(value);
            this._keys.set(key, keyLinks);
        }
    }, {
        key: "_setValueLinkTo",
        value: function _setValueLinkTo(value, key) {
            this._values.set(value, new _set2.default([key]));
        }
    }, {
        key: "_appendValueLinkTo",
        value: function _appendValueLinkTo(value, key) {
            var valueLinks = this._values.get(value) || new _set2.default();
            valueLinks.add(key);
            this._values.set(value, valueLinks);
        }
    }, {
        key: "_removeKeyLinkTo",
        value: function _removeKeyLinkTo(key, value) {
            var keyLinks = this._keys.get(key);

            if (keyLinks && keyLinks.size > 1) {
                keyLinks.delete(value);
            } else {
                this._keys.delete(key);
            }
        }
    }, {
        key: "_removeValueLinkTo",
        value: function _removeValueLinkTo(value, key) {
            var valueLinks = this._values.get(value);

            if (valueLinks && valueLinks.size > 1) {
                valueLinks.delete(key);
            } else {
                this._values.delete(value);
            }
        }
    }, {
        key: "_removeLinksToKey",
        value: function _removeLinksToKey(key) {
            var valuesLinkingToKey = this._keys.get(key);

            if (!valuesLinkingToKey) {
                return;
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(valuesLinkingToKey), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var value = _step3.value;

                    this._removeValueLinkTo(value, key);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: "_removeLinksToValue",
        value: function _removeLinksToValue(value) {
            var keysLinkingToValue = this._values.get(value);

            if (!keysLinkingToValue) {
                return;
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = (0, _getIterator3.default)(keysLinkingToValue), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var key = _step4.value;

                    this._removeKeyLinkTo(key, value);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }], [{
        key: "merge",
        value: function merge(bimap1, bimap2) {
            var resultBimap = new this();

            resultBimap._keys = this._mergeMapSets([new _map2.default(), bimap1._keys, bimap2._keys]);

            resultBimap._values = this._mergeMapSets([new _map2.default(), bimap1._values, bimap2._values]);

            return resultBimap;
        }
    }, {
        key: "replace",
        value: function replace(bimap1, bimap2) {
            var resultBimap = new this();

            var excludedKeyValues = new _set2.default(bimap2._values.keys());
            var excludedValueKeys = new _set2.default(bimap2._keys.keys());

            resultBimap._values = this._mergeMapSets([this._newFilteredMapSet(bimap1._values, excludedKeyValues, excludedValueKeys), bimap2._values]);

            resultBimap._keys = this._mergeMapSets([this._newFilteredMapSet(bimap1._keys, excludedValueKeys, excludedKeyValues), bimap2._keys]);

            return resultBimap;
        }
    }, {
        key: "mergeKeysReplaceValues",
        value: function mergeKeysReplaceValues(bimap1, bimap2) {
            var resultBimap = new this();

            var excludedKeyValues = new _set2.default(bimap2._values.keys());

            resultBimap._values = this._mergeMapSets([this._newFilteredMapSet(bimap1._values, excludedKeyValues), bimap2._values]);

            var excludedValueKeys = new _set2.default(_regenerator2.default.mark(function _callee() {
                var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, valueKeys;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                        case 0:
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context.prev = 3;
                            _iterator = (0, _getIterator3.default)(bimap2._values);

                        case 5:
                            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                _context.next = 11;
                                break;
                            }

                            valueKeys = _step.value;
                            return _context.delegateYield(valueKeys, "t0", 8);

                        case 8:
                            _iteratorNormalCompletion = true;
                            _context.next = 5;
                            break;

                        case 11:
                            _context.next = 17;
                            break;

                        case 13:
                            _context.prev = 13;
                            _context.t1 = _context["catch"](3);
                            _didIteratorError = true;
                            _iteratorError = _context.t1;

                        case 17:
                            _context.prev = 17;
                            _context.prev = 18;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }

                        case 20:
                            _context.prev = 20;

                            if (!_didIteratorError) {
                                _context.next = 23;
                                break;
                            }

                            throw _iteratorError;

                        case 23:
                            return _context.finish(20);

                        case 24:
                            return _context.finish(17);

                        case 25:
                        case "end":
                            return _context.stop();
                    }
                }, _callee, this, [[3, 13, 17, 25], [18,, 20, 24]]);
            })());

            resultBimap._keys = this._mergeMapSets([this._newFilteredMapSet(bimap1._keys, null, excludedValueKeys), bimap2._keys]);

            return resultBimap;
        }
    }, {
        key: "replaceKeysMergeValues",
        value: function replaceKeysMergeValues(bimap1, bimap2) {
            var resultBimap = new this();

            var excludedValueKeys = new _set2.default(bimap2._keys.keys());

            resultBimap._keys = this._mergeMapSets([this._newFilteredMapSet(bimap1._keys, excludedValueKeys), bimap2._keys]);

            var excludedKeyValues = new _set2.default(_regenerator2.default.mark(function _callee2() {
                var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, keyValues;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                        case 0:
                            _iteratorNormalCompletion2 = true;
                            _didIteratorError2 = false;
                            _iteratorError2 = undefined;
                            _context2.prev = 3;
                            _iterator2 = (0, _getIterator3.default)(bimap2._keys);

                        case 5:
                            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                _context2.next = 11;
                                break;
                            }

                            keyValues = _step2.value;
                            return _context2.delegateYield(keyValues, "t0", 8);

                        case 8:
                            _iteratorNormalCompletion2 = true;
                            _context2.next = 5;
                            break;

                        case 11:
                            _context2.next = 17;
                            break;

                        case 13:
                            _context2.prev = 13;
                            _context2.t1 = _context2["catch"](3);
                            _didIteratorError2 = true;
                            _iteratorError2 = _context2.t1;

                        case 17:
                            _context2.prev = 17;
                            _context2.prev = 18;

                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }

                        case 20:
                            _context2.prev = 20;

                            if (!_didIteratorError2) {
                                _context2.next = 23;
                                break;
                            }

                            throw _iteratorError2;

                        case 23:
                            return _context2.finish(20);

                        case 24:
                            return _context2.finish(17);

                        case 25:
                        case "end":
                            return _context2.stop();
                    }
                }, _callee2, this, [[3, 13, 17, 25], [18,, 20, 24]]);
            })());

            resultBimap._values = this._mergeMapSets([this._newFilteredMapSet(bimap1._values, null, excludedKeyValues), bimap2._values]);

            return resultBimap;
        }
    }, {
        key: "_mergeMapSets",
        value: function _mergeMapSets(mapSets) {
            var mergeSets = function mergeSets(set1, set2) {
                return new _set2.default(_regenerator2.default.mark(function _callee3() {
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                        while (1) switch (_context3.prev = _context3.next) {
                            case 0:
                                return _context3.delegateYield(set1, "t0", 1);

                            case 1:
                                return _context3.delegateYield(set2, "t1", 2);

                            case 2:
                            case "end":
                                return _context3.stop();
                        }
                    }, _callee3, this);
                })());
            };

            return mapSets.reduce(function (resultMapSet, mapSet) {
                mapSet.forEach(function (values, key) {
                    var currentValues = resultMapSet.get(key);

                    if (currentValues) {
                        resultMapSet.set(key, mergeSets(currentValues, values));
                    } else {
                        resultMapSet.set(key, values);
                    }
                });

                return resultMapSet;
            });
        }
    }, {
        key: "_newFilteredMapSet",
        value: function _newFilteredMapSet(mapSet) {
            var excludedKeySet = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var excludedValueSet = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            var resultMapSet = new _map2.default();

            mapSet.forEach(function (values, key) {
                if (excludedKeySet && excludedKeySet.has(key)) {
                    return;
                }

                var filteredValues = undefined;

                if (excludedValueSet) {
                    filteredValues = new _set2.default();

                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = (0, _getIterator3.default)(values), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var value = _step5.value;

                            if (!excludedValueSet.has(value)) {
                                filteredValues.add(value);
                            }
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                } else {
                    filteredValues = new _set2.default(values);
                }

                if (!filteredValues.size) {
                    return;
                }

                resultMapSet.set(key, filteredValues);
            });

            return resultMapSet;
        }
    }]);
    return Bimap;
})();

exports.default = Bimap;

},{"babel-runtime/core-js/array/from":6,"babel-runtime/core-js/get-iterator":7,"babel-runtime/core-js/map":9,"babel-runtime/core-js/set":16,"babel-runtime/helpers/classCallCheck":19,"babel-runtime/helpers/createClass":20,"babel-runtime/regenerator":112}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = _dereq_('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = _dereq_('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _slicedToArray2 = _dereq_('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _from = _dereq_('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _assign = _dereq_('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = _dereq_('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = _dereq_('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = _dereq_('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _relationships = _dereq_('./relationships');

var _bimap = _dereq_('./bimap');

var _bimap2 = _interopRequireDefault(_bimap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Stores relationships between different types of nodes. It requires an
 * `array` of `Schema`s to enforce the validity of relationships and govern how it
 * stores and looks up those relationships.
 */

var Graph = (function () {
    function Graph(schemas) {
        (0, _classCallCheck3.default)(this, Graph);

        this._graph = {};

        this._schemas = schemas;
        this._schemaMap = {};

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(schemas), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var schema = _step.value;

                var nodeType = schema.forType;

                if (this._schemaMap.hasOwnProperty(nodeType)) {
                    throw new Error('Schema for node type ' + nodeType + ' should only be' + ' defined once, but occurs multiple times');
                }

                this._schemaMap[schema.forType] = schema;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        this._createGraphRelationships();
    }

    /**
     * Get the original array of `Schema`s that were passed into the constructor.
     *
     * This is enforced read-only because changing the `Schema`s invalidates the
     * internal structure of the `Graph` and its relationships. Instead, a new
     * `Graph` should be created.
     *
     * @returns {array} `Schema`s passed into the constructor.
     */

    (0, _createClass3.default)(Graph, [{
        key: 'setTo',

        /**
         * Set a node's relationship to another node.
         *
         * @param fromNodeType Other type of node.
         * @param fromKey Key of the other node.
         * @param toNodeType Type of node.
         * @param toKey Key of the node.
         * @returns {Graph}
         */
        value: function setTo(fromNodeType, fromKey, toNodeType, toKey) {
            var fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);
            var toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);

            if (!this._isOneToOneRelationship(fromToRelationship, toFromRelationship) && !this._isOneToManyRelationship(fromToRelationship, toFromRelationship) && !this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {

                throw new Error('Unknown relationship' + (' from ' + fromNodeType + ' with "' + fromToRelationship + '"') + (' to ' + toNodeType + ' with "' + toFromRelationship + '"'));
            }

            this._setRelationship(fromNodeType, fromKey, toNodeType, toKey);

            return this;
        }

        /**
         * Set multiple relationships at once. This will overwrite existing associations
         * to the specified nodes.
         *
         * @param fromNodeType
         * @param {array} fromKeys
         * @param toNodeType
         * @param {array} toKeys
         * @returns {Graph}
         */

    }, {
        key: 'setMultiple',
        value: function setMultiple(fromNodeType, fromKeys, toNodeType, toKeys) {
            if (fromKeys.length === 1 && toKeys.length === 1) {
                return this.setTo(fromNodeType, fromKeys[0], toNodeType, toKeys[0]);
            }

            var fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);
            var toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);

            if (this._isOneToOneRelationship(fromToRelationship, toFromRelationship)) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = (0, _getIterator3.default)(fromKeys), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var fromKey = _step2.value;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = (0, _getIterator3.default)(toKeys), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var toKey = _step3.value;

                                this._setRelationship(fromNodeType, fromKey, toNodeType, toKey);
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            } else if (this._isOneToManyRelationship(fromToRelationship, toFromRelationship)) {
                this._removeUsagesBetweenTypes(fromNodeType, fromKeys, toNodeType, toKeys);

                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = (0, _getIterator3.default)(fromKeys), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var fromKey = _step4.value;
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = (0, _getIterator3.default)(toKeys), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var toKey = _step5.value;

                                this._appendOneToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            } else if (this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {
                this._removeUsagesBetweenTypes(fromNodeType, fromKeys, toNodeType, toKeys);

                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = (0, _getIterator3.default)(fromKeys), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var fromKey = _step6.value;
                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            for (var _iterator7 = (0, _getIterator3.default)(toKeys), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                var toKey = _step7.value;

                                this._appendManyToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);
                            }
                        } catch (err) {
                            _didIteratorError7 = true;
                            _iteratorError7 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                    _iterator7.return();
                                }
                            } finally {
                                if (_didIteratorError7) {
                                    throw _iteratorError7;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            } else {
                throw new Error('Unknown relationship' + (' from ' + fromNodeType + ' with "' + fromToRelationship + '"') + (' to ' + toNodeType + ' with "' + toFromRelationship + '"'));
            }

            return this;
        }

        /**
         * Convenience method for {Graph#setTo}. Use it as:
         *
         * ```
         * set(nodeType, nodeKey[, nodeKey2, ...]).to(nodeType, nodeKey[, nodeKey2, ...])
         * ```
         */

    }, {
        key: 'set',
        value: function set(fromNodeType) {
            var _this = this;

            for (var _len = arguments.length, fromKeys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                fromKeys[_key - 1] = arguments[_key];
            }

            return {
                to: function to(toNodeType) {
                    for (var _len2 = arguments.length, toKeys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        toKeys[_key2 - 1] = arguments[_key2];
                    }

                    return _this.setMultiple(fromNodeType, fromKeys, toNodeType, toKeys);
                }
            };
        }

        /**
         * Append a relationship between nodes. This only works for nodes that have a
         * relationship of one-to-many or many-to-many, otherwise it works the same as
         * {Graph#setTo}.
         *
         * @param fromNodeType Other type of node.
         * @param fromKey Key of the other node.
         * @param toNodeType Type of node.
         * @param toKey Key of the node.
         * @returns {Graph}
         */

    }, {
        key: 'appendTo',
        value: function appendTo(fromNodeType, fromKey, toNodeType, toKey) {
            var fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);
            var toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);

            if (this._isOneToOneRelationship(fromToRelationship, toFromRelationship)) {
                this._setRelationship(fromNodeType, fromKey, toNodeType, toKey);
            } else if (this._isOneToManyRelationship(fromToRelationship, toFromRelationship)) {
                this._appendOneToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);
            } else if (this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {
                this._appendManyToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);
            } else {
                throw new Error('Unknown relationship' + (' from ' + fromNodeType + ' with "' + fromToRelationship + '"') + (' to ' + toNodeType + ' with "' + toFromRelationship + '"'));
            }

            return this;
        }

        /**
         * Convenience method for {Graph#appendTo}. Use it as:
         *
         * ```
         * append(nodeType, nodeKey[, nodeKey2, ...]).to(nodeType, nodeKey[, nodeKey2, ...])
         * ```
         */

    }, {
        key: 'append',
        value: function append(fromNodeType) {
            var _this2 = this;

            for (var _len3 = arguments.length, fromKeys = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                fromKeys[_key3 - 1] = arguments[_key3];
            }

            return {
                to: function to(toNodeType) {
                    for (var _len4 = arguments.length, toKeys = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                        toKeys[_key4 - 1] = arguments[_key4];
                    }

                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = (0, _getIterator3.default)(fromKeys), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var fromKey = _step8.value;
                            var _iteratorNormalCompletion9 = true;
                            var _didIteratorError9 = false;
                            var _iteratorError9 = undefined;

                            try {
                                for (var _iterator9 = (0, _getIterator3.default)(toKeys), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                    var toKey = _step9.value;

                                    _this2.appendTo(fromNodeType, fromKey, toNodeType, toKey);
                                }
                            } catch (err) {
                                _didIteratorError9 = true;
                                _iteratorError9 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                        _iterator9.return();
                                    }
                                } finally {
                                    if (_didIteratorError9) {
                                        throw _iteratorError9;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }

                    return _this2;
                }
            };
        }

        /**
         * Removes a relationship between two nodes.
         *
         * @param ofNodeType Other type of node.
         * @param ofKey Key of the other node.
         * @param fromNodeType Type of node.
         * @param fromKey Key of the node.
         * @returns {Graph}
         */

    }, {
        key: 'removeFrom',
        value: function removeFrom(ofNodeType, ofKey, fromNodeType, fromKey) {
            var fromToRelationship = this._lookupRelationship(ofNodeType, fromNodeType);
            var toFromRelationship = this._lookupRelationship(fromNodeType, ofNodeType);

            if (!this._isOneToOneRelationship(fromToRelationship, toFromRelationship) && !this._isOneToManyRelationship(fromToRelationship, toFromRelationship) && !this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {

                throw new Error('Unknown relationship' + (' from ' + fromNodeType + ' with "' + fromToRelationship + '"') + (' to ' + toNodeType + ' with "' + toFromRelationship + '"'));
            }

            this._removeRelationship(ofNodeType, ofKey, fromNodeType, fromKey);

            return this;
        }

        /**
         * Convenience method for {Graph#removeFrom}. Use it as:
         *
         * ```
         * remove(nodeType, nodeKey[, nodeKey2, ...]).from(nodeType, nodeKey[, nodeKey2, ...])
         * ```
         */

    }, {
        key: 'remove',
        value: function remove(ofNodeType) {
            var _this3 = this;

            for (var _len5 = arguments.length, ofKeys = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                ofKeys[_key5 - 1] = arguments[_key5];
            }

            return {
                from: function from(fromNodeType) {
                    for (var _len6 = arguments.length, fromKeys = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                        fromKeys[_key6 - 1] = arguments[_key6];
                    }

                    var _iteratorNormalCompletion10 = true;
                    var _didIteratorError10 = false;
                    var _iteratorError10 = undefined;

                    try {
                        for (var _iterator10 = (0, _getIterator3.default)(ofKeys), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var ofKey = _step10.value;
                            var _iteratorNormalCompletion11 = true;
                            var _didIteratorError11 = false;
                            var _iteratorError11 = undefined;

                            try {
                                for (var _iterator11 = (0, _getIterator3.default)(fromKeys), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                    var fromKey = _step11.value;

                                    _this3.removeFrom(ofNodeType, ofKey, fromNodeType, fromKey);
                                }
                            } catch (err) {
                                _didIteratorError11 = true;
                                _iteratorError11 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                        _iterator11.return();
                                    }
                                } finally {
                                    if (_didIteratorError11) {
                                        throw _iteratorError11;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError10 = true;
                        _iteratorError10 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                _iterator10.return();
                            }
                        } finally {
                            if (_didIteratorError10) {
                                throw _iteratorError10;
                            }
                        }
                    }

                    return _this3;
                }
            };
        }

        /**
         * Removes all relationships between two node types.
         *
         * @param fromNodeType Type of node.
         * @param toNodeType Type of node.
         */

    }, {
        key: 'removeAllBetween',
        value: function removeAllBetween(fromNodeType, toNodeType) {
            if (this._isPrimaryType(fromNodeType, toNodeType)) {
                this._graph[fromNodeType][toNodeType] = new _bimap2.default();
            } else {
                this._graph[toNodeType][fromNodeType] = new _bimap2.default();
            }

            return this;
        }

        /**
         * Removes all relationships of the specified node type.
         *
         * @param nodeType Type of node.
         */

    }, {
        key: 'removeAllOfType',
        value: function removeAllOfType(nodeType) {
            if (!this._schemaMap.hasOwnProperty(nodeType)) {
                throw new Error('No schema exists for nodeType: ' + nodeType);
            }

            var toTypes = (0, _keys2.default)(this._schemaMap[nodeType].relationships);

            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = (0, _getIterator3.default)(toTypes), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var toType = _step12.value;

                    this.removeAllBetween(nodeType, toType);
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            return this;
        }

        /**
         * Removes all relationships with a particular node. This is useful, for example,
         * if the node no longer exists.
         *
         * @param ofNodeType Type of node.
         * @param ofKey Key of the node to disconnect from other nodes.
         */

    }, {
        key: 'removeUsage',
        value: function removeUsage(ofNodeType, ofKey) {
            var _this4 = this;

            (0, _keys2.default)(this._graph).forEach(function (keyNodeType) {
                (0, _keys2.default)(_this4._graph[keyNodeType]).forEach(function (valueNodeType) {
                    var relationships = _this4._graph[keyNodeType][valueNodeType];

                    if (keyNodeType === ofNodeType) {
                        relationships.removeKey(ofKey);
                    } else if (valueNodeType === ofNodeType) {
                        relationships.removeValue(ofKey);
                    }
                });
            });
        }

        /**
         * Get the child's key of a has-one parent node.
         *
         * @param parentType Type of node for the parent node.
         * @param parentKey Key of the parent node.
         * @param childType Type of node for the child node.
         * @returns {*} Key of the child node.
         */

    }, {
        key: 'getChild',
        value: function getChild(parentType, parentKey, childType) {
            var relationship = this._lookupRelationship(parentType, childType);

            if (!(relationship instanceof _relationships.HasOneRelationship)) {
                throw new Error(parentType + ' to ' + childType + ' relationship is a not Has One relationship.' + (' It is defined as: ' + relationship));
            }

            return this._getGraphValue(parentType, childType, parentKey);
        }

        /**
         * Get the parent's key of a belongs-to child node.
         *
         * @param childType Type of node for the child node.
         * @param childKey Key of the child node.
         * @param parentType Type of node for the parent node.
         * @returns {*} Key of the parent node.
         */

    }, {
        key: 'getParent',
        value: function getParent(childType, childKey, parentType) {
            var relationship = this._lookupRelationship(parentType, childType);

            if (!(relationship instanceof _relationships.HasOneRelationship) && !(relationship instanceof _relationships.HasManyRelationship)) {

                throw new Error(parentType + ' to ' + childType + ' relationship is not a Has One or Has Many relationship.' + (' It is defined as: ' + relationship));
            }

            return this._getGraphValue(childType, parentType, childKey);
        }

        /**
         * Get an `array` of all the child node keys for a has-many or
         * has-and-belongs-to-many parent node.
         *
         * @param parentType Type of node for the parent node.
         * @param parentKey Key of the parent node.
         * @param childType Type of node for the child nodes.
         * @returns {array} All child node keys associated with the parent node.
         */

    }, {
        key: 'getChildren',
        value: function getChildren(parentType, parentKey, childType) {
            var relationship = this._lookupRelationship(parentType, childType);

            if (!(relationship instanceof _relationships.HasManyRelationship) && !(relationship instanceof _relationships.HasAndBelongsToManyRelationship)) {
                throw new Error(parentType + ' to ' + childType + ' relationship is a not Has One' + ' or Has and Belongs to Many relationship.' + (' It is defined as: ' + relationship));
            }

            return this._getGraphValues(parentType, childType, parentKey);
        }

        /**
         * Determines whether `this` graph is compatible with `otherGraph`. They will
         * be compatible if `this` has matching schemas with `otherGraph`, even if
         * `otherGraph` has more schemas than `this`. That is, `this` schemas must be a
         * subset of `otherGraph` schemas.
         *
         * This is useful to check if the graphs will be merged together.
         *
         * @param {Graph} otherGraph
         * @returns {boolean}
         */

    }, {
        key: 'canMergeWith',
        value: function canMergeWith(otherGraph) {
            var _this5 = this;

            if (!otherGraph || !(otherGraph instanceof this.constructor)) {
                return false;
            }

            return (0, _keys2.default)(this._schemaMap).every(function (nodeType) {
                var schema = _this5._schemaMap[nodeType];
                var otherSchema = otherGraph._schemaMap[nodeType];

                return schema.equals(otherSchema);
            });
        }

        /**
         * Creates a new graph with the relationships of `graphA` merged with `graphB`.
         *
         * @param {Graph} graphA
         * @param {Graph} graphB
         * @returns {Graph}
         */

    }, {
        key: '_lookupRelationship',
        value: function _lookupRelationship(fromNodeType, toNodeType) {
            var schema = this._schemaMap[fromNodeType];

            if (!schema) {
                throw new Error('Schema was not defined for ' + fromNodeType);
            }

            var relationship = schema.relationships[toNodeType];

            if (!relationship) {
                throw new Error('No relationship defined from ' + fromNodeType + ' to ' + toNodeType);
            }

            return relationship;
        }
    }, {
        key: '_isOneToOneRelationship',
        value: function _isOneToOneRelationship(relationship1, relationship2) {
            return relationship1 instanceof _relationships.HasOneRelationship && relationship2 instanceof _relationships.BelongsToRelationship || relationship2 instanceof _relationships.HasOneRelationship && relationship1 instanceof _relationships.BelongsToRelationship;
        }
    }, {
        key: '_isOneToManyRelationship',
        value: function _isOneToManyRelationship(relationship1, relationship2) {
            return relationship1 instanceof _relationships.HasManyRelationship && relationship2 instanceof _relationships.BelongsToRelationship || relationship2 instanceof _relationships.HasManyRelationship && relationship1 instanceof _relationships.BelongsToRelationship;
        }
    }, {
        key: '_isManyToManyRelationship',
        value: function _isManyToManyRelationship(relationship1, relationship2) {
            return relationship1 instanceof _relationships.HasAndBelongsToManyRelationship && relationship2 instanceof _relationships.HasAndBelongsToManyRelationship;
        }

        /*
         * Determine the primary type, which will be used as the primary index or key
         * for the graph.
         */

    }, {
        key: '_isPrimaryType',
        value: function _isPrimaryType(type1, type2) {
            return type1 > type2;
        }
    }, {
        key: '_setRelationship',
        value: function _setRelationship(fromType, fromKey, toType, toKey) {
            if (this._isPrimaryType(fromType, toType)) {
                var graph = this._graph[fromType][toType];
                graph.set(fromKey, toKey);
            } else {
                var graph = this._graph[toType][fromType];
                graph.set(toKey, fromKey);
            }
        }
    }, {
        key: '_removeRelationship',
        value: function _removeRelationship(fromType, fromKey, toType, toKey) {
            if (this._isPrimaryType(fromType, toType)) {
                var graph = this._graph[fromType][toType];
                graph.remove(fromKey, toKey);
            } else {
                var graph = this._graph[toType][fromType];
                graph.remove(toKey, fromKey);
            }
        }
    }, {
        key: '_removeUsagesBetweenTypes',
        value: function _removeUsagesBetweenTypes(fromType, fromKeys, toType, toKeys) {
            var fromIsPrimaryType = this._isPrimaryType(fromType, toType);

            var relationships = undefined,
                keys = undefined,
                values = undefined;

            if (fromIsPrimaryType) {
                relationships = this._graph[fromType][toType];
                keys = fromKeys;
                values = toKeys;
            } else {
                relationships = this._graph[toType][fromType];
                keys = toKeys;
                values = fromKeys;
            }

            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = (0, _getIterator3.default)(keys), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var key = _step13.value;

                    relationships.removeKey(key);

                    var _iteratorNormalCompletion14 = true;
                    var _didIteratorError14 = false;
                    var _iteratorError14 = undefined;

                    try {
                        for (var _iterator14 = (0, _getIterator3.default)(values), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                            var value = _step14.value;

                            relationships.removeValue(value);
                        }
                    } catch (err) {
                        _didIteratorError14 = true;
                        _iteratorError14 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion14 && _iterator14.return) {
                                _iterator14.return();
                            }
                        } finally {
                            if (_didIteratorError14) {
                                throw _iteratorError14;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                        _iterator13.return();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }
        }
    }, {
        key: '_appendOneToManyRelationship',
        value: function _appendOneToManyRelationship(fromType, fromKey, toType, toKey) {
            var graph = this._getGraphFor(fromType, toType);
            var fromToRelationship = this._lookupRelationship(fromType, toType);

            var fromTypeIsKey = this._isPrimaryType(fromType, toType);
            var fromTypeIsParent = fromToRelationship instanceof _relationships.HasManyRelationship;

            if (fromTypeIsKey) {
                if (fromTypeIsParent) {
                    graph.appendValueToKey(fromKey, toKey);
                } else {
                    graph.appendKeyToValue(fromKey, toKey);
                }
            } else {
                if (fromTypeIsParent) {
                    graph.appendKeyToValue(toKey, fromKey);
                } else {
                    graph.appendValueToKey(toKey, fromKey);
                }
            }
        }
    }, {
        key: '_appendManyToManyRelationship',
        value: function _appendManyToManyRelationship(fromType, fromKey, toType, toKey) {
            if (this._isPrimaryType(fromType, toType)) {
                var graph = this._graph[fromType][toType];
                graph.append(fromKey, toKey);
            } else {
                var graph = this._graph[toType][fromType];
                graph.append(toKey, fromKey);
            }
        }
    }, {
        key: '_createGraphRelationships',
        value: function _createGraphRelationships() {
            var _iteratorNormalCompletion15 = true;
            var _didIteratorError15 = false;
            var _iteratorError15 = undefined;

            try {
                for (var _iterator15 = (0, _getIterator3.default)(this._schemas), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                    var schema = _step15.value;

                    var fromType = schema.forType;
                    var toTypes = (0, _keys2.default)(schema.relationships);

                    var _iteratorNormalCompletion16 = true;
                    var _didIteratorError16 = false;
                    var _iteratorError16 = undefined;

                    try {
                        for (var _iterator16 = (0, _getIterator3.default)(toTypes), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                            var toType = _step16.value;

                            if (this._graph[fromType] && this._graph[fromType][toType]) {
                                continue; // Bimap already created
                            }

                            var bimap = new _bimap2.default();

                            if (this._isPrimaryType(fromType, toType)) {
                                this._mergeGraph(fromType, (0, _defineProperty3.default)({}, toType, bimap));
                            } else {
                                this._mergeGraph(toType, (0, _defineProperty3.default)({}, fromType, bimap));
                            }
                        }
                    } catch (err) {
                        _didIteratorError16 = true;
                        _iteratorError16 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion16 && _iterator16.return) {
                                _iterator16.return();
                            }
                        } finally {
                            if (_didIteratorError16) {
                                throw _iteratorError16;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError15 = true;
                _iteratorError15 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion15 && _iterator15.return) {
                        _iterator15.return();
                    }
                } finally {
                    if (_didIteratorError15) {
                        throw _iteratorError15;
                    }
                }
            }
        }
    }, {
        key: '_mergeGraph',
        value: function _mergeGraph(forType, object) {
            if (this._graph.hasOwnProperty(forType)) {
                (0, _assign2.default)(this._graph[forType], object);
            } else {
                this._graph[forType] = object;
            }
        }
    }, {
        key: '_getGraphFor',
        value: function _getGraphFor(fromType, toType) {
            if (this._isPrimaryType(fromType, toType)) {
                return this._graph[fromType][toType];
            } else {
                return this._graph[toType][fromType];
            }
        }
    }, {
        key: '_getGraphValues',
        value: function _getGraphValues(fromType, toType, fromKey) {
            var relationships = this._getGraphFor(fromType, toType);

            var values = this._isPrimaryType(fromType, toType) ? relationships.getKeyValues(fromKey) : relationships.getValueKeys(fromKey);

            return values ? (0, _from2.default)(values) : [];
        }
    }, {
        key: '_getGraphValue',
        value: function _getGraphValue(fromType, toType, fromKey) {
            var relationships = this._getGraphFor(fromType, toType);

            var values = this._isPrimaryType(fromType, toType) ? relationships.getKeyValues(fromKey) : relationships.getValueKeys(fromKey);

            if (!values) {
                return undefined;
            }

            var _values = (0, _slicedToArray3.default)(values, 1);

            var value = _values[0];

            return value;
        }
    }, {
        key: 'schemas',
        get: function get() {
            return this._schemas;
        }
    }], [{
        key: 'merge',
        value: function merge(graphA, graphB) {
            if (!graphA.canMergeWith(graphB)) {
                throw new Error('Cannot merge graphs due to incompatibilities (most' + ' likely due to incompatible schemas)');
            }

            return this.mergeCompatibleGraphs(graphA, graphB);
        }

        /**
         * Creates a new graph with the relationships of `graphA` merged with `graphB`.
         * It works exactly the same as {Graph#merge} except it doesn't check whether
         * both graphs have compatible schemas. This can be a performance boost if you
         * already know the schemas are compatible.
         *
         * Note: Merging incompatible graphs here will result in relationship errors.
         *
         * @param {Graph} graphA
         * @param {Graph} graphB
         * @returns {Graph}
         */

    }, {
        key: 'mergeCompatibleGraphs',
        value: function mergeCompatibleGraphs(graphA, graphB) {
            var resultGraph = new this(graphA._schemas);

            (0, _keys2.default)(graphA._graph).forEach(function (primaryType) {
                (0, _keys2.default)(graphA._graph[primaryType]).forEach(function (secondaryType) {
                    var primaryRelationshipType = graphA._lookupRelationship(primaryType, secondaryType);
                    var secondaryRelationshipType = graphA._lookupRelationship(secondaryType, primaryType);

                    var relationshipsA = graphA._graph[primaryType][secondaryType];
                    var relationshipsB = graphB._graph[primaryType][secondaryType];
                    var mergedRelationships = undefined;

                    if (graphA._isOneToOneRelationship(primaryRelationshipType, secondaryRelationshipType)) {
                        mergedRelationships = _bimap2.default.replace(relationshipsA, relationshipsB);
                    } else if (graphA._isOneToManyRelationship(primaryRelationshipType, secondaryRelationshipType)) {
                        var primaryTypeIsParent = primaryRelationshipType instanceof _relationships.HasManyRelationship;

                        if (primaryTypeIsParent) {
                            mergedRelationships = _bimap2.default.mergeKeysReplaceValues(relationshipsA, relationshipsB);
                        } else {
                            mergedRelationships = _bimap2.default.replaceKeysMergeValues(relationshipsA, relationshipsB);
                        }
                    } else if (graphA._isManyToManyRelationship(primaryRelationshipType, secondaryRelationshipType)) {
                        mergedRelationships = _bimap2.default.merge(relationshipsA, relationshipsB);
                    } else {
                        throw new Error('Unknown relationship' + (' from ' + primaryType + ' with "' + primaryRelationshipType + '"') + (' to ' + secondaryType + ' with "' + secondaryRelationshipType + '"'));
                    }

                    resultGraph._mergeGraph(primaryType, (0, _defineProperty3.default)({}, secondaryType, mergedRelationships));
                });
            });

            return resultGraph;
        }
    }]);
    return Graph;
})();

exports.default = Graph;

},{"./bimap":1,"./relationships":4,"babel-runtime/core-js/array/from":6,"babel-runtime/core-js/get-iterator":7,"babel-runtime/core-js/object/assign":10,"babel-runtime/core-js/object/keys":13,"babel-runtime/helpers/classCallCheck":19,"babel-runtime/helpers/createClass":20,"babel-runtime/helpers/defineProperty":21,"babel-runtime/helpers/slicedToArray":24}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _schema = _dereq_('./schema');

Object.defineProperty(exports, 'Schema', {
    enumerable: true,
    get: function get() {
        return _schema.default;
    }
});

var _graph = _dereq_('./graph');

Object.defineProperty(exports, 'Graph', {
    enumerable: true,
    get: function get() {
        return _graph.default;
    }
});

var _relationships = _dereq_('./relationships');

Object.defineProperty(exports, 'Relationship', {
    enumerable: true,
    get: function get() {
        return _relationships.Relationship;
    }
});
Object.defineProperty(exports, 'HasOneRelationship', {
    enumerable: true,
    get: function get() {
        return _relationships.HasOneRelationship;
    }
});
Object.defineProperty(exports, 'HasManyRelationship', {
    enumerable: true,
    get: function get() {
        return _relationships.HasManyRelationship;
    }
});
Object.defineProperty(exports, 'BelongsToRelationship', {
    enumerable: true,
    get: function get() {
        return _relationships.BelongsToRelationship;
    }
});
Object.defineProperty(exports, 'HasAndBelongsToManyRelationship', {
    enumerable: true,
    get: function get() {
        return _relationships.HasAndBelongsToManyRelationship;
    }
});

},{"./graph":2,"./relationships":4,"./schema":5}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HasAndBelongsToManyRelationship = exports.BelongsToRelationship = exports.HasManyRelationship = exports.HasOneRelationship = exports.Relationship = undefined;

var _possibleConstructorReturn2 = _dereq_('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = _dereq_('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = _dereq_('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = _dereq_('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The relationship types used by `Schema`s and `Graph`s.
 */

var Relationship = exports.Relationship = (function () {
    function Relationship(from, to) {
        (0, _classCallCheck3.default)(this, Relationship);

        this.from = from;
        this.to = to;
    }

    (0, _createClass3.default)(Relationship, [{
        key: 'equals',
        value: function equals(otherRelationship) {
            if (this === otherRelationship) {
                return true;
            }

            if (!otherRelationship) {
                return false;
            }

            return this.constructor === otherRelationship.constructor && this.from === otherRelationship.from && this.to === otherRelationship.to;
        }
    }]);
    return Relationship;
})();

var HasOneRelationship = exports.HasOneRelationship = (function (_Relationship) {
    (0, _inherits3.default)(HasOneRelationship, _Relationship);

    function HasOneRelationship() {
        (0, _classCallCheck3.default)(this, HasOneRelationship);
        return (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(HasOneRelationship).apply(this, arguments));
    }

    (0, _createClass3.default)(HasOneRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Has One Relationship';
        }
    }]);
    return HasOneRelationship;
})(Relationship);

var HasManyRelationship = exports.HasManyRelationship = (function (_Relationship2) {
    (0, _inherits3.default)(HasManyRelationship, _Relationship2);

    function HasManyRelationship() {
        (0, _classCallCheck3.default)(this, HasManyRelationship);
        return (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(HasManyRelationship).apply(this, arguments));
    }

    (0, _createClass3.default)(HasManyRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Has Many Relationship';
        }
    }]);
    return HasManyRelationship;
})(Relationship);

var BelongsToRelationship = exports.BelongsToRelationship = (function (_Relationship3) {
    (0, _inherits3.default)(BelongsToRelationship, _Relationship3);

    function BelongsToRelationship() {
        (0, _classCallCheck3.default)(this, BelongsToRelationship);
        return (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(BelongsToRelationship).apply(this, arguments));
    }

    (0, _createClass3.default)(BelongsToRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Belongs To Relationship';
        }
    }]);
    return BelongsToRelationship;
})(Relationship);

var HasAndBelongsToManyRelationship = exports.HasAndBelongsToManyRelationship = (function (_Relationship4) {
    (0, _inherits3.default)(HasAndBelongsToManyRelationship, _Relationship4);

    function HasAndBelongsToManyRelationship() {
        (0, _classCallCheck3.default)(this, HasAndBelongsToManyRelationship);
        return (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(HasAndBelongsToManyRelationship).apply(this, arguments));
    }

    (0, _createClass3.default)(HasAndBelongsToManyRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Has and Belongs To Many Relationship';
        }
    }]);
    return HasAndBelongsToManyRelationship;
})(Relationship);

},{"babel-runtime/helpers/classCallCheck":19,"babel-runtime/helpers/createClass":20,"babel-runtime/helpers/inherits":22,"babel-runtime/helpers/possibleConstructorReturn":23}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = _dereq_('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = _dereq_('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _keys = _dereq_('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _relationships = _dereq_('./relationships');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Defines a type of node's relationships with another node. A node is simply a unit
 * of data. For example, one node type might be a `car` and another is a `wheel`.
 * A `Schema` for `car` would specify it `hasMany` `wheels` and likewise, a `wheel`
 * `Schema` would specify it `belongsTo` a `car`.
 */

var Schema = (function () {
    function Schema(forType) {
        (0, _classCallCheck3.default)(this, Schema);

        this.forType = forType;
        this.relationships = {};
    }

    /**
     * Convenience method instead of using `new Schema`. Use it as:
     * ```
     * Schema.define(nodeType).[...]
     * ```
     *
     * @param nodeType
     */

    (0, _createClass3.default)(Schema, [{
        key: 'hasOne',

        /**
         * Specify that the node can have one child of `childType`.
         *
         * @param childType Type of child node.
         * @returns {Schema}
         */
        value: function hasOne(childType) {
            this.relationships[childType] = new _relationships.HasOneRelationship(this.forType, childType);

            return this;
        }

        /**
         * Specify that the node can have any number of child nodes of `childType`.
         *
         * @param childType Type of child nodes.
         * @returns {Schema}
         */

    }, {
        key: 'hasMany',
        value: function hasMany(childType) {
            this.relationships[childType] = new _relationships.HasManyRelationship(this.forType, childType);

            return this;
        }

        /**
         * Specify that the node can belong to a parent node of `parentType`.
         *
         * @param parentType Type of parent node.
         * @returns {Schema}
         */

    }, {
        key: 'belongsTo',
        value: function belongsTo(parentType) {
            this.relationships[parentType] = new _relationships.BelongsToRelationship(this.forType, parentType);

            return this;
        }

        /**
         * Specify that the node can have many child nodes and also can belong to many
         * parent nodes of `childType`.
         *
         * @param childType Type of child/parent node.
         * @returns {Schema}
         */

    }, {
        key: 'hasAndBelongsToMany',
        value: function hasAndBelongsToMany(childType) {
            this.relationships[childType] = new _relationships.HasAndBelongsToManyRelationship(this.forType, childType);

            return this;
        }

        /**
         * Determines whether `otherSchema` equals `this` schema.
         *
         * @param otherSchema
         */

    }, {
        key: 'equals',
        value: function equals(otherSchema) {
            var _this = this;

            if (this === otherSchema) {
                return true;
            }

            if (!otherSchema) {
                return false;
            }

            if (this.forType !== otherSchema.forType) {
                return false;
            }

            var relatedNodeTypes = (0, _keys2.default)(this.relationships);

            if (relatedNodeTypes.length !== (0, _keys2.default)(otherSchema.relationships).length) {
                return false;
            }

            return relatedNodeTypes.every(function (nodeType) {
                if (!otherSchema.relationships.hasOwnProperty(nodeType)) {
                    return false;
                }

                return _this.relationships[nodeType].equals(otherSchema.relationships[nodeType]);
            });
        }
    }], [{
        key: 'define',
        value: function define(nodeType) {
            return new this(nodeType);
        }
    }]);
    return Schema;
})();

exports.default = Schema;

},{"./relationships":4,"babel-runtime/core-js/object/keys":13,"babel-runtime/helpers/classCallCheck":19,"babel-runtime/helpers/createClass":20}],6:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":25}],7:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":26}],8:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":27}],9:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":28}],10:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":29}],11:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":30}],12:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":31}],13:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":32}],14:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":33}],15:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":34}],16:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":35}],17:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":36}],18:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":37}],19:[function(_dereq_,module,exports){
"use strict";

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

exports.default = function (instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],20:[function(_dereq_,module,exports){
"use strict";

var _defineProperty = _dereq_("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":12}],21:[function(_dereq_,module,exports){
"use strict";

var _defineProperty = _dereq_("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":12}],22:[function(_dereq_,module,exports){
"use strict";

var _setPrototypeOf = _dereq_("babel-runtime/core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = _dereq_("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":11,"babel-runtime/core-js/object/set-prototype-of":14}],23:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
};

exports.__esModule = true;
},{}],24:[function(_dereq_,module,exports){
"use strict";

var _isIterable2 = _dereq_("babel-runtime/core-js/is-iterable");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = _dereq_("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/get-iterator":7,"babel-runtime/core-js/is-iterable":8}],25:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.string.iterator');
_dereq_('../../modules/es6.array.from');
module.exports = _dereq_('../../modules/$.core').Array.from;
},{"../../modules/$.core":46,"../../modules/es6.array.from":98,"../../modules/es6.string.iterator":107}],26:[function(_dereq_,module,exports){
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.string.iterator');
module.exports = _dereq_('../modules/core.get-iterator');
},{"../modules/core.get-iterator":96,"../modules/es6.string.iterator":107,"../modules/web.dom.iterable":111}],27:[function(_dereq_,module,exports){
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.string.iterator');
module.exports = _dereq_('../modules/core.is-iterable');
},{"../modules/core.is-iterable":97,"../modules/es6.string.iterator":107,"../modules/web.dom.iterable":111}],28:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
module.exports = _dereq_('../modules/$.core').Map;
},{"../modules/$.core":46,"../modules/es6.map":100,"../modules/es6.object.to-string":104,"../modules/es6.string.iterator":107,"../modules/es7.map.to-json":109,"../modules/web.dom.iterable":111}],29:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.assign');
module.exports = _dereq_('../../modules/$.core').Object.assign;
},{"../../modules/$.core":46,"../../modules/es6.object.assign":101}],30:[function(_dereq_,module,exports){
var $ = _dereq_('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":71}],31:[function(_dereq_,module,exports){
var $ = _dereq_('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":71}],32:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.keys');
module.exports = _dereq_('../../modules/$.core').Object.keys;
},{"../../modules/$.core":46,"../../modules/es6.object.keys":102}],33:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.set-prototype-of');
module.exports = _dereq_('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":46,"../../modules/es6.object.set-prototype-of":103}],34:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
module.exports = _dereq_('../modules/$.core').Promise;
},{"../modules/$.core":46,"../modules/es6.object.to-string":104,"../modules/es6.promise":105,"../modules/es6.string.iterator":107,"../modules/web.dom.iterable":111}],35:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.set');
_dereq_('../modules/es7.set.to-json');
module.exports = _dereq_('../modules/$.core').Set;
},{"../modules/$.core":46,"../modules/es6.object.to-string":104,"../modules/es6.set":106,"../modules/es6.string.iterator":107,"../modules/es7.set.to-json":110,"../modules/web.dom.iterable":111}],36:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.symbol');
_dereq_('../../modules/es6.object.to-string');
module.exports = _dereq_('../../modules/$.core').Symbol;
},{"../../modules/$.core":46,"../../modules/es6.object.to-string":104,"../../modules/es6.symbol":108}],37:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.string.iterator');
_dereq_('../../modules/web.dom.iterable');
module.exports = _dereq_('../../modules/$.wks')('iterator');
},{"../../modules/$.wks":94,"../../modules/es6.string.iterator":107,"../../modules/web.dom.iterable":111}],38:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],39:[function(_dereq_,module,exports){
module.exports = function(){ /* empty */ };
},{}],40:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":64}],41:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./$.cof')
  , TAG = _dereq_('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":42,"./$.wks":94}],42:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],43:[function(_dereq_,module,exports){
'use strict';
var $            = _dereq_('./$')
  , hide         = _dereq_('./$.hide')
  , mix          = _dereq_('./$.mix')
  , ctx          = _dereq_('./$.ctx')
  , strictNew    = _dereq_('./$.strict-new')
  , defined      = _dereq_('./$.defined')
  , forOf        = _dereq_('./$.for-of')
  , $iterDefine  = _dereq_('./$.iter-define')
  , step         = _dereq_('./$.iter-step')
  , ID           = _dereq_('./$.uid')('id')
  , $has         = _dereq_('./$.has')
  , isObject     = _dereq_('./$.is-object')
  , setSpecies   = _dereq_('./$.set-species')
  , DESCRIPTORS  = _dereq_('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    mix(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./$":71,"./$.ctx":47,"./$.defined":49,"./$.descriptors":50,"./$.for-of":54,"./$.has":57,"./$.hide":58,"./$.is-object":64,"./$.iter-define":67,"./$.iter-step":69,"./$.mix":75,"./$.set-species":82,"./$.strict-new":86,"./$.uid":93}],44:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = _dereq_('./$.for-of')
  , classof = _dereq_('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":41,"./$.for-of":54}],45:[function(_dereq_,module,exports){
'use strict';
var global         = _dereq_('./$.global')
  , $              = _dereq_('./$')
  , $def           = _dereq_('./$.def')
  , fails          = _dereq_('./$.fails')
  , hide           = _dereq_('./$.hide')
  , mix            = _dereq_('./$.mix')
  , forOf          = _dereq_('./$.for-of')
  , strictNew      = _dereq_('./$.strict-new')
  , isObject       = _dereq_('./$.is-object')
  , DESCRIPTORS    = _dereq_('./$.descriptors')
  , setToStringTag = _dereq_('./$.set-to-string-tag');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    mix(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      strictNew(target, C, NAME);
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$":71,"./$.def":48,"./$.descriptors":50,"./$.fails":53,"./$.for-of":54,"./$.global":56,"./$.hide":58,"./$.is-object":64,"./$.mix":75,"./$.set-to-string-tag":83,"./$.strict-new":86}],46:[function(_dereq_,module,exports){
var core = module.exports = {version: '1.2.5'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],47:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":38}],48:[function(_dereq_,module,exports){
var global    = _dereq_('./$.global')
  , core      = _dereq_('./$.core')
  , PROTOTYPE = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":46,"./$.global":56}],49:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],50:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":53}],51:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object')
  , document = _dereq_('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":56,"./$.is-object":64}],52:[function(_dereq_,module,exports){
// all enumerable object keys, includes symbols
var $ = _dereq_('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":71}],53:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],54:[function(_dereq_,module,exports){
var ctx         = _dereq_('./$.ctx')
  , call        = _dereq_('./$.iter-call')
  , isArrayIter = _dereq_('./$.is-array-iter')
  , anObject    = _dereq_('./$.an-object')
  , toLength    = _dereq_('./$.to-length')
  , getIterFn   = _dereq_('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":40,"./$.ctx":47,"./$.is-array-iter":62,"./$.iter-call":65,"./$.to-length":91,"./core.get-iterator-method":95}],55:[function(_dereq_,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toString  = {}.toString
  , toIObject = _dereq_('./$.to-iobject')
  , getNames  = _dereq_('./$').getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":71,"./$.to-iobject":90}],56:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],57:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],58:[function(_dereq_,module,exports){
var $          = _dereq_('./$')
  , createDesc = _dereq_('./$.property-desc');
module.exports = _dereq_('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":71,"./$.descriptors":50,"./$.property-desc":78}],59:[function(_dereq_,module,exports){
module.exports = _dereq_('./$.global').document && document.documentElement;
},{"./$.global":56}],60:[function(_dereq_,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],61:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":42}],62:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators  = _dereq_('./$.iterators')
  , ITERATOR   = _dereq_('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return (Iterators.Array || ArrayProto[ITERATOR]) === it;
};
},{"./$.iterators":70,"./$.wks":94}],63:[function(_dereq_,module,exports){
// 7.2.2 IsArray(argument)
var cof = _dereq_('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":42}],64:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],65:[function(_dereq_,module,exports){
// call something on iterator step with safe closing on error
var anObject = _dereq_('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":40}],66:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./$')
  , descriptor     = _dereq_('./$.property-desc')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./$.hide')(IteratorPrototype, _dereq_('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":71,"./$.hide":58,"./$.property-desc":78,"./$.set-to-string-tag":83,"./$.wks":94}],67:[function(_dereq_,module,exports){
'use strict';
var LIBRARY         = _dereq_('./$.library')
  , $def            = _dereq_('./$.def')
  , $redef          = _dereq_('./$.redef')
  , hide            = _dereq_('./$.hide')
  , has             = _dereq_('./$.has')
  , SYMBOL_ITERATOR = _dereq_('./$.wks')('iterator')
  , Iterators       = _dereq_('./$.iterators')
  , $iterCreate     = _dereq_('./$.iter-create')
  , setToStringTag  = _dereq_('./$.set-to-string-tag')
  , getProto        = _dereq_('./$').getProto
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if((!LIBRARY || FORCE) && (BUGGY || !(SYMBOL_ITERATOR in proto))){
    hide(proto, SYMBOL_ITERATOR, _default);
  }
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEFAULT == VALUES ? _default : getMethod(VALUES),
      keys:    IS_SET            ? _default : getMethod(KEYS),
      entries: DEFAULT != VALUES ? _default : getMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
  return methods;
};
},{"./$":71,"./$.def":48,"./$.has":57,"./$.hide":58,"./$.iter-create":66,"./$.iterators":70,"./$.library":73,"./$.redef":79,"./$.set-to-string-tag":83,"./$.wks":94}],68:[function(_dereq_,module,exports){
var ITERATOR     = _dereq_('./$.wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":94}],69:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],70:[function(_dereq_,module,exports){
module.exports = {};
},{}],71:[function(_dereq_,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],72:[function(_dereq_,module,exports){
var $         = _dereq_('./$')
  , toIObject = _dereq_('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":71,"./$.to-iobject":90}],73:[function(_dereq_,module,exports){
module.exports = true;
},{}],74:[function(_dereq_,module,exports){
var global    = _dereq_('./$.global')
  , macrotask = _dereq_('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , isNode    = _dereq_('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    if(domain)domain.enter();
    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":42,"./$.global":56,"./$.task":88}],75:[function(_dereq_,module,exports){
var $redef = _dereq_('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":79}],76:[function(_dereq_,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = _dereq_('./$')
  , toObject = _dereq_('./$.to-object')
  , IObject  = _dereq_('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = _dereq_('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":71,"./$.fails":53,"./$.iobject":61,"./$.to-object":92}],77:[function(_dereq_,module,exports){
// most Object methods by ES6 should accept primitives
var $def  = _dereq_('./$.def')
  , core  = _dereq_('./$.core')
  , fails = _dereq_('./$.fails');
module.exports = function(KEY, exec){
  var $def = _dereq_('./$.def')
    , fn   = (core.Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":46,"./$.def":48,"./$.fails":53}],78:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],79:[function(_dereq_,module,exports){
module.exports = _dereq_('./$.hide');
},{"./$.hide":58}],80:[function(_dereq_,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],81:[function(_dereq_,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = _dereq_('./$').getDesc
  , isObject = _dereq_('./$.is-object')
  , anObject = _dereq_('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = _dereq_('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":71,"./$.an-object":40,"./$.ctx":47,"./$.is-object":64}],82:[function(_dereq_,module,exports){
'use strict';
var core        = _dereq_('./$.core')
  , $           = _dereq_('./$')
  , DESCRIPTORS = _dereq_('./$.descriptors')
  , SPECIES     = _dereq_('./$.wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":71,"./$.core":46,"./$.descriptors":50,"./$.wks":94}],83:[function(_dereq_,module,exports){
var def = _dereq_('./$').setDesc
  , has = _dereq_('./$.has')
  , TAG = _dereq_('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":71,"./$.has":57,"./$.wks":94}],84:[function(_dereq_,module,exports){
var global = _dereq_('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":56}],85:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = _dereq_('./$.an-object')
  , aFunction = _dereq_('./$.a-function')
  , SPECIES   = _dereq_('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":38,"./$.an-object":40,"./$.wks":94}],86:[function(_dereq_,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],87:[function(_dereq_,module,exports){
var toInteger = _dereq_('./$.to-integer')
  , defined   = _dereq_('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":49,"./$.to-integer":89}],88:[function(_dereq_,module,exports){
'use strict';
var ctx                = _dereq_('./$.ctx')
  , invoke             = _dereq_('./$.invoke')
  , html               = _dereq_('./$.html')
  , cel                = _dereq_('./$.dom-create')
  , global             = _dereq_('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(_dereq_('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":42,"./$.ctx":47,"./$.dom-create":51,"./$.global":56,"./$.html":59,"./$.invoke":60}],89:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],90:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./$.iobject')
  , defined = _dereq_('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":49,"./$.iobject":61}],91:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":89}],92:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":49}],93:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],94:[function(_dereq_,module,exports){
var store  = _dereq_('./$.shared')('wks')
  , uid    = _dereq_('./$.uid')
  , Symbol = _dereq_('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":56,"./$.shared":84,"./$.uid":93}],95:[function(_dereq_,module,exports){
var classof   = _dereq_('./$.classof')
  , ITERATOR  = _dereq_('./$.wks')('iterator')
  , Iterators = _dereq_('./$.iterators');
module.exports = _dereq_('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":41,"./$.core":46,"./$.iterators":70,"./$.wks":94}],96:[function(_dereq_,module,exports){
var anObject = _dereq_('./$.an-object')
  , get      = _dereq_('./core.get-iterator-method');
module.exports = _dereq_('./$.core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./$.an-object":40,"./$.core":46,"./core.get-iterator-method":95}],97:[function(_dereq_,module,exports){
var classof   = _dereq_('./$.classof')
  , ITERATOR  = _dereq_('./$.wks')('iterator')
  , Iterators = _dereq_('./$.iterators');
module.exports = _dereq_('./$.core').isIterable = function(it){
  var O = Object(it);
  return ITERATOR in O
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};
},{"./$.classof":41,"./$.core":46,"./$.iterators":70,"./$.wks":94}],98:[function(_dereq_,module,exports){
'use strict';
var ctx         = _dereq_('./$.ctx')
  , $def        = _dereq_('./$.def')
  , toObject    = _dereq_('./$.to-object')
  , call        = _dereq_('./$.iter-call')
  , isArrayIter = _dereq_('./$.is-array-iter')
  , toLength    = _dereq_('./$.to-length')
  , getIterFn   = _dereq_('./core.get-iterator-method');
$def($def.S + $def.F * !_dereq_('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":47,"./$.def":48,"./$.is-array-iter":62,"./$.iter-call":65,"./$.iter-detect":68,"./$.to-length":91,"./$.to-object":92,"./core.get-iterator-method":95}],99:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./$.add-to-unscopables')
  , step             = _dereq_('./$.iter-step')
  , Iterators        = _dereq_('./$.iterators')
  , toIObject        = _dereq_('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":39,"./$.iter-define":67,"./$.iter-step":69,"./$.iterators":70,"./$.to-iobject":90}],100:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./$.collection-strong');

// 23.1 Map Objects
_dereq_('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":45,"./$.collection-strong":43}],101:[function(_dereq_,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = _dereq_('./$.def');

$def($def.S + $def.F, 'Object', {assign: _dereq_('./$.object-assign')});
},{"./$.def":48,"./$.object-assign":76}],102:[function(_dereq_,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = _dereq_('./$.to-object');

_dereq_('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":77,"./$.to-object":92}],103:[function(_dereq_,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = _dereq_('./$.def');
$def($def.S, 'Object', {setPrototypeOf: _dereq_('./$.set-proto').set});
},{"./$.def":48,"./$.set-proto":81}],104:[function(_dereq_,module,exports){

},{}],105:[function(_dereq_,module,exports){
'use strict';
var $          = _dereq_('./$')
  , LIBRARY    = _dereq_('./$.library')
  , global     = _dereq_('./$.global')
  , ctx        = _dereq_('./$.ctx')
  , classof    = _dereq_('./$.classof')
  , $def       = _dereq_('./$.def')
  , isObject   = _dereq_('./$.is-object')
  , anObject   = _dereq_('./$.an-object')
  , aFunction  = _dereq_('./$.a-function')
  , strictNew  = _dereq_('./$.strict-new')
  , forOf      = _dereq_('./$.for-of')
  , setProto   = _dereq_('./$.set-proto').set
  , same       = _dereq_('./$.same-value')
  , SPECIES    = _dereq_('./$.wks')('species')
  , speciesConstructor = _dereq_('./$.species-constructor')
  , RECORD     = _dereq_('./$.uid')('record')
  , asap       = _dereq_('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && _dereq_('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var isPromise = function(it){
  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
};
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    this[RECORD] = record;
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  _dereq_('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var react = {
        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
        fail: typeof onRejected == 'function'  ? onRejected  : false
      };
      var promise = react.P = new (speciesConstructor(this, P))(function(res, rej){
        react.res = res;
        react.rej = rej;
      });
      aFunction(react.res);
      aFunction(react.rej);
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
_dereq_('./$.set-to-string-tag')(P, PROMISE);
_dereq_('./$.set-species')(PROMISE);
Wrapper = _dereq_('./$.core')[PROMISE];

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new this(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && _dereq_('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"./$":71,"./$.a-function":38,"./$.an-object":40,"./$.classof":41,"./$.core":46,"./$.ctx":47,"./$.def":48,"./$.descriptors":50,"./$.for-of":54,"./$.global":56,"./$.is-object":64,"./$.iter-detect":68,"./$.library":73,"./$.microtask":74,"./$.mix":75,"./$.same-value":80,"./$.set-proto":81,"./$.set-species":82,"./$.set-to-string-tag":83,"./$.species-constructor":85,"./$.strict-new":86,"./$.uid":93,"./$.wks":94}],106:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./$.collection-strong');

// 23.2 Set Objects
_dereq_('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":45,"./$.collection-strong":43}],107:[function(_dereq_,module,exports){
'use strict';
var $at  = _dereq_('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":67,"./$.string-at":87}],108:[function(_dereq_,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = _dereq_('./$')
  , global         = _dereq_('./$.global')
  , has            = _dereq_('./$.has')
  , DESCRIPTORS    = _dereq_('./$.descriptors')
  , $def           = _dereq_('./$.def')
  , $redef         = _dereq_('./$.redef')
  , $fails         = _dereq_('./$.fails')
  , shared         = _dereq_('./$.shared')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , uid            = _dereq_('./$.uid')
  , wks            = _dereq_('./$.wks')
  , keyOf          = _dereq_('./$.keyof')
  , $names         = _dereq_('./$.get-names')
  , enumKeys       = _dereq_('./$.enum-keys')
  , isArray        = _dereq_('./$.is-array')
  , anObject       = _dereq_('./$.an-object')
  , toIObject      = _dereq_('./$.to-iobject')
  , createDesc     = _dereq_('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  $redef($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !_dereq_('./$.library')){
    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $def($def.S + $def.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":71,"./$.an-object":40,"./$.def":48,"./$.descriptors":50,"./$.enum-keys":52,"./$.fails":53,"./$.get-names":55,"./$.global":56,"./$.has":57,"./$.is-array":63,"./$.keyof":72,"./$.library":73,"./$.property-desc":78,"./$.redef":79,"./$.set-to-string-tag":83,"./$.shared":84,"./$.to-iobject":90,"./$.uid":93,"./$.wks":94}],109:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = _dereq_('./$.def');

$def($def.P, 'Map', {toJSON: _dereq_('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":44,"./$.def":48}],110:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = _dereq_('./$.def');

$def($def.P, 'Set', {toJSON: _dereq_('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":44,"./$.def":48}],111:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var Iterators = _dereq_('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":70,"./es6.array.iterator":99}],112:[function(_dereq_,module,exports){
(function (global){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = _dereq_("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

module.exports = { "default": module.exports, __esModule: true };

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./runtime":113}],113:[function(_dereq_,module,exports){
(function (process,global){
"use strict";

var _promise = _dereq_("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _setPrototypeOf = _dereq_("babel-runtime/core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = _dereq_("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _iterator = _dereq_("babel-runtime/core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = _dereq_("babel-runtime/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _instanceof(left, right) { if (right != null && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function (global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol = typeof _symbol2.default === "function" && _iterator2.default || "@@iterator";

  var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = (0, _create2.default)((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (_setPrototypeOf2.default) {
      (0, _setPrototypeOf2.default)(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = (0, _create2.default)(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function (arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (_instanceof(value, AwaitArgument)) {
          return _promise2.default.resolve(value.arg).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return _promise2.default.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new _promise2.default(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }
        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
(typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" ? self : undefined);
}).call(this,_dereq_('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":114,"babel-runtime/core-js/object/create":11,"babel-runtime/core-js/object/set-prototype-of":14,"babel-runtime/core-js/promise":15,"babel-runtime/core-js/symbol":17,"babel-runtime/core-js/symbol/iterator":18}],114:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[3])(3)
});