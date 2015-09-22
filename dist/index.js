(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.relatedjs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Support class for bi-directional key-value maps used internally to power
 * storing relationships for a `Graph`.
 */
"use strict";

var _createClass = _dereq_("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = _dereq_("babel-runtime/helpers/class-call-check")["default"];

var _Map = _dereq_("babel-runtime/core-js/map")["default"];

var _Array$from = _dereq_("babel-runtime/core-js/array/from")["default"];

var _Set = _dereq_("babel-runtime/core-js/set")["default"];

var _getIterator = _dereq_("babel-runtime/core-js/get-iterator")["default"];

var _regeneratorRuntime = _dereq_("babel-runtime/regenerator")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Bimap = (function () {
    function Bimap() {
        _classCallCheck(this, Bimap);

        this._keys = new _Map();
        this._values = new _Map();
    }

    _createClass(Bimap, [{
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
            this._keys["delete"](key);
        }
    }, {
        key: "removeValue",
        value: function removeValue(value) {
            this._removeLinksToValue(value);
            this._values["delete"](value);
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
                keys[key] = _Array$from(values);
            });

            var values = {};

            this._values.forEach(function (keys, value) {
                values[value] = _Array$from(keys);
            });

            return { keys: keys, values: values };
        }
    }, {
        key: "_setKeyLinkTo",
        value: function _setKeyLinkTo(key, value) {
            this._keys.set(key, new _Set([value]));
        }
    }, {
        key: "_appendKeyLinkTo",
        value: function _appendKeyLinkTo(key, value) {
            var keyLinks = this._keys.get(key) || new _Set();
            keyLinks.add(value);
            this._keys.set(key, keyLinks);
        }
    }, {
        key: "_setValueLinkTo",
        value: function _setValueLinkTo(value, key) {
            this._values.set(value, new _Set([key]));
        }
    }, {
        key: "_appendValueLinkTo",
        value: function _appendValueLinkTo(value, key) {
            var valueLinks = this._values.get(value) || new _Set();
            valueLinks.add(key);
            this._values.set(value, valueLinks);
        }
    }, {
        key: "_removeKeyLinkTo",
        value: function _removeKeyLinkTo(key, value) {
            var keyLinks = this._keys.get(key);

            if (keyLinks && keyLinks.size > 1) {
                keyLinks["delete"](value);
            } else {
                this._keys["delete"](key);
            }
        }
    }, {
        key: "_removeValueLinkTo",
        value: function _removeValueLinkTo(value, key) {
            var valueLinks = this._values.get(value);

            if (valueLinks && valueLinks.size > 1) {
                valueLinks["delete"](key);
            } else {
                this._values["delete"](value);
            }
        }
    }, {
        key: "_removeLinksToKey",
        value: function _removeLinksToKey(key) {
            var valuesLinkingToKey = this._keys.get(key);

            if (!valuesLinkingToKey) {
                return;
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _getIterator(valuesLinkingToKey), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var value = _step.value;

                    this._removeValueLinkTo(value, key);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
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

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _getIterator(keysLinkingToValue), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var key = _step2.value;

                    this._removeKeyLinkTo(key, value);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }], [{
        key: "merge",
        value: function merge(bimap1, bimap2) {
            var resultBimap = new this();

            resultBimap._keys = this._mergeMapSets([new _Map(), bimap1._keys, bimap2._keys]);

            resultBimap._values = this._mergeMapSets([new _Map(), bimap1._values, bimap2._values]);

            return resultBimap;
        }
    }, {
        key: "replace",
        value: function replace(bimap1, bimap2) {
            var resultBimap = new this();

            var excludedKeyValues = new _Set(bimap2._values.keys());
            var excludedValueKeys = new _Set(bimap2._keys.keys());

            resultBimap._values = this._mergeMapSets([this._newFilteredMapSet(bimap1._values, excludedKeyValues, excludedValueKeys), bimap2._values]);

            resultBimap._keys = this._mergeMapSets([this._newFilteredMapSet(bimap1._keys, excludedValueKeys, excludedKeyValues), bimap2._keys]);

            return resultBimap;
        }
    }, {
        key: "mergeKeysReplaceValues",
        value: function mergeKeysReplaceValues(bimap1, bimap2) {
            var resultBimap = new this();

            var excludedKeyValues = new _Set(bimap2._values.keys());

            resultBimap._values = this._mergeMapSets([this._newFilteredMapSet(bimap1._values, excludedKeyValues), bimap2._values]);

            var excludedValueKeys = new _Set(_regeneratorRuntime.mark(function callee$2$0() {
                var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, valueKeys;

                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            _iteratorNormalCompletion3 = true;
                            _didIteratorError3 = false;
                            _iteratorError3 = undefined;
                            context$3$0.prev = 3;
                            _iterator3 = _getIterator(bimap2._values);

                        case 5:
                            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                context$3$0.next = 11;
                                break;
                            }

                            valueKeys = _step3.value;
                            return context$3$0.delegateYield(valueKeys, "t0", 8);

                        case 8:
                            _iteratorNormalCompletion3 = true;
                            context$3$0.next = 5;
                            break;

                        case 11:
                            context$3$0.next = 17;
                            break;

                        case 13:
                            context$3$0.prev = 13;
                            context$3$0.t1 = context$3$0["catch"](3);
                            _didIteratorError3 = true;
                            _iteratorError3 = context$3$0.t1;

                        case 17:
                            context$3$0.prev = 17;
                            context$3$0.prev = 18;

                            if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                                _iterator3["return"]();
                            }

                        case 20:
                            context$3$0.prev = 20;

                            if (!_didIteratorError3) {
                                context$3$0.next = 23;
                                break;
                            }

                            throw _iteratorError3;

                        case 23:
                            return context$3$0.finish(20);

                        case 24:
                            return context$3$0.finish(17);

                        case 25:
                        case "end":
                            return context$3$0.stop();
                    }
                }, callee$2$0, this, [[3, 13, 17, 25], [18,, 20, 24]]);
            })());

            resultBimap._keys = this._mergeMapSets([this._newFilteredMapSet(bimap1._keys, null, excludedValueKeys), bimap2._keys]);

            return resultBimap;
        }
    }, {
        key: "replaceKeysMergeValues",
        value: function replaceKeysMergeValues(bimap1, bimap2) {
            var resultBimap = new this();

            var excludedValueKeys = new _Set(bimap2._keys.keys());

            resultBimap._keys = this._mergeMapSets([this._newFilteredMapSet(bimap1._keys, excludedValueKeys), bimap2._keys]);

            var excludedKeyValues = new _Set(_regeneratorRuntime.mark(function callee$2$0() {
                var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, keyValues;

                return _regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            _iteratorNormalCompletion4 = true;
                            _didIteratorError4 = false;
                            _iteratorError4 = undefined;
                            context$3$0.prev = 3;
                            _iterator4 = _getIterator(bimap2._keys);

                        case 5:
                            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                                context$3$0.next = 11;
                                break;
                            }

                            keyValues = _step4.value;
                            return context$3$0.delegateYield(keyValues, "t0", 8);

                        case 8:
                            _iteratorNormalCompletion4 = true;
                            context$3$0.next = 5;
                            break;

                        case 11:
                            context$3$0.next = 17;
                            break;

                        case 13:
                            context$3$0.prev = 13;
                            context$3$0.t1 = context$3$0["catch"](3);
                            _didIteratorError4 = true;
                            _iteratorError4 = context$3$0.t1;

                        case 17:
                            context$3$0.prev = 17;
                            context$3$0.prev = 18;

                            if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                                _iterator4["return"]();
                            }

                        case 20:
                            context$3$0.prev = 20;

                            if (!_didIteratorError4) {
                                context$3$0.next = 23;
                                break;
                            }

                            throw _iteratorError4;

                        case 23:
                            return context$3$0.finish(20);

                        case 24:
                            return context$3$0.finish(17);

                        case 25:
                        case "end":
                            return context$3$0.stop();
                    }
                }, callee$2$0, this, [[3, 13, 17, 25], [18,, 20, 24]]);
            })());

            resultBimap._values = this._mergeMapSets([this._newFilteredMapSet(bimap1._values, null, excludedKeyValues), bimap2._values]);

            return resultBimap;
        }
    }, {
        key: "_mergeMapSets",
        value: function _mergeMapSets(mapSets) {
            var mergeSets = function mergeSets(set1, set2) {
                return new _Set(_regeneratorRuntime.mark(function callee$3$0() {
                    return _regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                        while (1) switch (context$4$0.prev = context$4$0.next) {
                            case 0:
                                return context$4$0.delegateYield(set1, "t0", 1);

                            case 1:
                                return context$4$0.delegateYield(set2, "t1", 2);

                            case 2:
                            case "end":
                                return context$4$0.stop();
                        }
                    }, callee$3$0, this);
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

            var resultMapSet = new _Map();

            mapSet.forEach(function (values, key) {
                if (excludedKeySet && excludedKeySet.has(key)) {
                    return;
                }

                var filteredValues = undefined;

                if (excludedValueSet) {
                    filteredValues = new _Set();

                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = _getIterator(values), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
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
                            if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
                                _iterator5["return"]();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                } else {
                    filteredValues = new _Set(values);
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

exports["default"] = Bimap;
module.exports = exports["default"];

},{"babel-runtime/core-js/array/from":6,"babel-runtime/core-js/get-iterator":7,"babel-runtime/core-js/map":9,"babel-runtime/core-js/set":17,"babel-runtime/helpers/class-call-check":20,"babel-runtime/helpers/create-class":21,"babel-runtime/regenerator":115}],2:[function(_dereq_,module,exports){
'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = _dereq_('babel-runtime/helpers/define-property')['default'];

var _slicedToArray = _dereq_('babel-runtime/helpers/sliced-to-array')['default'];

var _getIterator = _dereq_('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = _dereq_('babel-runtime/core-js/object/keys')['default'];

var _Object$assign = _dereq_('babel-runtime/core-js/object/assign')['default'];

var _Array$from = _dereq_('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _relationships = _dereq_('./relationships');

var _bimap = _dereq_('./bimap');

var _bimap2 = _interopRequireDefault(_bimap);

var _testSupportInspect = _dereq_('../test/support/inspect');

/**
 * Stores relationships between different types of nodes. It requires an
 * `array` of `Schema`s to enforce the validity of relationships and govern how it
 * stores and looks up those relationships.
 */

var Graph = (function () {
    function Graph(schemas) {
        _classCallCheck(this, Graph);

        this._graph = {};

        this._schemas = schemas;
        this._schemaMap = {};

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _getIterator(schemas), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
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

    _createClass(Graph, [{
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
                    for (var _iterator2 = _getIterator(fromKeys), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var fromKey = _step2.value;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = _getIterator(toKeys), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var toKey = _step3.value;

                                this._setRelationship(fromNodeType, fromKey, toNodeType, toKey);
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                                    _iterator3['return']();
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
                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                            _iterator2['return']();
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
                    for (var _iterator4 = _getIterator(fromKeys), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var fromKey = _step4.value;
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = _getIterator(toKeys), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var toKey = _step5.value;

                                this._appendOneToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                                    _iterator5['return']();
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
                        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                            _iterator4['return']();
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
                    for (var _iterator6 = _getIterator(fromKeys), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var fromKey = _step6.value;
                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            for (var _iterator7 = _getIterator(toKeys), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                var toKey = _step7.value;

                                this._appendManyToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);
                            }
                        } catch (err) {
                            _didIteratorError7 = true;
                            _iteratorError7 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                                    _iterator7['return']();
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
                        if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                            _iterator6['return']();
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
                        for (var _iterator8 = _getIterator(fromKeys), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var fromKey = _step8.value;
                            var _iteratorNormalCompletion9 = true;
                            var _didIteratorError9 = false;
                            var _iteratorError9 = undefined;

                            try {
                                for (var _iterator9 = _getIterator(toKeys), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                    var toKey = _step9.value;

                                    _this2.appendTo(fromNodeType, fromKey, toNodeType, toKey);
                                }
                            } catch (err) {
                                _didIteratorError9 = true;
                                _iteratorError9 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion9 && _iterator9['return']) {
                                        _iterator9['return']();
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
                            if (!_iteratorNormalCompletion8 && _iterator8['return']) {
                                _iterator8['return']();
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
                        for (var _iterator10 = _getIterator(ofKeys), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var ofKey = _step10.value;
                            var _iteratorNormalCompletion11 = true;
                            var _didIteratorError11 = false;
                            var _iteratorError11 = undefined;

                            try {
                                for (var _iterator11 = _getIterator(fromKeys), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                    var fromKey = _step11.value;

                                    _this3.removeFrom(ofNodeType, ofKey, fromNodeType, fromKey);
                                }
                            } catch (err) {
                                _didIteratorError11 = true;
                                _iteratorError11 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion11 && _iterator11['return']) {
                                        _iterator11['return']();
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
                            if (!_iteratorNormalCompletion10 && _iterator10['return']) {
                                _iterator10['return']();
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
                this._graph[fromNodeType][toNodeType] = new _bimap2['default']();
            } else {
                this._graph[toNodeType][fromNodeType] = new _bimap2['default']();
            }
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

            _Object$keys(this._graph).forEach(function (keyNodeType) {
                _Object$keys(_this4._graph[keyNodeType]).forEach(function (valueNodeType) {
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

            return _Object$keys(this._schemaMap).every(function (nodeType) {
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

        /**
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

            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = _getIterator(keys), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var key = _step12.value;

                    relationships.removeKey(key);

                    var _iteratorNormalCompletion13 = true;
                    var _didIteratorError13 = false;
                    var _iteratorError13 = undefined;

                    try {
                        for (var _iterator13 = _getIterator(values), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                            var value = _step13.value;

                            relationships.removeValue(value);
                        }
                    } catch (err) {
                        _didIteratorError13 = true;
                        _iteratorError13 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion13 && _iterator13['return']) {
                                _iterator13['return']();
                            }
                        } finally {
                            if (_didIteratorError13) {
                                throw _iteratorError13;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12['return']) {
                        _iterator12['return']();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
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
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = _getIterator(this._schemas), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var schema = _step14.value;

                    var fromType = schema.forType;
                    var toTypes = _Object$keys(schema.relationships);

                    var _iteratorNormalCompletion15 = true;
                    var _didIteratorError15 = false;
                    var _iteratorError15 = undefined;

                    try {
                        for (var _iterator15 = _getIterator(toTypes), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                            var toType = _step15.value;

                            if (this._graph[fromType] && this._graph[fromType][toType]) {
                                continue; // Bimap already created
                            }

                            var bimap = new _bimap2['default']();

                            if (this._isPrimaryType(fromType, toType)) {
                                this._mergeGraph(fromType, _defineProperty({}, toType, bimap));
                            } else {
                                this._mergeGraph(toType, _defineProperty({}, fromType, bimap));
                            }
                        }
                    } catch (err) {
                        _didIteratorError15 = true;
                        _iteratorError15 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion15 && _iterator15['return']) {
                                _iterator15['return']();
                            }
                        } finally {
                            if (_didIteratorError15) {
                                throw _iteratorError15;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError14 = true;
                _iteratorError14 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion14 && _iterator14['return']) {
                        _iterator14['return']();
                    }
                } finally {
                    if (_didIteratorError14) {
                        throw _iteratorError14;
                    }
                }
            }
        }
    }, {
        key: '_mergeGraph',
        value: function _mergeGraph(forType, object) {
            if (this._graph.hasOwnProperty(forType)) {
                _Object$assign(this._graph[forType], object);
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

            return values ? _Array$from(values) : [];
        }
    }, {
        key: '_getGraphValue',
        value: function _getGraphValue(fromType, toType, fromKey) {
            var relationships = this._getGraphFor(fromType, toType);

            var values = this._isPrimaryType(fromType, toType) ? relationships.getKeyValues(fromKey) : relationships.getValueKeys(fromKey);

            if (!values) {
                return undefined;
            }

            var _values = _slicedToArray(values, 1);

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

            _Object$keys(graphA._graph).forEach(function (primaryType) {
                _Object$keys(graphA._graph[primaryType]).forEach(function (secondaryType) {
                    var primaryRelationshipType = graphA._lookupRelationship(primaryType, secondaryType);
                    var secondaryRelationshipType = graphA._lookupRelationship(secondaryType, primaryType);

                    var relationshipsA = graphA._graph[primaryType][secondaryType];
                    var relationshipsB = graphB._graph[primaryType][secondaryType];
                    var mergedRelationships = undefined;

                    if (graphA._isOneToOneRelationship(primaryRelationshipType, secondaryRelationshipType)) {
                        mergedRelationships = _bimap2['default'].replace(relationshipsA, relationshipsB);
                    } else if (graphA._isOneToManyRelationship(primaryRelationshipType, secondaryRelationshipType)) {
                        var primaryTypeIsParent = primaryRelationshipType instanceof _relationships.HasManyRelationship;

                        if (primaryTypeIsParent) {
                            mergedRelationships = _bimap2['default'].mergeKeysReplaceValues(relationshipsA, relationshipsB);
                        } else {
                            mergedRelationships = _bimap2['default'].replaceKeysMergeValues(relationshipsA, relationshipsB);
                        }
                    } else if (graphA._isManyToManyRelationship(primaryRelationshipType, secondaryRelationshipType)) {
                        mergedRelationships = _bimap2['default'].merge(relationshipsA, relationshipsB);
                    } else {
                        throw new Error('Unknown relationship' + (' from ' + primaryType + ' with "' + primaryRelationshipType + '"') + (' to ' + secondaryType + ' with "' + secondaryRelationshipType + '"'));
                    }

                    resultGraph._mergeGraph(primaryType, _defineProperty({}, secondaryType, mergedRelationships));
                });
            });

            return resultGraph;
        }
    }]);

    return Graph;
})();

exports['default'] = Graph;
module.exports = exports['default'];

},{"../test/support/inspect":121,"./bimap":1,"./relationships":4,"babel-runtime/core-js/array/from":6,"babel-runtime/core-js/get-iterator":7,"babel-runtime/core-js/object/assign":10,"babel-runtime/core-js/object/keys":14,"babel-runtime/helpers/class-call-check":20,"babel-runtime/helpers/create-class":21,"babel-runtime/helpers/define-property":22,"babel-runtime/helpers/interop-require-default":25,"babel-runtime/helpers/sliced-to-array":27}],3:[function(_dereq_,module,exports){
'use strict';

var _Object$assign = _dereq_('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = _dereq_('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _schema = _dereq_('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _graph = _dereq_('./graph');

var _graph2 = _interopRequireDefault(_graph);

var _relationships = _dereq_('./relationships');

var Relationships = _interopRequireWildcard(_relationships);

exports['default'] = _Object$assign({
    Schema: _schema2['default'],
    Graph: _graph2['default']
}, Relationships);
module.exports = exports['default'];

},{"./graph":2,"./relationships":4,"./schema":5,"babel-runtime/core-js/object/assign":10,"babel-runtime/helpers/interop-require-default":25,"babel-runtime/helpers/interop-require-wildcard":26}],4:[function(_dereq_,module,exports){
/**
 * The relationship types used by `Schema`s and `Graph`s.
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _get = _dereq_('babel-runtime/helpers/get')['default'];

var _inherits = _dereq_('babel-runtime/helpers/inherits')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var Relationship = (function () {
    function Relationship(from, to) {
        _classCallCheck(this, Relationship);

        this.from = from;
        this.to = to;
    }

    _createClass(Relationship, [{
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

exports.Relationship = Relationship;

var HasOneRelationship = (function (_Relationship) {
    _inherits(HasOneRelationship, _Relationship);

    function HasOneRelationship() {
        _classCallCheck(this, HasOneRelationship);

        _get(Object.getPrototypeOf(HasOneRelationship.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HasOneRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Has One Relationship';
        }
    }]);

    return HasOneRelationship;
})(Relationship);

exports.HasOneRelationship = HasOneRelationship;

var HasManyRelationship = (function (_Relationship2) {
    _inherits(HasManyRelationship, _Relationship2);

    function HasManyRelationship() {
        _classCallCheck(this, HasManyRelationship);

        _get(Object.getPrototypeOf(HasManyRelationship.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HasManyRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Has Many Relationship';
        }
    }]);

    return HasManyRelationship;
})(Relationship);

exports.HasManyRelationship = HasManyRelationship;

var BelongsToRelationship = (function (_Relationship3) {
    _inherits(BelongsToRelationship, _Relationship3);

    function BelongsToRelationship() {
        _classCallCheck(this, BelongsToRelationship);

        _get(Object.getPrototypeOf(BelongsToRelationship.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(BelongsToRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Belongs To Relationship';
        }
    }]);

    return BelongsToRelationship;
})(Relationship);

exports.BelongsToRelationship = BelongsToRelationship;

var HasAndBelongsToManyRelationship = (function (_Relationship4) {
    _inherits(HasAndBelongsToManyRelationship, _Relationship4);

    function HasAndBelongsToManyRelationship() {
        _classCallCheck(this, HasAndBelongsToManyRelationship);

        _get(Object.getPrototypeOf(HasAndBelongsToManyRelationship.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HasAndBelongsToManyRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Has and Belongs To Many Relationship';
        }
    }]);

    return HasAndBelongsToManyRelationship;
})(Relationship);

exports.HasAndBelongsToManyRelationship = HasAndBelongsToManyRelationship;

},{"babel-runtime/helpers/class-call-check":20,"babel-runtime/helpers/create-class":21,"babel-runtime/helpers/get":23,"babel-runtime/helpers/inherits":24}],5:[function(_dereq_,module,exports){
'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = _dereq_('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _relationships = _dereq_('./relationships');

/**
 * Defines a type of node's relationships with another node. A node is simply a unit
 * of data. For example, one node type might be a `car` and another is a `wheel`.
 * A `Schema` for `car` would specify it `hasMany` `wheels` and likewise, a `wheel`
 * `Schema` would specify it `belongsTo` a `car`.
 */

var Schema = (function () {
    function Schema(forType) {
        _classCallCheck(this, Schema);

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

    _createClass(Schema, [{
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

            var relatedNodeTypes = _Object$keys(this.relationships);

            if (relatedNodeTypes.length !== _Object$keys(otherSchema.relationships).length) {
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

exports['default'] = Schema;
module.exports = exports['default'];

},{"./relationships":4,"babel-runtime/core-js/object/keys":14,"babel-runtime/helpers/class-call-check":20,"babel-runtime/helpers/create-class":21}],6:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":28}],7:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":29}],8:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":30}],9:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":31}],10:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":32}],11:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":33}],12:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":34}],13:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":35}],14:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":36}],15:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":37}],16:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":38}],17:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":39}],18:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":40}],19:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":41}],20:[function(_dereq_,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],21:[function(_dereq_,module,exports){
"use strict";

var _Object$defineProperty = _dereq_("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":12}],22:[function(_dereq_,module,exports){
"use strict";

var _Object$defineProperty = _dereq_("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = function (obj, key, value) {
  if (key in obj) {
    _Object$defineProperty(obj, key, {
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
},{"babel-runtime/core-js/object/define-property":12}],23:[function(_dereq_,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = _dereq_("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    desc = parent = getter = undefined;
    _again = false;
    if (object === null) object = Function.prototype;

    var desc = _Object$getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/get-own-property-descriptor":13}],24:[function(_dereq_,module,exports){
"use strict";

var _Object$create = _dereq_("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = _dereq_("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":11,"babel-runtime/core-js/object/set-prototype-of":15}],25:[function(_dereq_,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],26:[function(_dereq_,module,exports){
"use strict";

exports["default"] = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
};

exports.__esModule = true;
},{}],27:[function(_dereq_,module,exports){
"use strict";

var _getIterator = _dereq_("babel-runtime/core-js/get-iterator")["default"];

var _isIterable = _dereq_("babel-runtime/core-js/is-iterable")["default"];

exports["default"] = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
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
    } else if (_isIterable(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/get-iterator":7,"babel-runtime/core-js/is-iterable":8}],28:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.string.iterator');
_dereq_('../../modules/es6.array.from');
module.exports = _dereq_('../../modules/$.core').Array.from;
},{"../../modules/$.core":50,"../../modules/es6.array.from":100,"../../modules/es6.string.iterator":110}],29:[function(_dereq_,module,exports){
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.string.iterator');
module.exports = _dereq_('../modules/core.get-iterator');
},{"../modules/core.get-iterator":98,"../modules/es6.string.iterator":110,"../modules/web.dom.iterable":114}],30:[function(_dereq_,module,exports){
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.string.iterator');
module.exports = _dereq_('../modules/core.is-iterable');
},{"../modules/core.is-iterable":99,"../modules/es6.string.iterator":110,"../modules/web.dom.iterable":114}],31:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.map');
_dereq_('../modules/es7.map.to-json');
module.exports = _dereq_('../modules/$.core').Map;
},{"../modules/$.core":50,"../modules/es6.map":102,"../modules/es6.object.to-string":107,"../modules/es6.string.iterator":110,"../modules/es7.map.to-json":112,"../modules/web.dom.iterable":114}],32:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.assign');
module.exports = _dereq_('../../modules/$.core').Object.assign;
},{"../../modules/$.core":50,"../../modules/es6.object.assign":103}],33:[function(_dereq_,module,exports){
var $ = _dereq_('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":73}],34:[function(_dereq_,module,exports){
var $ = _dereq_('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":73}],35:[function(_dereq_,module,exports){
var $ = _dereq_('../../modules/$');
_dereq_('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":73,"../../modules/es6.object.get-own-property-descriptor":104}],36:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.keys');
module.exports = _dereq_('../../modules/$.core').Object.keys;
},{"../../modules/$.core":50,"../../modules/es6.object.keys":105}],37:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.set-prototype-of');
module.exports = _dereq_('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":50,"../../modules/es6.object.set-prototype-of":106}],38:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
module.exports = _dereq_('../modules/$.core').Promise;
},{"../modules/$.core":50,"../modules/es6.object.to-string":107,"../modules/es6.promise":108,"../modules/es6.string.iterator":110,"../modules/web.dom.iterable":114}],39:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.set');
_dereq_('../modules/es7.set.to-json');
module.exports = _dereq_('../modules/$.core').Set;
},{"../modules/$.core":50,"../modules/es6.object.to-string":107,"../modules/es6.set":109,"../modules/es6.string.iterator":110,"../modules/es7.set.to-json":113,"../modules/web.dom.iterable":114}],40:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.symbol');
module.exports = _dereq_('../../modules/$.core').Symbol;
},{"../../modules/$.core":50,"../../modules/es6.symbol":111}],41:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.string.iterator');
_dereq_('../../modules/web.dom.iterable');
module.exports = _dereq_('../../modules/$.wks')('iterator');
},{"../../modules/$.wks":96,"../../modules/es6.string.iterator":110,"../../modules/web.dom.iterable":114}],42:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],43:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":66}],44:[function(_dereq_,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var toObject = _dereq_('./$.to-object')
  , IObject  = _dereq_('./$.iobject')
  , enumKeys = _dereq_('./$.enum-keys');

module.exports = _dereq_('./$.fails')(function(){
  return Symbol() in Object.assign({}); // Object.assign available and Symbol is native
}) ? function assign(target, source){   // eslint-disable-line no-unused-vars
  var T = toObject(target)
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = IObject(arguments[i++])
      , keys   = enumKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
} : Object.assign;
},{"./$.enum-keys":55,"./$.fails":56,"./$.iobject":64,"./$.to-object":93}],45:[function(_dereq_,module,exports){
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
},{"./$.cof":46,"./$.wks":96}],46:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],47:[function(_dereq_,module,exports){
'use strict';
var $            = _dereq_('./$')
  , hide         = _dereq_('./$.hide')
  , ctx          = _dereq_('./$.ctx')
  , species      = _dereq_('./$.species')
  , strictNew    = _dereq_('./$.strict-new')
  , defined      = _dereq_('./$.defined')
  , forOf        = _dereq_('./$.for-of')
  , step         = _dereq_('./$.iter-step')
  , ID           = _dereq_('./$.uid')('id')
  , $has         = _dereq_('./$.has')
  , isObject     = _dereq_('./$.is-object')
  , isExtensible = Object.isExtensible || isObject
  , SUPPORT_DESC = _dereq_('./$.support-desc')
  , SIZE         = SUPPORT_DESC ? '_s' : 'size'
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
    _dereq_('./$.mix')(C.prototype, {
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
        var f = ctx(callbackfn, arguments[1], 3)
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
    if(SUPPORT_DESC)$.setDesc(C.prototype, 'size', {
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
    _dereq_('./$.iter-define')(C, NAME, function(iterated, kind){
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
    species(C);
    species(_dereq_('./$.core')[NAME]); // for wrapper
  }
};
},{"./$":73,"./$.core":50,"./$.ctx":51,"./$.defined":53,"./$.for-of":57,"./$.has":60,"./$.hide":61,"./$.is-object":66,"./$.iter-define":69,"./$.iter-step":71,"./$.mix":77,"./$.species":84,"./$.strict-new":85,"./$.support-desc":87,"./$.uid":94}],48:[function(_dereq_,module,exports){
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
},{"./$.classof":45,"./$.for-of":57}],49:[function(_dereq_,module,exports){
'use strict';
var $          = _dereq_('./$')
  , $def       = _dereq_('./$.def')
  , hide       = _dereq_('./$.hide')
  , forOf      = _dereq_('./$.for-of')
  , strictNew  = _dereq_('./$.strict-new');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = _dereq_('./$.global')[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!_dereq_('./$.support-desc') || typeof C != 'function'
    || !(IS_WEAK || proto.forEach && !_dereq_('./$.fails')(function(){ new C().entries().next(); }))
  ){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _dereq_('./$.mix')(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      strictNew(target, C, NAME);
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var chain = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return chain ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  _dereq_('./$.tag')(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$":73,"./$.def":52,"./$.fails":56,"./$.for-of":57,"./$.global":59,"./$.hide":61,"./$.mix":77,"./$.strict-new":85,"./$.support-desc":87,"./$.tag":88}],50:[function(_dereq_,module,exports){
var core = module.exports = {};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],51:[function(_dereq_,module,exports){
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
  } return function(/* ...args */){
      return fn.apply(that, arguments);
    };
};
},{"./$.a-function":42}],52:[function(_dereq_,module,exports){
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
},{"./$.core":50,"./$.global":59}],53:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],54:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object')
  , document = _dereq_('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":59,"./$.is-object":66}],55:[function(_dereq_,module,exports){
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
},{"./$":73}],56:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],57:[function(_dereq_,module,exports){
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
},{"./$.an-object":43,"./$.ctx":51,"./$.is-array-iter":65,"./$.iter-call":67,"./$.to-length":92,"./core.get-iterator-method":97}],58:[function(_dereq_,module,exports){
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
},{"./$":73,"./$.to-iobject":91}],59:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var UNDEFINED = 'undefined';
var global = module.exports = typeof window != UNDEFINED && window.Math == Math
  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],60:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],61:[function(_dereq_,module,exports){
var $          = _dereq_('./$')
  , createDesc = _dereq_('./$.property-desc');
module.exports = _dereq_('./$.support-desc') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":73,"./$.property-desc":79,"./$.support-desc":87}],62:[function(_dereq_,module,exports){
module.exports = _dereq_('./$.global').document && document.documentElement;
},{"./$.global":59}],63:[function(_dereq_,module,exports){
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
},{}],64:[function(_dereq_,module,exports){
// indexed object, fallback for non-array-like ES3 strings
var cof = _dereq_('./$.cof');
module.exports = 0 in Object('z') ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":46}],65:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators = _dereq_('./$.iterators')
  , ITERATOR  = _dereq_('./$.wks')('iterator');
module.exports = function(it){
  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
};
},{"./$.iterators":72,"./$.wks":96}],66:[function(_dereq_,module,exports){
// http://jsperf.com/core-js-isobject
module.exports = function(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
};
},{}],67:[function(_dereq_,module,exports){
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
},{"./$.an-object":43}],68:[function(_dereq_,module,exports){
'use strict';
var $ = _dereq_('./$')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./$.hide')(IteratorPrototype, _dereq_('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: _dereq_('./$.property-desc')(1,next)});
  _dereq_('./$.tag')(Constructor, NAME + ' Iterator');
};
},{"./$":73,"./$.hide":61,"./$.property-desc":79,"./$.tag":88,"./$.wks":96}],69:[function(_dereq_,module,exports){
'use strict';
var LIBRARY         = _dereq_('./$.library')
  , $def            = _dereq_('./$.def')
  , $redef          = _dereq_('./$.redef')
  , hide            = _dereq_('./$.hide')
  , has             = _dereq_('./$.has')
  , SYMBOL_ITERATOR = _dereq_('./$.wks')('iterator')
  , Iterators       = _dereq_('./$.iterators')
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  _dereq_('./$.iter-create')(Constructor, NAME, next);
  var createMethod = function(kind){
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = _dereq_('./$').getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    _dereq_('./$.tag')(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      keys:    IS_SET            ? _default : createMethod(KEYS),
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
};
},{"./$":73,"./$.def":52,"./$.has":60,"./$.hide":61,"./$.iter-create":68,"./$.iterators":72,"./$.library":75,"./$.redef":80,"./$.tag":88,"./$.wks":96}],70:[function(_dereq_,module,exports){
var SYMBOL_ITERATOR = _dereq_('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec){
  if(!SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":96}],71:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],72:[function(_dereq_,module,exports){
module.exports = {};
},{}],73:[function(_dereq_,module,exports){
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
},{}],74:[function(_dereq_,module,exports){
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
},{"./$":73,"./$.to-iobject":91}],75:[function(_dereq_,module,exports){
module.exports = true;
},{}],76:[function(_dereq_,module,exports){
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
}

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
},{"./$.cof":46,"./$.global":59,"./$.task":89}],77:[function(_dereq_,module,exports){
var $redef = _dereq_('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":80}],78:[function(_dereq_,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = _dereq_('./$.def')
    , fn   = (_dereq_('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * _dereq_('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":50,"./$.def":52,"./$.fails":56}],79:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],80:[function(_dereq_,module,exports){
module.exports = _dereq_('./$.hide');
},{"./$.hide":61}],81:[function(_dereq_,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],82:[function(_dereq_,module,exports){
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
  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
    ? function(buggy, set){
        try {
          set = _dereq_('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
          set({}, []);
        } catch(e){ buggy = true; }
        return function setPrototypeOf(O, proto){
          check(O, proto);
          if(buggy)O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }()
    : undefined),
  check: check
};
},{"./$":73,"./$.an-object":43,"./$.ctx":51,"./$.is-object":66}],83:[function(_dereq_,module,exports){
var global = _dereq_('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":59}],84:[function(_dereq_,module,exports){
'use strict';
var $       = _dereq_('./$')
  , SPECIES = _dereq_('./$.wks')('species');
module.exports = function(C){
  if(_dereq_('./$.support-desc') && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":73,"./$.support-desc":87,"./$.wks":96}],85:[function(_dereq_,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],86:[function(_dereq_,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = _dereq_('./$.to-integer')
  , defined   = _dereq_('./$.defined');
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
},{"./$.defined":53,"./$.to-integer":90}],87:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":56}],88:[function(_dereq_,module,exports){
var has  = _dereq_('./$.has')
  , hide = _dereq_('./$.hide')
  , TAG  = _dereq_('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))hide(it, TAG, tag);
};
},{"./$.has":60,"./$.hide":61,"./$.wks":96}],89:[function(_dereq_,module,exports){
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
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScript){
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
},{"./$.cof":46,"./$.ctx":51,"./$.dom-create":54,"./$.global":59,"./$.html":62,"./$.invoke":63}],90:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],91:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./$.iobject')
  , defined = _dereq_('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":53,"./$.iobject":64}],92:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":90}],93:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":53}],94:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],95:[function(_dereq_,module,exports){
module.exports = function(){ /* empty */ };
},{}],96:[function(_dereq_,module,exports){
var store  = _dereq_('./$.shared')('wks')
  , Symbol = _dereq_('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || _dereq_('./$.uid'))('Symbol.' + name));
};
},{"./$.global":59,"./$.shared":83,"./$.uid":94}],97:[function(_dereq_,module,exports){
var classof   = _dereq_('./$.classof')
  , ITERATOR  = _dereq_('./$.wks')('iterator')
  , Iterators = _dereq_('./$.iterators');
module.exports = _dereq_('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};
},{"./$.classof":45,"./$.core":50,"./$.iterators":72,"./$.wks":96}],98:[function(_dereq_,module,exports){
var anObject = _dereq_('./$.an-object')
  , get      = _dereq_('./core.get-iterator-method');
module.exports = _dereq_('./$.core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./$.an-object":43,"./$.core":50,"./core.get-iterator-method":97}],99:[function(_dereq_,module,exports){
var classof   = _dereq_('./$.classof')
  , ITERATOR  = _dereq_('./$.wks')('iterator')
  , Iterators = _dereq_('./$.iterators');
module.exports = _dereq_('./$.core').isIterable = function(it){
  var O = Object(it);
  return ITERATOR in O || '@@iterator' in O || Iterators.hasOwnProperty(classof(O));
};
},{"./$.classof":45,"./$.core":50,"./$.iterators":72,"./$.wks":96}],100:[function(_dereq_,module,exports){
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
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, arguments[2], 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      for(result = new C(length = toLength(O.length)); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});
},{"./$.ctx":51,"./$.def":52,"./$.is-array-iter":65,"./$.iter-call":67,"./$.iter-detect":70,"./$.to-length":92,"./$.to-object":93,"./core.get-iterator-method":97}],101:[function(_dereq_,module,exports){
'use strict';
var setUnscope = _dereq_('./$.unscope')
  , step       = _dereq_('./$.iter-step')
  , Iterators  = _dereq_('./$.iterators')
  , toIObject  = _dereq_('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
_dereq_('./$.iter-define')(Array, 'Array', function(iterated, kind){
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

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$.iter-define":69,"./$.iter-step":71,"./$.iterators":72,"./$.to-iobject":91,"./$.unscope":95}],102:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./$.collection-strong');

// 23.1 Map Objects
_dereq_('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments[0]); };
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
},{"./$.collection":49,"./$.collection-strong":47}],103:[function(_dereq_,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = _dereq_('./$.def');

$def($def.S + $def.F, 'Object', {assign: _dereq_('./$.assign')});
},{"./$.assign":44,"./$.def":52}],104:[function(_dereq_,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = _dereq_('./$.to-iobject');

_dereq_('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":78,"./$.to-iobject":91}],105:[function(_dereq_,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = _dereq_('./$.to-object');

_dereq_('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":78,"./$.to-object":93}],106:[function(_dereq_,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = _dereq_('./$.def');
$def($def.S, 'Object', {setPrototypeOf: _dereq_('./$.set-proto').set});
},{"./$.def":52,"./$.set-proto":82}],107:[function(_dereq_,module,exports){

},{}],108:[function(_dereq_,module,exports){
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
  , same       = _dereq_('./$.same')
  , species    = _dereq_('./$.species')
  , SPECIES    = _dereq_('./$.wks')('species')
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
    if(works && _dereq_('./$.support-desc')){
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
      if(isUnhandled(record.p)){
        if(isNode){
          process.emit('unhandledRejection', value, record.p);
        } else if(global.console && console.error){
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
      var S = anObject(anObject(this).constructor)[SPECIES];
      var react = {
        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
        fail: typeof onRejected == 'function'  ? onRejected  : false
      };
      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
        react.res = aFunction(res);
        react.rej = aFunction(rej);
      });
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
_dereq_('./$.tag')(P, PROMISE);
species(P);
species(Wrapper = _dereq_('./$.core')[PROMISE]);

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
},{"./$":73,"./$.a-function":42,"./$.an-object":43,"./$.classof":45,"./$.core":50,"./$.ctx":51,"./$.def":52,"./$.for-of":57,"./$.global":59,"./$.is-object":66,"./$.iter-detect":70,"./$.library":75,"./$.microtask":76,"./$.mix":77,"./$.same":81,"./$.set-proto":82,"./$.species":84,"./$.strict-new":85,"./$.support-desc":87,"./$.tag":88,"./$.uid":94,"./$.wks":96}],109:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./$.collection-strong');

// 23.2 Set Objects
_dereq_('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments[0]); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":49,"./$.collection-strong":47}],110:[function(_dereq_,module,exports){
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
},{"./$.iter-define":69,"./$.string-at":86}],111:[function(_dereq_,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = _dereq_('./$')
  , global         = _dereq_('./$.global')
  , has            = _dereq_('./$.has')
  , SUPPORT_DESC   = _dereq_('./$.support-desc')
  , $def           = _dereq_('./$.def')
  , $redef         = _dereq_('./$.redef')
  , shared         = _dereq_('./$.shared')
  , setTag         = _dereq_('./$.tag')
  , uid            = _dereq_('./$.uid')
  , wks            = _dereq_('./$.wks')
  , keyOf          = _dereq_('./$.keyof')
  , $names         = _dereq_('./$.get-names')
  , enumKeys       = _dereq_('./$.enum-keys')
  , isObject       = _dereq_('./$.is-object')
  , anObject       = _dereq_('./$.an-object')
  , toIObject      = _dereq_('./$.to-iobject')
  , createDesc     = _dereq_('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

var setSymbolDesc = SUPPORT_DESC ? function(){ // fallback for old Android
  try {
    return _create(setDesc({}, HIDDEN, {
      get: function(){
        return setDesc(this, HIDDEN, {value: false})[HIDDEN];
      }
    }))[HIDDEN] || setDesc;
  } catch(e){
    return function(it, key, D){
      var protoDesc = getDesc(ObjectProto, key);
      if(protoDesc)delete ObjectProto[key];
      setDesc(it, key, D);
      if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
    };
  }
}() : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  SUPPORT_DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
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

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments[0]));
  };
  $redef($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(SUPPORT_DESC && !_dereq_('./$.library')){
    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values in objects to JSON as null
if(!useNative || _dereq_('./$.fails')(function(){
  return JSON.stringify([{a: $Symbol()}, [$Symbol()]]) != '[{},[null]]';
}))$redef($Symbol.prototype, 'toJSON', function toJSON(){
  if(useNative && isObject(this))return this;
});

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
  }
);

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

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag(global.JSON, 'JSON', true);
},{"./$":73,"./$.an-object":43,"./$.def":52,"./$.enum-keys":55,"./$.fails":56,"./$.get-names":58,"./$.global":59,"./$.has":60,"./$.is-object":66,"./$.keyof":74,"./$.library":75,"./$.property-desc":79,"./$.redef":80,"./$.shared":83,"./$.support-desc":87,"./$.tag":88,"./$.to-iobject":91,"./$.uid":94,"./$.wks":96}],112:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = _dereq_('./$.def');

$def($def.P, 'Map', {toJSON: _dereq_('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":48,"./$.def":52}],113:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = _dereq_('./$.def');

$def($def.P, 'Set', {toJSON: _dereq_('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":48,"./$.def":52}],114:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var Iterators = _dereq_('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":72,"./es6.array.iterator":101}],115:[function(_dereq_,module,exports){
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
  delete g.regeneratorRuntime;
}

module.exports = { "default": module.exports, __esModule: true };

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./runtime":116}],116:[function(_dereq_,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

"use strict";

var _Symbol = _dereq_("babel-runtime/core-js/symbol")["default"];

var _Symbol$iterator = _dereq_("babel-runtime/core-js/symbol/iterator")["default"];

var _Object$create = _dereq_("babel-runtime/core-js/object/create")["default"];

var _Promise = _dereq_("babel-runtime/core-js/promise")["default"];

!(function (global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol = typeof _Symbol === "function" && _Symbol$iterator || "@@iterator";

  var inModule = typeof module === "object";
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
    var generator = _Object$create((outerFn || Generator).prototype);

    generator._invoke = makeInvokeMethod(innerFn, self || null, new Context(tryLocsList || []));

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
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = _Object$create(Gp);
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
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument ? _Promise.resolve(value.arg).then(invokeNext, invokeThrow) : _Promise.resolve(value).then(function (unwrapped) {
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
        return result;
      });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      var enqueueResult =
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
      previousPromise ? previousPromise.then(function () {
        return invoke(method, arg);
      }) : new _Promise(function (resolve) {
        resolve(invoke(method, arg));
      });

      // Avoid propagating enqueueResult failures to Promises returned by
      // later invocations of the iterator.
      previousPromise = enqueueResult["catch"](function (ignored) {});

      return enqueueResult;
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
typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : undefined);
}).call(this,_dereq_('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":118,"babel-runtime/core-js/object/create":11,"babel-runtime/core-js/promise":16,"babel-runtime/core-js/symbol":18,"babel-runtime/core-js/symbol/iterator":19}],117:[function(_dereq_,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],118:[function(_dereq_,module,exports){
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

},{}],119:[function(_dereq_,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],120:[function(_dereq_,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = _dereq_('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = _dereq_('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,_dereq_('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":119,"_process":118,"inherits":117}],121:[function(_dereq_,module,exports){
'use strict';

var _Object$keys = _dereq_('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.inspectGraph = inspectGraph;

var _util = _dereq_('util');

var _libBimap = _dereq_('../../lib/bimap');

var _libBimap2 = _interopRequireDefault(_libBimap);

function inspectGraph(graph) {
    function toLiteralRecursive(scope) {
        var accumulator = {};

        _Object$keys(scope).forEach(function (key) {
            if (scope[key] instanceof _libBimap2['default']) {
                accumulator[key] = scope[key].toLiteral();
            } else {
                accumulator[key] = toLiteralRecursive(scope[key]);
            }
        });

        return accumulator;
    }

    console.log((0, _util.inspect)(toLiteralRecursive(graph._graph), { depth: null }));
}

},{"../../lib/bimap":1,"babel-runtime/core-js/object/keys":14,"babel-runtime/helpers/interop-require-default":25,"util":120}]},{},[3])(3)
});