(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.relatedjs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Support class for bi-directional key-value maps used internally to power
 * storing relationships for a `Graph`.
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Map = require("babel-runtime/core-js/map")["default"];

var _Array$from = require("babel-runtime/core-js/array/from")["default"];

var _Set = require("babel-runtime/core-js/set")["default"];

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

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
        value: function appendKeyToValue(value, key) {
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
            this._removeKeyLinkTo(key, value);
            this._removeValueLinkTo(value, key);
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
    }]);

    return Bimap;
})();

exports["default"] = Bimap;
module.exports = exports["default"];

},{"babel-runtime/core-js/array/from":6,"babel-runtime/core-js/get-iterator":7,"babel-runtime/core-js/map":9,"babel-runtime/core-js/set":16,"babel-runtime/helpers/class-call-check":17,"babel-runtime/helpers/create-class":18}],2:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _relationships = require('./relationships');

var _bimap = require('./bimap');

var _bimap2 = _interopRequireDefault(_bimap);

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
         * @param toNodeType Type of node.
         * @param toKey Key of the node.
         * @param fromNodeType Other type of node.
         * @param fromKey Key of the other node.
         * @returns {Graph}
         */
        value: function setTo(toNodeType, toKey, fromNodeType, fromKey) {
            var toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);
            var fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);

            if (!this._isOneToOneRelationship(fromToRelationship, toFromRelationship) && !this._isOneToManyRelationship(fromToRelationship, toFromRelationship) && !this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {

                throw new Error('Unknown relationship' + (' from ' + fromNodeType + ' with "' + fromToRelationship + '"') + (' to ' + toNodeType + ' with "' + toFromRelationship + '"'));
            }

            this._setRelationship(fromNodeType, fromKey, toNodeType, toKey);

            return this;
        }

        /**
         * Convenience method for {Graph#setTo}. Use it as:
         *
         * ```
         * set(nodeType, nodeKey).to(nodeType, nodeKey)
         * ```
         */
    }, {
        key: 'set',
        value: function set(fromNodeType, fromKey) {
            var _this = this;

            return {
                to: function to(toNodeType, toKey) {
                    return _this.setTo(fromNodeType, fromKey, toNodeType, toKey);
                }
            };
        }

        /**
         * Append a relationship between nodes. This only works for nodes that have a
         * relationship of one-to-many or many-to-many, otherwise it works the same as
         * {Graph#setTo}.
         *
         * @param toNodeType Type of node.
         * @param toKey Key of the node.
         * @param fromNodeType Other type of node.
         * @param fromKey Key of the other node.
         * @returns {Graph}
         */
    }, {
        key: 'appendTo',
        value: function appendTo(toNodeType, toKey, fromNodeType, fromKey) {
            var toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);
            var fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);

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
         * append(nodeType, nodeKey).to(nodeType, nodeKey)
         * ```
         */
    }, {
        key: 'append',
        value: function append(fromNodeType, fromKey) {
            var _this2 = this;

            return {
                to: function to(toNodeType, toKey) {
                    return _this2.appendTo(toNodeType, toKey, fromNodeType, fromKey);
                }
            };
        }

        /**
         * Removes a relationship between two nodes.
         *
         * @param fromNodeType Type of node.
         * @param fromKey Key of the node.
         * @param ofNodeType Other type of node.
         * @param ofKey Key of the other node.
         * @returns {Graph}
         */
    }, {
        key: 'removeFrom',
        value: function removeFrom(fromNodeType, fromKey, ofNodeType, ofKey) {
            var fromToRelationship = this._lookupRelationship(fromNodeType, ofNodeType);
            var toFromRelationship = this._lookupRelationship(ofNodeType, fromNodeType);

            if (!this._isOneToOneRelationship(fromToRelationship, toFromRelationship) && !this._isOneToManyRelationship(fromToRelationship, toFromRelationship) && !this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {

                throw new Error('Unknown relationship' + (' from ' + fromNodeType + ' with "' + fromToRelationship + '"') + (' to ' + toNodeType + ' with "' + toFromRelationship + '"'));
            }

            this._removeRelationship(fromNodeType, fromKey, ofNodeType, ofKey);

            return this;
        }

        /**
         * Convenience method for {Graph#removeFrom}. Use it as:
         *
         * ```
         * remove(nodeType, nodeKey).from(nodeType, nodeKey)
         * ```
         */
    }, {
        key: 'remove',
        value: function remove(ofNodeType, ofKey) {
            var _this3 = this;

            return {
                from: function from(fromNodeType, fromKey) {
                    return _this3.removeFrom(fromNodeType, fromKey, ofNodeType, ofKey);
                }
            };
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
    }, {
        key: '_setRelationship',
        value: function _setRelationship(fromType, fromKey, toType, toKey) {
            if (fromType > toType) {
                var graph = this._graph[fromType][toType];
                graph.set(fromKey, toKey);
            } else {
                var graph = this._graph[toType][fromType];
                graph.set(toKey, fromKey);
            }
        }
    }, {
        key: '_removeRelationship',
        value: function _removeRelationship(toType, toKey, fromType, fromKey) {
            if (fromType > toType) {
                var graph = this._graph[fromType][toType];
                graph.remove(fromKey, toKey);
            } else {
                var graph = this._graph[toType][fromType];
                graph.remove(toKey, fromKey);
            }
        }
    }, {
        key: '_appendOneToManyRelationship',
        value: function _appendOneToManyRelationship(toType, toKey, fromType, fromKey) {
            if (fromType > toType) {
                var graph = this._graph[fromType][toType];
                graph.appendValueToKey(fromKey, toKey);
            } else {
                var graph = this._graph[toType][fromType];
                graph.appendKeyToValue(fromKey, toKey);
            }
        }
    }, {
        key: '_appendManyToManyRelationship',
        value: function _appendManyToManyRelationship(toType, toKey, fromType, fromKey) {
            if (fromType > toType) {
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
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _getIterator(this._schemas), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var schema = _step2.value;

                    var fromType = schema.forType;
                    var toTypes = _Object$keys(schema.relationships);

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = _getIterator(toTypes), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var toType = _step3.value;

                            if (this._graph[fromType] && this._graph[fromType][toType]) {
                                continue; // Bimap already created
                            }

                            var bimap = new _bimap2['default']();

                            if (fromType > toType) {
                                this._mergeGraph(fromType, _defineProperty({}, toType, bimap));
                            } else {
                                this._mergeGraph(toType, _defineProperty({}, fromType, bimap));
                            }
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
        }
    }, {
        key: '_mergeGraph',
        value: function _mergeGraph(forType, object) {
            if (this._graph[forType]) {
                _Object$assign(this._graph[forType], object);
            } else {
                this._graph[forType] = object;
            }
        }
    }, {
        key: '_getGraphFor',
        value: function _getGraphFor(fromType, toType) {
            if (fromType > toType) {
                return this._graph[fromType][toType];
            } else {
                return this._graph[toType][fromType];
            }
        }
    }, {
        key: '_getGraphValues',
        value: function _getGraphValues(fromType, toType, fromKey) {
            var relationships = this._getGraphFor(fromType, toType);

            var values = fromType > toType ? relationships.getKeyValues(fromKey) : relationships.getValueKeys(fromKey);

            return values ? _Array$from(values) : [];
        }
    }, {
        key: '_getGraphValue',
        value: function _getGraphValue(fromType, toType, fromKey) {
            var relationships = this._getGraphFor(fromType, toType);

            var values = fromType > toType ? relationships.getKeyValues(fromKey) : relationships.getValueKeys(fromKey);

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
    }]);

    return Graph;
})();

exports['default'] = Graph;
module.exports = exports['default'];

},{"./bimap":1,"./relationships":4,"babel-runtime/core-js/array/from":6,"babel-runtime/core-js/get-iterator":7,"babel-runtime/core-js/object/assign":10,"babel-runtime/core-js/object/keys":14,"babel-runtime/helpers/class-call-check":17,"babel-runtime/helpers/create-class":18,"babel-runtime/helpers/define-property":19,"babel-runtime/helpers/interop-require-default":22,"babel-runtime/helpers/sliced-to-array":24}],3:[function(require,module,exports){
'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _graph = require('./graph');

var _graph2 = _interopRequireDefault(_graph);

var _relationships = require('./relationships');

var Relationships = _interopRequireWildcard(_relationships);

exports['default'] = _Object$assign({
    Schema: _schema2['default'],
    Graph: _graph2['default']
}, Relationships);
module.exports = exports['default'];

},{"./graph":2,"./relationships":4,"./schema":5,"babel-runtime/core-js/object/assign":10,"babel-runtime/helpers/interop-require-default":22,"babel-runtime/helpers/interop-require-wildcard":23}],4:[function(require,module,exports){
/**
 * The relationship types used by `Schema`s and `Graph`s.
 */

'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var Relationship = function Relationship(from, to) {
    _classCallCheck(this, Relationship);

    this.from = from;
    this.to = to;
};

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

},{"babel-runtime/helpers/class-call-check":17,"babel-runtime/helpers/create-class":18,"babel-runtime/helpers/get":20,"babel-runtime/helpers/inherits":21}],5:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _relationships = require('./relationships');

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

},{"./relationships":4,"babel-runtime/helpers/class-call-check":17,"babel-runtime/helpers/create-class":18}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":25}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":26}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":27}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":28}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":29}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":30}],12:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":31}],13:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":32}],14:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":33}],15:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":34}],16:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":35}],17:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],18:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

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
},{"babel-runtime/core-js/object/define-property":12}],19:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

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
},{"babel-runtime/core-js/object/define-property":12}],20:[function(require,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

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
},{"babel-runtime/core-js/object/get-own-property-descriptor":13}],21:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

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
},{"babel-runtime/core-js/object/create":11,"babel-runtime/core-js/object/set-prototype-of":15}],22:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
"use strict";

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

var _isIterable = require("babel-runtime/core-js/is-iterable")["default"];

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
},{"babel-runtime/core-js/get-iterator":7,"babel-runtime/core-js/is-iterable":8}],25:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/$.core').Array.from;
},{"../../modules/$.core":44,"../../modules/es6.array.from":86,"../../modules/es6.string.iterator":95}],26:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":84,"../modules/es6.string.iterator":95,"../modules/web.dom.iterable":98}],27:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');
},{"../modules/core.is-iterable":85,"../modules/es6.string.iterator":95,"../modules/web.dom.iterable":98}],28:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
module.exports = require('../modules/$.core').Map;
},{"../modules/$.core":44,"../modules/es6.map":88,"../modules/es6.object.to-string":93,"../modules/es6.string.iterator":95,"../modules/es7.map.to-json":96,"../modules/web.dom.iterable":98}],29:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/$.core').Object.assign;
},{"../../modules/$.core":44,"../../modules/es6.object.assign":89}],30:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":63}],31:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":63}],32:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":63,"../../modules/es6.object.get-own-property-descriptor":90}],33:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":44,"../../modules/es6.object.keys":91}],34:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":44,"../../modules/es6.object.set-prototype-of":92}],35:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
require('../modules/es7.set.to-json');
module.exports = require('../modules/$.core').Set;
},{"../modules/$.core":44,"../modules/es6.object.to-string":93,"../modules/es6.set":94,"../modules/es6.string.iterator":95,"../modules/es7.set.to-json":97,"../modules/web.dom.iterable":98}],36:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],37:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":56}],38:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var toObject = require('./$.to-object')
  , IObject  = require('./$.iobject')
  , enumKeys = require('./$.enum-keys');

module.exports = require('./$.fails')(function(){
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
},{"./$.enum-keys":48,"./$.fails":49,"./$.iobject":54,"./$.to-object":79}],39:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
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
},{"./$.cof":40,"./$.wks":82}],40:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],41:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , ctx          = require('./$.ctx')
  , species      = require('./$.species')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , isExtensible = Object.isExtensible || isObject
  , SUPPORT_DESC = require('./$.support-desc')
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
    require('./$.mix')(C.prototype, {
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
    require('./$.iter-define')(C, NAME, function(iterated, kind){
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
    species(require('./$.core')[NAME]); // for wrapper
  }
};
},{"./$":63,"./$.core":44,"./$.ctx":45,"./$.defined":47,"./$.for-of":50,"./$.has":52,"./$.hide":53,"./$.is-object":56,"./$.iter-define":59,"./$.iter-step":61,"./$.mix":65,"./$.species":71,"./$.strict-new":72,"./$.support-desc":74,"./$.uid":80}],42:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":39,"./$.for-of":50}],43:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , $def       = require('./$.def')
  , hide       = require('./$.hide')
  , forOf      = require('./$.for-of')
  , strictNew  = require('./$.strict-new');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = require('./$.global')[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!require('./$.support-desc') || typeof C != 'function'
    || !(IS_WEAK || proto.forEach && !require('./$.fails')(function(){ new C().entries().next(); }))
  ){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    require('./$.mix')(C.prototype, methods);
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

  require('./$.tag')(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$":63,"./$.def":46,"./$.fails":49,"./$.for-of":50,"./$.global":51,"./$.hide":53,"./$.mix":65,"./$.strict-new":72,"./$.support-desc":74,"./$.tag":75}],44:[function(require,module,exports){
var core = module.exports = {};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],45:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
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
},{"./$.a-function":36}],46:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
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
},{"./$.core":44,"./$.global":51}],47:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],48:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
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
},{"./$":63}],49:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],50:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
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
},{"./$.an-object":37,"./$.ctx":45,"./$.is-array-iter":55,"./$.iter-call":57,"./$.to-length":78,"./core.get-iterator-method":83}],51:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var UNDEFINED = 'undefined';
var global = module.exports = typeof window != UNDEFINED && window.Math == Math
  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],52:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],53:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.support-desc') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":63,"./$.property-desc":67,"./$.support-desc":74}],54:[function(require,module,exports){
// indexed object, fallback for non-array-like ES3 strings
var cof = require('./$.cof');
module.exports = 0 in Object('z') ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":40}],55:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./$.iterators')
  , ITERATOR  = require('./$.wks')('iterator');
module.exports = function(it){
  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
};
},{"./$.iterators":62,"./$.wks":82}],56:[function(require,module,exports){
// http://jsperf.com/core-js-isobject
module.exports = function(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
};
},{}],57:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
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
},{"./$.an-object":37}],58:[function(require,module,exports){
'use strict';
var $ = require('./$')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: require('./$.property-desc')(1,next)});
  require('./$.tag')(Constructor, NAME + ' Iterator');
};
},{"./$":63,"./$.hide":53,"./$.property-desc":67,"./$.tag":75,"./$.wks":82}],59:[function(require,module,exports){
'use strict';
var LIBRARY         = require('./$.library')
  , $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , hide            = require('./$.hide')
  , has             = require('./$.has')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , Iterators       = require('./$.iterators')
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  require('./$.iter-create')(Constructor, NAME, next);
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
    var IteratorPrototype = require('./$').getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    require('./$.tag')(IteratorPrototype, TAG, true);
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
},{"./$":63,"./$.def":46,"./$.has":52,"./$.hide":53,"./$.iter-create":58,"./$.iterators":62,"./$.library":64,"./$.redef":68,"./$.tag":75,"./$.wks":82}],60:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
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
},{"./$.wks":82}],61:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],62:[function(require,module,exports){
module.exports = {};
},{}],63:[function(require,module,exports){
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
},{}],64:[function(require,module,exports){
module.exports = true;
},{}],65:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":68}],66:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (require('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * require('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":44,"./$.def":46,"./$.fails":49}],67:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],68:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":53}],69:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
    ? function(buggy, set){
        try {
          set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
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
},{"./$":63,"./$.an-object":37,"./$.ctx":45,"./$.is-object":56}],70:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":51}],71:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if(require('./$.support-desc') && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":63,"./$.support-desc":74,"./$.wks":82}],72:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],73:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
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
},{"./$.defined":47,"./$.to-integer":76}],74:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":49}],75:[function(require,module,exports){
var has  = require('./$.has')
  , hide = require('./$.hide')
  , TAG  = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))hide(it, TAG, tag);
};
},{"./$.has":52,"./$.hide":53,"./$.wks":82}],76:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],77:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":47,"./$.iobject":54}],78:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":76}],79:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":47}],80:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],81:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],82:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || require('./$.uid'))('Symbol.' + name));
};
},{"./$.global":51,"./$.shared":70,"./$.uid":80}],83:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};
},{"./$.classof":39,"./$.core":44,"./$.iterators":62,"./$.wks":82}],84:[function(require,module,exports){
var anObject = require('./$.an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./$.core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./$.an-object":37,"./$.core":44,"./core.get-iterator-method":83}],85:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').isIterable = function(it){
  var O = Object(it);
  return ITERATOR in O || '@@iterator' in O || Iterators.hasOwnProperty(classof(O));
};
},{"./$.classof":39,"./$.core":44,"./$.iterators":62,"./$.wks":82}],86:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $def        = require('./$.def')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
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
},{"./$.ctx":45,"./$.def":46,"./$.is-array-iter":55,"./$.iter-call":57,"./$.iter-detect":60,"./$.to-length":78,"./$.to-object":79,"./core.get-iterator-method":83}],87:[function(require,module,exports){
'use strict';
var setUnscope = require('./$.unscope')
  , step       = require('./$.iter-step')
  , Iterators  = require('./$.iterators')
  , toIObject  = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
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
},{"./$.iter-define":59,"./$.iter-step":61,"./$.iterators":62,"./$.to-iobject":77,"./$.unscope":81}],88:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
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
},{"./$.collection":43,"./$.collection-strong":41}],89:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');

$def($def.S + $def.F, 'Object', {assign: require('./$.assign')});
},{"./$.assign":38,"./$.def":46}],90:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":66,"./$.to-iobject":77}],91:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":66,"./$.to-object":79}],92:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":46,"./$.set-proto":69}],93:[function(require,module,exports){

},{}],94:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments[0]); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":43,"./$.collection-strong":41}],95:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
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
},{"./$.iter-define":59,"./$.string-at":73}],96:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def');

$def($def.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":42,"./$.def":46}],97:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def');

$def($def.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":42,"./$.def":46}],98:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":62,"./es6.array.iterator":87}]},{},[3])(3)
});