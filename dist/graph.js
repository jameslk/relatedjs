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
//# sourceMappingURL=data:application/json;base64,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Q2hCOzs7YUFwWFUsZUFBRztBQUNWLG1CQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDeEI7OztXQXpCZ0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoibGliL2dyYXBoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBIYXNPbmVSZWxhdGlvbnNoaXAsXG4gICAgSGFzTWFueVJlbGF0aW9uc2hpcCxcbiAgICBCZWxvbmdzVG9SZWxhdGlvbnNoaXAsXG4gICAgSGFzQW5kQmVsb25nc1RvTWFueVJlbGF0aW9uc2hpcFxufSBmcm9tICcuL3JlbGF0aW9uc2hpcHMnO1xuXG5pbXBvcnQgQmltYXAgZnJvbSAnLi9iaW1hcCc7XG5cbi8qKlxuICogU3RvcmVzIHJlbGF0aW9uc2hpcHMgYmV0d2VlbiBkaWZmZXJlbnQgdHlwZXMgb2Ygbm9kZXMuIEl0IHJlcXVpcmVzIGFuXG4gKiBgYXJyYXlgIG9mIGBTY2hlbWFgcyB0byBlbmZvcmNlIHRoZSB2YWxpZGl0eSBvZiByZWxhdGlvbnNoaXBzIGFuZCBnb3Zlcm4gaG93IGl0XG4gKiBzdG9yZXMgYW5kIGxvb2tzIHVwIHRob3NlIHJlbGF0aW9uc2hpcHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoIHtcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWFzKSB7XG4gICAgICAgIHRoaXMuX2dyYXBoID0ge307XG5cbiAgICAgICAgdGhpcy5fc2NoZW1hcyA9IHNjaGVtYXM7XG4gICAgICAgIHRoaXMuX3NjaGVtYU1hcCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IHNjaGVtYSBvZiBzY2hlbWFzKSB7XG4gICAgICAgICAgICB0aGlzLl9zY2hlbWFNYXBbc2NoZW1hLmZvclR5cGVdID0gc2NoZW1hO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY3JlYXRlR3JhcGhSZWxhdGlvbnNoaXBzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBvcmlnaW5hbCBhcnJheSBvZiBgU2NoZW1hYHMgdGhhdCB3ZXJlIHBhc3NlZCBpbnRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgZW5mb3JjZWQgcmVhZC1vbmx5IGJlY2F1c2UgY2hhbmdpbmcgdGhlIGBTY2hlbWFgcyBpbnZhbGlkYXRlcyB0aGVcbiAgICAgKiBpbnRlcm5hbCBzdHJ1Y3R1cmUgb2YgdGhlIGBHcmFwaGAgYW5kIGl0cyByZWxhdGlvbnNoaXBzLiBJbnN0ZWFkLCBhIG5ld1xuICAgICAqIGBHcmFwaGAgc2hvdWxkIGJlIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YXJyYXl9IGBTY2hlbWFgcyBwYXNzZWQgaW50byB0aGUgY29uc3RydWN0b3IuXG4gICAgICovXG4gICAgZ2V0IHNjaGVtYXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2hlbWFzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBhIG5vZGUncyByZWxhdGlvbnNoaXAgdG8gYW5vdGhlciBub2RlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHRvTm9kZVR5cGUgVHlwZSBvZiBub2RlLlxuICAgICAqIEBwYXJhbSB0b0tleSBLZXkgb2YgdGhlIG5vZGUuXG4gICAgICogQHBhcmFtIGZyb21Ob2RlVHlwZSBPdGhlciB0eXBlIG9mIG5vZGUuXG4gICAgICogQHBhcmFtIGZyb21LZXkgS2V5IG9mIHRoZSBvdGhlciBub2RlLlxuICAgICAqIEByZXR1cm5zIHtHcmFwaH1cbiAgICAgKi9cbiAgICBzZXRUbyh0b05vZGVUeXBlLCB0b0tleSwgZnJvbU5vZGVUeXBlLCBmcm9tS2V5KSB7XG4gICAgICAgIGNvbnN0IHRvRnJvbVJlbGF0aW9uc2hpcCA9IHRoaXMuX2xvb2t1cFJlbGF0aW9uc2hpcCh0b05vZGVUeXBlLCBmcm9tTm9kZVR5cGUpO1xuICAgICAgICBjb25zdCBmcm9tVG9SZWxhdGlvbnNoaXAgPSB0aGlzLl9sb29rdXBSZWxhdGlvbnNoaXAoZnJvbU5vZGVUeXBlLCB0b05vZGVUeXBlKTtcblxuICAgICAgICBpZiAoIXRoaXMuX2lzT25lVG9PbmVSZWxhdGlvbnNoaXAoZnJvbVRvUmVsYXRpb25zaGlwLCB0b0Zyb21SZWxhdGlvbnNoaXApXG4gICAgICAgICAgICAmJiAhdGhpcy5faXNPbmVUb01hbnlSZWxhdGlvbnNoaXAoZnJvbVRvUmVsYXRpb25zaGlwLCB0b0Zyb21SZWxhdGlvbnNoaXApXG4gICAgICAgICAgICAmJiAhdGhpcy5faXNNYW55VG9NYW55UmVsYXRpb25zaGlwKGZyb21Ub1JlbGF0aW9uc2hpcCwgdG9Gcm9tUmVsYXRpb25zaGlwKSkge1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgYFVua25vd24gcmVsYXRpb25zaGlwYFxuICAgICAgICAgICAgICAgICsgYCBmcm9tICR7ZnJvbU5vZGVUeXBlfSB3aXRoIFwiJHtmcm9tVG9SZWxhdGlvbnNoaXB9XCJgXG4gICAgICAgICAgICAgICAgKyBgIHRvICR7dG9Ob2RlVHlwZX0gd2l0aCBcIiR7dG9Gcm9tUmVsYXRpb25zaGlwfVwiYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3NldFJlbGF0aW9uc2hpcChmcm9tTm9kZVR5cGUsIGZyb21LZXksIHRvTm9kZVR5cGUsIHRvS2V5KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZW5pZW5jZSBtZXRob2QgZm9yIHtHcmFwaCNzZXRUb30uIFVzZSBpdCBhczpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIHNldChub2RlVHlwZSwgbm9kZUtleSkudG8obm9kZVR5cGUsIG5vZGVLZXkpXG4gICAgICogYGBgXG4gICAgICovXG4gICAgc2V0KGZyb21Ob2RlVHlwZSwgZnJvbUtleSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG86ICh0b05vZGVUeXBlLCB0b0tleSkgPT4gdGhpcy5zZXRUbyhmcm9tTm9kZVR5cGUsIGZyb21LZXksIHRvTm9kZVR5cGUsIHRvS2V5KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kIGEgcmVsYXRpb25zaGlwIGJldHdlZW4gbm9kZXMuIFRoaXMgb25seSB3b3JrcyBmb3Igbm9kZXMgdGhhdCBoYXZlIGFcbiAgICAgKiByZWxhdGlvbnNoaXAgb2Ygb25lLXRvLW1hbnkgb3IgbWFueS10by1tYW55LCBvdGhlcndpc2UgaXQgd29ya3MgdGhlIHNhbWUgYXNcbiAgICAgKiB7R3JhcGgjc2V0VG99LlxuICAgICAqXG4gICAgICogQHBhcmFtIHRvTm9kZVR5cGUgVHlwZSBvZiBub2RlLlxuICAgICAqIEBwYXJhbSB0b0tleSBLZXkgb2YgdGhlIG5vZGUuXG4gICAgICogQHBhcmFtIGZyb21Ob2RlVHlwZSBPdGhlciB0eXBlIG9mIG5vZGUuXG4gICAgICogQHBhcmFtIGZyb21LZXkgS2V5IG9mIHRoZSBvdGhlciBub2RlLlxuICAgICAqIEByZXR1cm5zIHtHcmFwaH1cbiAgICAgKi9cbiAgICBhcHBlbmRUbyh0b05vZGVUeXBlLCB0b0tleSwgZnJvbU5vZGVUeXBlLCBmcm9tS2V5KSB7XG4gICAgICAgIGNvbnN0IHRvRnJvbVJlbGF0aW9uc2hpcCA9IHRoaXMuX2xvb2t1cFJlbGF0aW9uc2hpcCh0b05vZGVUeXBlLCBmcm9tTm9kZVR5cGUpO1xuICAgICAgICBjb25zdCBmcm9tVG9SZWxhdGlvbnNoaXAgPSB0aGlzLl9sb29rdXBSZWxhdGlvbnNoaXAoZnJvbU5vZGVUeXBlLCB0b05vZGVUeXBlKTtcblxuICAgICAgICBpZiAodGhpcy5faXNPbmVUb09uZVJlbGF0aW9uc2hpcChmcm9tVG9SZWxhdGlvbnNoaXAsIHRvRnJvbVJlbGF0aW9uc2hpcCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFJlbGF0aW9uc2hpcChmcm9tTm9kZVR5cGUsIGZyb21LZXksIHRvTm9kZVR5cGUsIHRvS2V5KTtcblxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2lzT25lVG9NYW55UmVsYXRpb25zaGlwKGZyb21Ub1JlbGF0aW9uc2hpcCwgdG9Gcm9tUmVsYXRpb25zaGlwKSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwZW5kT25lVG9NYW55UmVsYXRpb25zaGlwKGZyb21Ob2RlVHlwZSwgZnJvbUtleSwgdG9Ob2RlVHlwZSwgdG9LZXkpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5faXNNYW55VG9NYW55UmVsYXRpb25zaGlwKGZyb21Ub1JlbGF0aW9uc2hpcCwgdG9Gcm9tUmVsYXRpb25zaGlwKSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwZW5kTWFueVRvTWFueVJlbGF0aW9uc2hpcChmcm9tTm9kZVR5cGUsIGZyb21LZXksIHRvTm9kZVR5cGUsIHRvS2V5KTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGBVbmtub3duIHJlbGF0aW9uc2hpcGBcbiAgICAgICAgICAgICAgICArIGAgZnJvbSAke2Zyb21Ob2RlVHlwZX0gd2l0aCBcIiR7ZnJvbVRvUmVsYXRpb25zaGlwfVwiYFxuICAgICAgICAgICAgICAgICsgYCB0byAke3RvTm9kZVR5cGV9IHdpdGggXCIke3RvRnJvbVJlbGF0aW9uc2hpcH1cImBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZW5pZW5jZSBtZXRob2QgZm9yIHtHcmFwaCNhcHBlbmRUb30uIFVzZSBpdCBhczpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGFwcGVuZChub2RlVHlwZSwgbm9kZUtleSkudG8obm9kZVR5cGUsIG5vZGVLZXkpXG4gICAgICogYGBgXG4gICAgICovXG4gICAgYXBwZW5kKGZyb21Ob2RlVHlwZSwgZnJvbUtleSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG86ICh0b05vZGVUeXBlLCB0b0tleSkgPT4gdGhpcy5hcHBlbmRUbyh0b05vZGVUeXBlLCB0b0tleSwgZnJvbU5vZGVUeXBlLCBmcm9tS2V5KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHR3byBub2Rlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmcm9tTm9kZVR5cGUgVHlwZSBvZiBub2RlLlxuICAgICAqIEBwYXJhbSBmcm9tS2V5IEtleSBvZiB0aGUgbm9kZS5cbiAgICAgKiBAcGFyYW0gb2ZOb2RlVHlwZSBPdGhlciB0eXBlIG9mIG5vZGUuXG4gICAgICogQHBhcmFtIG9mS2V5IEtleSBvZiB0aGUgb3RoZXIgbm9kZS5cbiAgICAgKiBAcmV0dXJucyB7R3JhcGh9XG4gICAgICovXG4gICAgcmVtb3ZlRnJvbShmcm9tTm9kZVR5cGUsIGZyb21LZXksIG9mTm9kZVR5cGUsIG9mS2V5KSB7XG4gICAgICAgIGNvbnN0IGZyb21Ub1JlbGF0aW9uc2hpcCA9IHRoaXMuX2xvb2t1cFJlbGF0aW9uc2hpcChmcm9tTm9kZVR5cGUsIG9mTm9kZVR5cGUpO1xuICAgICAgICBjb25zdCB0b0Zyb21SZWxhdGlvbnNoaXAgPSB0aGlzLl9sb29rdXBSZWxhdGlvbnNoaXAob2ZOb2RlVHlwZSwgZnJvbU5vZGVUeXBlKTtcblxuICAgICAgICBpZiAoIXRoaXMuX2lzT25lVG9PbmVSZWxhdGlvbnNoaXAoZnJvbVRvUmVsYXRpb25zaGlwLCB0b0Zyb21SZWxhdGlvbnNoaXApXG4gICAgICAgICAgICAmJiAhdGhpcy5faXNPbmVUb01hbnlSZWxhdGlvbnNoaXAoZnJvbVRvUmVsYXRpb25zaGlwLCB0b0Zyb21SZWxhdGlvbnNoaXApXG4gICAgICAgICAgICAmJiAhdGhpcy5faXNNYW55VG9NYW55UmVsYXRpb25zaGlwKGZyb21Ub1JlbGF0aW9uc2hpcCwgdG9Gcm9tUmVsYXRpb25zaGlwKSkge1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgYFVua25vd24gcmVsYXRpb25zaGlwYFxuICAgICAgICAgICAgICAgICsgYCBmcm9tICR7ZnJvbU5vZGVUeXBlfSB3aXRoIFwiJHtmcm9tVG9SZWxhdGlvbnNoaXB9XCJgXG4gICAgICAgICAgICAgICAgKyBgIHRvICR7dG9Ob2RlVHlwZX0gd2l0aCBcIiR7dG9Gcm9tUmVsYXRpb25zaGlwfVwiYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3JlbW92ZVJlbGF0aW9uc2hpcChmcm9tTm9kZVR5cGUsIGZyb21LZXksIG9mTm9kZVR5cGUsIG9mS2V5KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZW5pZW5jZSBtZXRob2QgZm9yIHtHcmFwaCNyZW1vdmVGcm9tfS4gVXNlIGl0IGFzOlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICogcmVtb3ZlKG5vZGVUeXBlLCBub2RlS2V5KS5mcm9tKG5vZGVUeXBlLCBub2RlS2V5KVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHJlbW92ZShvZk5vZGVUeXBlLCBvZktleSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnJvbTogKGZyb21Ob2RlVHlwZSwgZnJvbUtleSkgPT4gdGhpcy5yZW1vdmVGcm9tKGZyb21Ob2RlVHlwZSwgZnJvbUtleSwgb2ZOb2RlVHlwZSwgb2ZLZXkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCByZWxhdGlvbnNoaXBzIHdpdGggYSBwYXJ0aWN1bGFyIG5vZGUuIFRoaXMgaXMgdXNlZnVsLCBmb3IgZXhhbXBsZSxcbiAgICAgKiBpZiB0aGUgbm9kZSBubyBsb25nZXIgZXhpc3RzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9mTm9kZVR5cGUgVHlwZSBvZiBub2RlLlxuICAgICAqIEBwYXJhbSBvZktleSBLZXkgb2YgdGhlIG5vZGUgdG8gZGlzY29ubmVjdCBmcm9tIG90aGVyIG5vZGVzLlxuICAgICAqL1xuICAgIHJlbW92ZVVzYWdlKG9mTm9kZVR5cGUsIG9mS2V5KSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2dyYXBoKS5mb3JFYWNoKGtleU5vZGVUeXBlID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2dyYXBoW2tleU5vZGVUeXBlXSkuZm9yRWFjaCh2YWx1ZU5vZGVUeXBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpb25zaGlwcyA9IHRoaXMuX2dyYXBoW2tleU5vZGVUeXBlXVt2YWx1ZU5vZGVUeXBlXTtcblxuICAgICAgICAgICAgICAgIGlmIChrZXlOb2RlVHlwZSA9PT0gb2ZOb2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBzLnJlbW92ZUtleShvZktleSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZU5vZGVUeXBlID09PSBvZk5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcHMucmVtb3ZlVmFsdWUob2ZLZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGNoaWxkJ3Mga2V5IG9mIGEgaGFzLW9uZSBwYXJlbnQgbm9kZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRUeXBlIFR5cGUgb2Ygbm9kZSBmb3IgdGhlIHBhcmVudCBub2RlLlxuICAgICAqIEBwYXJhbSBwYXJlbnRLZXkgS2V5IG9mIHRoZSBwYXJlbnQgbm9kZS5cbiAgICAgKiBAcGFyYW0gY2hpbGRUeXBlIFR5cGUgb2Ygbm9kZSBmb3IgdGhlIGNoaWxkIG5vZGUuXG4gICAgICogQHJldHVybnMgeyp9IEtleSBvZiB0aGUgY2hpbGQgbm9kZS5cbiAgICAgKi9cbiAgICBnZXRDaGlsZChwYXJlbnRUeXBlLCBwYXJlbnRLZXksIGNoaWxkVHlwZSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXAgPSB0aGlzLl9sb29rdXBSZWxhdGlvbnNoaXAocGFyZW50VHlwZSwgY2hpbGRUeXBlKTtcblxuICAgICAgICBpZiAoIShyZWxhdGlvbnNoaXAgaW5zdGFuY2VvZiBIYXNPbmVSZWxhdGlvbnNoaXApKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgYCR7cGFyZW50VHlwZX0gdG8gJHtjaGlsZFR5cGV9IHJlbGF0aW9uc2hpcCBpcyBhIG5vdCBIYXMgT25lIHJlbGF0aW9uc2hpcC5gXG4gICAgICAgICAgICAgICAgKyBgIEl0IGlzIGRlZmluZWQgYXM6ICR7cmVsYXRpb25zaGlwfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0R3JhcGhWYWx1ZShwYXJlbnRUeXBlLCBjaGlsZFR5cGUsIHBhcmVudEtleSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBwYXJlbnQncyBrZXkgb2YgYSBiZWxvbmdzLXRvIGNoaWxkIG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRUeXBlIFR5cGUgb2Ygbm9kZSBmb3IgdGhlIGNoaWxkIG5vZGUuXG4gICAgICogQHBhcmFtIGNoaWxkS2V5IEtleSBvZiB0aGUgY2hpbGQgbm9kZS5cbiAgICAgKiBAcGFyYW0gcGFyZW50VHlwZSBUeXBlIG9mIG5vZGUgZm9yIHRoZSBwYXJlbnQgbm9kZS5cbiAgICAgKiBAcmV0dXJucyB7Kn0gS2V5IG9mIHRoZSBwYXJlbnQgbm9kZS5cbiAgICAgKi9cbiAgICBnZXRQYXJlbnQoY2hpbGRUeXBlLCBjaGlsZEtleSwgcGFyZW50VHlwZSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXAgPSB0aGlzLl9sb29rdXBSZWxhdGlvbnNoaXAocGFyZW50VHlwZSwgY2hpbGRUeXBlKTtcblxuICAgICAgICBpZiAoIShyZWxhdGlvbnNoaXAgaW5zdGFuY2VvZiBIYXNPbmVSZWxhdGlvbnNoaXApXG4gICAgICAgICAgICAmJiAhKHJlbGF0aW9uc2hpcCBpbnN0YW5jZW9mIEhhc01hbnlSZWxhdGlvbnNoaXApKSB7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBgJHtwYXJlbnRUeXBlfSB0byAke2NoaWxkVHlwZX0gcmVsYXRpb25zaGlwIGlzIG5vdCBhIEhhcyBPbmUgb3IgSGFzIE1hbnkgcmVsYXRpb25zaGlwLmBcbiAgICAgICAgICAgICAgICArIGAgSXQgaXMgZGVmaW5lZCBhczogJHtyZWxhdGlvbnNoaXB9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRHcmFwaFZhbHVlKGNoaWxkVHlwZSwgcGFyZW50VHlwZSwgY2hpbGRLZXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhbiBgYXJyYXlgIG9mIGFsbCB0aGUgY2hpbGQgbm9kZSBrZXlzIGZvciBhIGhhcy1tYW55IG9yXG4gICAgICogaGFzLWFuZC1iZWxvbmdzLXRvLW1hbnkgcGFyZW50IG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50VHlwZSBUeXBlIG9mIG5vZGUgZm9yIHRoZSBwYXJlbnQgbm9kZS5cbiAgICAgKiBAcGFyYW0gcGFyZW50S2V5IEtleSBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgICogQHBhcmFtIGNoaWxkVHlwZSBUeXBlIG9mIG5vZGUgZm9yIHRoZSBjaGlsZCBub2Rlcy5cbiAgICAgKiBAcmV0dXJucyB7YXJyYXl9IEFsbCBjaGlsZCBub2RlIGtleXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBwYXJlbnQgbm9kZS5cbiAgICAgKi9cbiAgICBnZXRDaGlsZHJlbihwYXJlbnRUeXBlLCBwYXJlbnRLZXksIGNoaWxkVHlwZSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXAgPSB0aGlzLl9sb29rdXBSZWxhdGlvbnNoaXAocGFyZW50VHlwZSwgY2hpbGRUeXBlKTtcblxuICAgICAgICBpZiAoIShyZWxhdGlvbnNoaXAgaW5zdGFuY2VvZiBIYXNNYW55UmVsYXRpb25zaGlwKVxuICAgICAgICAgICAgJiYgIShyZWxhdGlvbnNoaXAgaW5zdGFuY2VvZiBIYXNBbmRCZWxvbmdzVG9NYW55UmVsYXRpb25zaGlwKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGAke3BhcmVudFR5cGV9IHRvICR7Y2hpbGRUeXBlfSByZWxhdGlvbnNoaXAgaXMgYSBub3QgSGFzIE9uZWBcbiAgICAgICAgICAgICAgICArIGAgb3IgSGFzIGFuZCBCZWxvbmdzIHRvIE1hbnkgcmVsYXRpb25zaGlwLmBcbiAgICAgICAgICAgICAgICArIGAgSXQgaXMgZGVmaW5lZCBhczogJHtyZWxhdGlvbnNoaXB9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRHcmFwaFZhbHVlcyhwYXJlbnRUeXBlLCBjaGlsZFR5cGUsIHBhcmVudEtleSk7XG4gICAgfVxuXG4gICAgX2xvb2t1cFJlbGF0aW9uc2hpcChmcm9tTm9kZVR5cGUsIHRvTm9kZVR5cGUpIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5fc2NoZW1hTWFwW2Zyb21Ob2RlVHlwZV07XG5cbiAgICAgICAgaWYgKCFzY2hlbWEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgU2NoZW1hIHdhcyBub3QgZGVmaW5lZCBmb3IgJHtmcm9tTm9kZVR5cGV9YClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcCA9IHNjaGVtYS5yZWxhdGlvbnNoaXBzW3RvTm9kZVR5cGVdO1xuXG4gICAgICAgIGlmICghcmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHJlbGF0aW9uc2hpcCBkZWZpbmVkIGZyb20gJHtmcm9tTm9kZVR5cGV9IHRvICR7dG9Ob2RlVHlwZX1gKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbGF0aW9uc2hpcDtcbiAgICB9XG5cbiAgICBfaXNPbmVUb09uZVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXAxLCByZWxhdGlvbnNoaXAyKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwMSBpbnN0YW5jZW9mIEhhc09uZVJlbGF0aW9uc2hpcFxuICAgICAgICAgICAgICAgICYmIHJlbGF0aW9uc2hpcDIgaW5zdGFuY2VvZiBCZWxvbmdzVG9SZWxhdGlvbnNoaXBcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHx8IChcbiAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAyIGluc3RhbmNlb2YgSGFzT25lUmVsYXRpb25zaGlwXG4gICAgICAgICAgICAgICAgJiYgcmVsYXRpb25zaGlwMSBpbnN0YW5jZW9mIEJlbG9uZ3NUb1JlbGF0aW9uc2hpcFxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9pc09uZVRvTWFueVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXAxLCByZWxhdGlvbnNoaXAyKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwMSBpbnN0YW5jZW9mIEhhc01hbnlSZWxhdGlvbnNoaXBcbiAgICAgICAgICAgICAgICAmJiByZWxhdGlvbnNoaXAyIGluc3RhbmNlb2YgQmVsb25nc1RvUmVsYXRpb25zaGlwXG4gICAgICAgICAgICApXG4gICAgICAgICAgICB8fCAoXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwMiBpbnN0YW5jZW9mIEhhc01hbnlSZWxhdGlvbnNoaXBcbiAgICAgICAgICAgICAgICAmJiByZWxhdGlvbnNoaXAxIGluc3RhbmNlb2YgQmVsb25nc1RvUmVsYXRpb25zaGlwXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgX2lzTWFueVRvTWFueVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXAxLCByZWxhdGlvbnNoaXAyKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAxIGluc3RhbmNlb2YgSGFzQW5kQmVsb25nc1RvTWFueVJlbGF0aW9uc2hpcFxuICAgICAgICAgICAgJiYgcmVsYXRpb25zaGlwMiBpbnN0YW5jZW9mIEhhc0FuZEJlbG9uZ3NUb01hbnlSZWxhdGlvbnNoaXBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBfc2V0UmVsYXRpb25zaGlwKGZyb21UeXBlLCBmcm9tS2V5LCB0b1R5cGUsIHRvS2V5KSB7XG4gICAgICAgIGlmIChmcm9tVHlwZSA+IHRvVHlwZSkge1xuICAgICAgICAgICAgbGV0IGdyYXBoID0gdGhpcy5fZ3JhcGhbZnJvbVR5cGVdW3RvVHlwZV07XG4gICAgICAgICAgICBncmFwaC5zZXQoZnJvbUtleSwgdG9LZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGdyYXBoID0gdGhpcy5fZ3JhcGhbdG9UeXBlXVtmcm9tVHlwZV07XG4gICAgICAgICAgICBncmFwaC5zZXQodG9LZXksIGZyb21LZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlbW92ZVJlbGF0aW9uc2hpcCh0b1R5cGUsIHRvS2V5LCBmcm9tVHlwZSwgZnJvbUtleSkge1xuICAgICAgICBpZiAoZnJvbVR5cGUgPiB0b1R5cGUpIHtcbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuX2dyYXBoW2Zyb21UeXBlXVt0b1R5cGVdO1xuICAgICAgICAgICAgZ3JhcGgucmVtb3ZlKGZyb21LZXksIHRvS2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuX2dyYXBoW3RvVHlwZV1bZnJvbVR5cGVdO1xuICAgICAgICAgICAgZ3JhcGgucmVtb3ZlKHRvS2V5LCBmcm9tS2V5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9hcHBlbmRPbmVUb01hbnlSZWxhdGlvbnNoaXAodG9UeXBlLCB0b0tleSwgZnJvbVR5cGUsIGZyb21LZXkpIHtcbiAgICAgICAgaWYgKGZyb21UeXBlID4gdG9UeXBlKSB7XG4gICAgICAgICAgICBsZXQgZ3JhcGggPSB0aGlzLl9ncmFwaFtmcm9tVHlwZV1bdG9UeXBlXTtcbiAgICAgICAgICAgIGdyYXBoLmFwcGVuZFZhbHVlVG9LZXkoZnJvbUtleSwgdG9LZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGdyYXBoID0gdGhpcy5fZ3JhcGhbdG9UeXBlXVtmcm9tVHlwZV07XG4gICAgICAgICAgICBncmFwaC5hcHBlbmRLZXlUb1ZhbHVlKGZyb21LZXksIHRvS2V5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9hcHBlbmRNYW55VG9NYW55UmVsYXRpb25zaGlwKHRvVHlwZSwgdG9LZXksIGZyb21UeXBlLCBmcm9tS2V5KSB7XG4gICAgICAgIGlmIChmcm9tVHlwZSA+IHRvVHlwZSkge1xuICAgICAgICAgICAgbGV0IGdyYXBoID0gdGhpcy5fZ3JhcGhbZnJvbVR5cGVdW3RvVHlwZV07XG4gICAgICAgICAgICBncmFwaC5hcHBlbmQoZnJvbUtleSwgdG9LZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGdyYXBoID0gdGhpcy5fZ3JhcGhbdG9UeXBlXVtmcm9tVHlwZV07XG4gICAgICAgICAgICBncmFwaC5hcHBlbmQodG9LZXksIGZyb21LZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2NyZWF0ZUdyYXBoUmVsYXRpb25zaGlwcygpIHtcbiAgICAgICAgZm9yIChsZXQgc2NoZW1hIG9mIHRoaXMuX3NjaGVtYXMpIHtcbiAgICAgICAgICAgIGxldCBmcm9tVHlwZSA9IHNjaGVtYS5mb3JUeXBlO1xuICAgICAgICAgICAgbGV0IHRvVHlwZXMgPSBPYmplY3Qua2V5cyhzY2hlbWEucmVsYXRpb25zaGlwcyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHRvVHlwZSBvZiB0b1R5cGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2dyYXBoW2Zyb21UeXBlXSAmJiB0aGlzLl9ncmFwaFtmcm9tVHlwZV1bdG9UeXBlXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gQmltYXAgYWxyZWFkeSBjcmVhdGVkXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGJpbWFwID0gbmV3IEJpbWFwKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZnJvbVR5cGUgPiB0b1R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWVyZ2VHcmFwaChmcm9tVHlwZSwge1t0b1R5cGVdOiBiaW1hcH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21lcmdlR3JhcGgodG9UeXBlLCB7W2Zyb21UeXBlXTogYmltYXB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbWVyZ2VHcmFwaChmb3JUeXBlLCBvYmplY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX2dyYXBoW2ZvclR5cGVdKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX2dyYXBoW2ZvclR5cGVdLCBvYmplY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZ3JhcGhbZm9yVHlwZV0gPSBvYmplY3Q7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2V0R3JhcGhGb3IoZnJvbVR5cGUsIHRvVHlwZSkge1xuICAgICAgICBpZiAoZnJvbVR5cGUgPiB0b1R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncmFwaFtmcm9tVHlwZV1bdG9UeXBlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncmFwaFt0b1R5cGVdW2Zyb21UeXBlXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9nZXRHcmFwaFZhbHVlcyhmcm9tVHlwZSwgdG9UeXBlLCBmcm9tS2V5KSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSB0aGlzLl9nZXRHcmFwaEZvcihmcm9tVHlwZSwgdG9UeXBlKTtcblxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBmcm9tVHlwZSA+IHRvVHlwZSA/XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzLmdldEtleVZhbHVlcyhmcm9tS2V5KSA6IHJlbGF0aW9uc2hpcHMuZ2V0VmFsdWVLZXlzKGZyb21LZXkpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZXMgPyBBcnJheS5mcm9tKHZhbHVlcykgOiBbXTtcbiAgICB9XG5cbiAgICBfZ2V0R3JhcGhWYWx1ZShmcm9tVHlwZSwgdG9UeXBlLCBmcm9tS2V5KSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSB0aGlzLl9nZXRHcmFwaEZvcihmcm9tVHlwZSwgdG9UeXBlKTtcblxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBmcm9tVHlwZSA+IHRvVHlwZSA/XG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzLmdldEtleVZhbHVlcyhmcm9tS2V5KSA6IHJlbGF0aW9uc2hpcHMuZ2V0VmFsdWVLZXlzKGZyb21LZXkpO1xuXG4gICAgICAgIGlmICghdmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IFt2YWx1ZV0gPSB2YWx1ZXM7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59Il19
