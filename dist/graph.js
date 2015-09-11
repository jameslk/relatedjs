'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
            for (var _iterator = schemas[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

            Object.keys(this._graph).forEach(function (keyNodeType) {
                Object.keys(_this4._graph[keyNodeType]).forEach(function (valueNodeType) {
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
                graph.appendKeyToValue(toKey, fromKey);
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
                for (var _iterator2 = this._schemas[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var schema = _step2.value;

                    var fromType = schema.forType;
                    var toTypes = Object.keys(schema.relationships);

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = toTypes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
                Object.assign(this._graph[forType], object);
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

            return values ? Array.from(values) : [];
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
//# sourceMappingURL=data:application/json;base64,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QU8sU0FBUyxDQUFDO2FBQ3BCOzt5Q0FFYSxNQUFNOztnQkFBZixLQUFLOztBQUNWLG1CQUFPLEtBQUssQ0FBQztTQUNoQjs7O2FBcFhVLGVBQUc7QUFDVixtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3hCOzs7V0F6QmdCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6ImxpYi9ncmFwaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgSGFzT25lUmVsYXRpb25zaGlwLFxuICAgIEhhc01hbnlSZWxhdGlvbnNoaXAsXG4gICAgQmVsb25nc1RvUmVsYXRpb25zaGlwLFxuICAgIEhhc0FuZEJlbG9uZ3NUb01hbnlSZWxhdGlvbnNoaXBcbn0gZnJvbSAnLi9yZWxhdGlvbnNoaXBzJztcblxuaW1wb3J0IEJpbWFwIGZyb20gJy4vYmltYXAnO1xuXG4vKipcbiAqIFN0b3JlcyByZWxhdGlvbnNoaXBzIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIG5vZGVzLiBJdCByZXF1aXJlcyBhblxuICogYGFycmF5YCBvZiBgU2NoZW1hYHMgdG8gZW5mb3JjZSB0aGUgdmFsaWRpdHkgb2YgcmVsYXRpb25zaGlwcyBhbmQgZ292ZXJuIGhvdyBpdFxuICogc3RvcmVzIGFuZCBsb29rcyB1cCB0aG9zZSByZWxhdGlvbnNoaXBzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaCB7XG4gICAgY29uc3RydWN0b3Ioc2NoZW1hcykge1xuICAgICAgICB0aGlzLl9ncmFwaCA9IHt9O1xuXG4gICAgICAgIHRoaXMuX3NjaGVtYXMgPSBzY2hlbWFzO1xuICAgICAgICB0aGlzLl9zY2hlbWFNYXAgPSB7fTtcblxuICAgICAgICBmb3IgKGxldCBzY2hlbWEgb2Ygc2NoZW1hcykge1xuICAgICAgICAgICAgdGhpcy5fc2NoZW1hTWFwW3NjaGVtYS5mb3JUeXBlXSA9IHNjaGVtYTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NyZWF0ZUdyYXBoUmVsYXRpb25zaGlwcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgb3JpZ2luYWwgYXJyYXkgb2YgYFNjaGVtYWBzIHRoYXQgd2VyZSBwYXNzZWQgaW50byB0aGUgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIGVuZm9yY2VkIHJlYWQtb25seSBiZWNhdXNlIGNoYW5naW5nIHRoZSBgU2NoZW1hYHMgaW52YWxpZGF0ZXMgdGhlXG4gICAgICogaW50ZXJuYWwgc3RydWN0dXJlIG9mIHRoZSBgR3JhcGhgIGFuZCBpdHMgcmVsYXRpb25zaGlwcy4gSW5zdGVhZCwgYSBuZXdcbiAgICAgKiBgR3JhcGhgIHNob3VsZCBiZSBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHJldHVybnMge2FycmF5fSBgU2NoZW1hYHMgcGFzc2VkIGludG8gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAqL1xuICAgIGdldCBzY2hlbWFzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NoZW1hcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYSBub2RlJ3MgcmVsYXRpb25zaGlwIHRvIGFub3RoZXIgbm9kZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0b05vZGVUeXBlIFR5cGUgb2Ygbm9kZS5cbiAgICAgKiBAcGFyYW0gdG9LZXkgS2V5IG9mIHRoZSBub2RlLlxuICAgICAqIEBwYXJhbSBmcm9tTm9kZVR5cGUgT3RoZXIgdHlwZSBvZiBub2RlLlxuICAgICAqIEBwYXJhbSBmcm9tS2V5IEtleSBvZiB0aGUgb3RoZXIgbm9kZS5cbiAgICAgKiBAcmV0dXJucyB7R3JhcGh9XG4gICAgICovXG4gICAgc2V0VG8odG9Ob2RlVHlwZSwgdG9LZXksIGZyb21Ob2RlVHlwZSwgZnJvbUtleSkge1xuICAgICAgICBjb25zdCB0b0Zyb21SZWxhdGlvbnNoaXAgPSB0aGlzLl9sb29rdXBSZWxhdGlvbnNoaXAodG9Ob2RlVHlwZSwgZnJvbU5vZGVUeXBlKTtcbiAgICAgICAgY29uc3QgZnJvbVRvUmVsYXRpb25zaGlwID0gdGhpcy5fbG9va3VwUmVsYXRpb25zaGlwKGZyb21Ob2RlVHlwZSwgdG9Ob2RlVHlwZSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc09uZVRvT25lUmVsYXRpb25zaGlwKGZyb21Ub1JlbGF0aW9uc2hpcCwgdG9Gcm9tUmVsYXRpb25zaGlwKVxuICAgICAgICAgICAgJiYgIXRoaXMuX2lzT25lVG9NYW55UmVsYXRpb25zaGlwKGZyb21Ub1JlbGF0aW9uc2hpcCwgdG9Gcm9tUmVsYXRpb25zaGlwKVxuICAgICAgICAgICAgJiYgIXRoaXMuX2lzTWFueVRvTWFueVJlbGF0aW9uc2hpcChmcm9tVG9SZWxhdGlvbnNoaXAsIHRvRnJvbVJlbGF0aW9uc2hpcCkpIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGBVbmtub3duIHJlbGF0aW9uc2hpcGBcbiAgICAgICAgICAgICAgICArIGAgZnJvbSAke2Zyb21Ob2RlVHlwZX0gd2l0aCBcIiR7ZnJvbVRvUmVsYXRpb25zaGlwfVwiYFxuICAgICAgICAgICAgICAgICsgYCB0byAke3RvTm9kZVR5cGV9IHdpdGggXCIke3RvRnJvbVJlbGF0aW9uc2hpcH1cImBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zZXRSZWxhdGlvbnNoaXAoZnJvbU5vZGVUeXBlLCBmcm9tS2V5LCB0b05vZGVUeXBlLCB0b0tleSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciB7R3JhcGgjc2V0VG99LiBVc2UgaXQgYXM6XG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBzZXQobm9kZVR5cGUsIG5vZGVLZXkpLnRvKG5vZGVUeXBlLCBub2RlS2V5KVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHNldChmcm9tTm9kZVR5cGUsIGZyb21LZXkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvOiAodG9Ob2RlVHlwZSwgdG9LZXkpID0+IHRoaXMuc2V0VG8oZnJvbU5vZGVUeXBlLCBmcm9tS2V5LCB0b05vZGVUeXBlLCB0b0tleSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGVuZCBhIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIG5vZGVzLiBUaGlzIG9ubHkgd29ya3MgZm9yIG5vZGVzIHRoYXQgaGF2ZSBhXG4gICAgICogcmVsYXRpb25zaGlwIG9mIG9uZS10by1tYW55IG9yIG1hbnktdG8tbWFueSwgb3RoZXJ3aXNlIGl0IHdvcmtzIHRoZSBzYW1lIGFzXG4gICAgICoge0dyYXBoI3NldFRvfS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0b05vZGVUeXBlIFR5cGUgb2Ygbm9kZS5cbiAgICAgKiBAcGFyYW0gdG9LZXkgS2V5IG9mIHRoZSBub2RlLlxuICAgICAqIEBwYXJhbSBmcm9tTm9kZVR5cGUgT3RoZXIgdHlwZSBvZiBub2RlLlxuICAgICAqIEBwYXJhbSBmcm9tS2V5IEtleSBvZiB0aGUgb3RoZXIgbm9kZS5cbiAgICAgKiBAcmV0dXJucyB7R3JhcGh9XG4gICAgICovXG4gICAgYXBwZW5kVG8odG9Ob2RlVHlwZSwgdG9LZXksIGZyb21Ob2RlVHlwZSwgZnJvbUtleSkge1xuICAgICAgICBjb25zdCB0b0Zyb21SZWxhdGlvbnNoaXAgPSB0aGlzLl9sb29rdXBSZWxhdGlvbnNoaXAodG9Ob2RlVHlwZSwgZnJvbU5vZGVUeXBlKTtcbiAgICAgICAgY29uc3QgZnJvbVRvUmVsYXRpb25zaGlwID0gdGhpcy5fbG9va3VwUmVsYXRpb25zaGlwKGZyb21Ob2RlVHlwZSwgdG9Ob2RlVHlwZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzT25lVG9PbmVSZWxhdGlvbnNoaXAoZnJvbVRvUmVsYXRpb25zaGlwLCB0b0Zyb21SZWxhdGlvbnNoaXApKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRSZWxhdGlvbnNoaXAoZnJvbU5vZGVUeXBlLCBmcm9tS2V5LCB0b05vZGVUeXBlLCB0b0tleSk7XG5cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9pc09uZVRvTWFueVJlbGF0aW9uc2hpcChmcm9tVG9SZWxhdGlvbnNoaXAsIHRvRnJvbVJlbGF0aW9uc2hpcCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGVuZE9uZVRvTWFueVJlbGF0aW9uc2hpcChmcm9tTm9kZVR5cGUsIGZyb21LZXksIHRvTm9kZVR5cGUsIHRvS2V5KTtcblxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2lzTWFueVRvTWFueVJlbGF0aW9uc2hpcChmcm9tVG9SZWxhdGlvbnNoaXAsIHRvRnJvbVJlbGF0aW9uc2hpcCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGVuZE1hbnlUb01hbnlSZWxhdGlvbnNoaXAoZnJvbU5vZGVUeXBlLCBmcm9tS2V5LCB0b05vZGVUeXBlLCB0b0tleSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBgVW5rbm93biByZWxhdGlvbnNoaXBgXG4gICAgICAgICAgICAgICAgKyBgIGZyb20gJHtmcm9tTm9kZVR5cGV9IHdpdGggXCIke2Zyb21Ub1JlbGF0aW9uc2hpcH1cImBcbiAgICAgICAgICAgICAgICArIGAgdG8gJHt0b05vZGVUeXBlfSB3aXRoIFwiJHt0b0Zyb21SZWxhdGlvbnNoaXB9XCJgXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciB7R3JhcGgjYXBwZW5kVG99LiBVc2UgaXQgYXM6XG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBhcHBlbmQobm9kZVR5cGUsIG5vZGVLZXkpLnRvKG5vZGVUeXBlLCBub2RlS2V5KVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIGFwcGVuZChmcm9tTm9kZVR5cGUsIGZyb21LZXkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvOiAodG9Ob2RlVHlwZSwgdG9LZXkpID0+IHRoaXMuYXBwZW5kVG8odG9Ob2RlVHlwZSwgdG9LZXksIGZyb21Ob2RlVHlwZSwgZnJvbUtleSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSByZWxhdGlvbnNoaXAgYmV0d2VlbiB0d28gbm9kZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZnJvbU5vZGVUeXBlIFR5cGUgb2Ygbm9kZS5cbiAgICAgKiBAcGFyYW0gZnJvbUtleSBLZXkgb2YgdGhlIG5vZGUuXG4gICAgICogQHBhcmFtIG9mTm9kZVR5cGUgT3RoZXIgdHlwZSBvZiBub2RlLlxuICAgICAqIEBwYXJhbSBvZktleSBLZXkgb2YgdGhlIG90aGVyIG5vZGUuXG4gICAgICogQHJldHVybnMge0dyYXBofVxuICAgICAqL1xuICAgIHJlbW92ZUZyb20oZnJvbU5vZGVUeXBlLCBmcm9tS2V5LCBvZk5vZGVUeXBlLCBvZktleSkge1xuICAgICAgICBjb25zdCBmcm9tVG9SZWxhdGlvbnNoaXAgPSB0aGlzLl9sb29rdXBSZWxhdGlvbnNoaXAoZnJvbU5vZGVUeXBlLCBvZk5vZGVUeXBlKTtcbiAgICAgICAgY29uc3QgdG9Gcm9tUmVsYXRpb25zaGlwID0gdGhpcy5fbG9va3VwUmVsYXRpb25zaGlwKG9mTm9kZVR5cGUsIGZyb21Ob2RlVHlwZSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc09uZVRvT25lUmVsYXRpb25zaGlwKGZyb21Ub1JlbGF0aW9uc2hpcCwgdG9Gcm9tUmVsYXRpb25zaGlwKVxuICAgICAgICAgICAgJiYgIXRoaXMuX2lzT25lVG9NYW55UmVsYXRpb25zaGlwKGZyb21Ub1JlbGF0aW9uc2hpcCwgdG9Gcm9tUmVsYXRpb25zaGlwKVxuICAgICAgICAgICAgJiYgIXRoaXMuX2lzTWFueVRvTWFueVJlbGF0aW9uc2hpcChmcm9tVG9SZWxhdGlvbnNoaXAsIHRvRnJvbVJlbGF0aW9uc2hpcCkpIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGBVbmtub3duIHJlbGF0aW9uc2hpcGBcbiAgICAgICAgICAgICAgICArIGAgZnJvbSAke2Zyb21Ob2RlVHlwZX0gd2l0aCBcIiR7ZnJvbVRvUmVsYXRpb25zaGlwfVwiYFxuICAgICAgICAgICAgICAgICsgYCB0byAke3RvTm9kZVR5cGV9IHdpdGggXCIke3RvRnJvbVJlbGF0aW9uc2hpcH1cImBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZW1vdmVSZWxhdGlvbnNoaXAoZnJvbU5vZGVUeXBlLCBmcm9tS2V5LCBvZk5vZGVUeXBlLCBvZktleSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciB7R3JhcGgjcmVtb3ZlRnJvbX0uIFVzZSBpdCBhczpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIHJlbW92ZShub2RlVHlwZSwgbm9kZUtleSkuZnJvbShub2RlVHlwZSwgbm9kZUtleSlcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICByZW1vdmUob2ZOb2RlVHlwZSwgb2ZLZXkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZyb206IChmcm9tTm9kZVR5cGUsIGZyb21LZXkpID0+IHRoaXMucmVtb3ZlRnJvbShmcm9tTm9kZVR5cGUsIGZyb21LZXksIG9mTm9kZVR5cGUsIG9mS2V5KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgcmVsYXRpb25zaGlwcyB3aXRoIGEgcGFydGljdWxhciBub2RlLiBUaGlzIGlzIHVzZWZ1bCwgZm9yIGV4YW1wbGUsXG4gICAgICogaWYgdGhlIG5vZGUgbm8gbG9uZ2VyIGV4aXN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvZk5vZGVUeXBlIFR5cGUgb2Ygbm9kZS5cbiAgICAgKiBAcGFyYW0gb2ZLZXkgS2V5IG9mIHRoZSBub2RlIHRvIGRpc2Nvbm5lY3QgZnJvbSBvdGhlciBub2Rlcy5cbiAgICAgKi9cbiAgICByZW1vdmVVc2FnZShvZk5vZGVUeXBlLCBvZktleSkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9ncmFwaCkuZm9yRWFjaChrZXlOb2RlVHlwZSA9PiB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9ncmFwaFtrZXlOb2RlVHlwZV0pLmZvckVhY2godmFsdWVOb2RlVHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlbGF0aW9uc2hpcHMgPSB0aGlzLl9ncmFwaFtrZXlOb2RlVHlwZV1bdmFsdWVOb2RlVHlwZV07XG5cbiAgICAgICAgICAgICAgICBpZiAoa2V5Tm9kZVR5cGUgPT09IG9mTm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwcy5yZW1vdmVLZXkob2ZLZXkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWVOb2RlVHlwZSA9PT0gb2ZOb2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBzLnJlbW92ZVZhbHVlKG9mS2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBjaGlsZCdzIGtleSBvZiBhIGhhcy1vbmUgcGFyZW50IG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50VHlwZSBUeXBlIG9mIG5vZGUgZm9yIHRoZSBwYXJlbnQgbm9kZS5cbiAgICAgKiBAcGFyYW0gcGFyZW50S2V5IEtleSBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgICogQHBhcmFtIGNoaWxkVHlwZSBUeXBlIG9mIG5vZGUgZm9yIHRoZSBjaGlsZCBub2RlLlxuICAgICAqIEByZXR1cm5zIHsqfSBLZXkgb2YgdGhlIGNoaWxkIG5vZGUuXG4gICAgICovXG4gICAgZ2V0Q2hpbGQocGFyZW50VHlwZSwgcGFyZW50S2V5LCBjaGlsZFR5cGUpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwID0gdGhpcy5fbG9va3VwUmVsYXRpb25zaGlwKHBhcmVudFR5cGUsIGNoaWxkVHlwZSk7XG5cbiAgICAgICAgaWYgKCEocmVsYXRpb25zaGlwIGluc3RhbmNlb2YgSGFzT25lUmVsYXRpb25zaGlwKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGAke3BhcmVudFR5cGV9IHRvICR7Y2hpbGRUeXBlfSByZWxhdGlvbnNoaXAgaXMgYSBub3QgSGFzIE9uZSByZWxhdGlvbnNoaXAuYFxuICAgICAgICAgICAgICAgICsgYCBJdCBpcyBkZWZpbmVkIGFzOiAke3JlbGF0aW9uc2hpcH1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldEdyYXBoVmFsdWUocGFyZW50VHlwZSwgY2hpbGRUeXBlLCBwYXJlbnRLZXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgcGFyZW50J3Mga2V5IG9mIGEgYmVsb25ncy10byBjaGlsZCBub2RlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkVHlwZSBUeXBlIG9mIG5vZGUgZm9yIHRoZSBjaGlsZCBub2RlLlxuICAgICAqIEBwYXJhbSBjaGlsZEtleSBLZXkgb2YgdGhlIGNoaWxkIG5vZGUuXG4gICAgICogQHBhcmFtIHBhcmVudFR5cGUgVHlwZSBvZiBub2RlIGZvciB0aGUgcGFyZW50IG5vZGUuXG4gICAgICogQHJldHVybnMgeyp9IEtleSBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgICovXG4gICAgZ2V0UGFyZW50KGNoaWxkVHlwZSwgY2hpbGRLZXksIHBhcmVudFR5cGUpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwID0gdGhpcy5fbG9va3VwUmVsYXRpb25zaGlwKHBhcmVudFR5cGUsIGNoaWxkVHlwZSk7XG5cbiAgICAgICAgaWYgKCEocmVsYXRpb25zaGlwIGluc3RhbmNlb2YgSGFzT25lUmVsYXRpb25zaGlwKVxuICAgICAgICAgICAgJiYgIShyZWxhdGlvbnNoaXAgaW5zdGFuY2VvZiBIYXNNYW55UmVsYXRpb25zaGlwKSkge1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgYCR7cGFyZW50VHlwZX0gdG8gJHtjaGlsZFR5cGV9IHJlbGF0aW9uc2hpcCBpcyBub3QgYSBIYXMgT25lIG9yIEhhcyBNYW55IHJlbGF0aW9uc2hpcC5gXG4gICAgICAgICAgICAgICAgKyBgIEl0IGlzIGRlZmluZWQgYXM6ICR7cmVsYXRpb25zaGlwfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0R3JhcGhWYWx1ZShjaGlsZFR5cGUsIHBhcmVudFR5cGUsIGNoaWxkS2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYW4gYGFycmF5YCBvZiBhbGwgdGhlIGNoaWxkIG5vZGUga2V5cyBmb3IgYSBoYXMtbWFueSBvclxuICAgICAqIGhhcy1hbmQtYmVsb25ncy10by1tYW55IHBhcmVudCBub2RlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFR5cGUgVHlwZSBvZiBub2RlIGZvciB0aGUgcGFyZW50IG5vZGUuXG4gICAgICogQHBhcmFtIHBhcmVudEtleSBLZXkgb2YgdGhlIHBhcmVudCBub2RlLlxuICAgICAqIEBwYXJhbSBjaGlsZFR5cGUgVHlwZSBvZiBub2RlIGZvciB0aGUgY2hpbGQgbm9kZXMuXG4gICAgICogQHJldHVybnMge2FycmF5fSBBbGwgY2hpbGQgbm9kZSBrZXlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcGFyZW50IG5vZGUuXG4gICAgICovXG4gICAgZ2V0Q2hpbGRyZW4ocGFyZW50VHlwZSwgcGFyZW50S2V5LCBjaGlsZFR5cGUpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpb25zaGlwID0gdGhpcy5fbG9va3VwUmVsYXRpb25zaGlwKHBhcmVudFR5cGUsIGNoaWxkVHlwZSk7XG5cbiAgICAgICAgaWYgKCEocmVsYXRpb25zaGlwIGluc3RhbmNlb2YgSGFzTWFueVJlbGF0aW9uc2hpcClcbiAgICAgICAgICAgICYmICEocmVsYXRpb25zaGlwIGluc3RhbmNlb2YgSGFzQW5kQmVsb25nc1RvTWFueVJlbGF0aW9uc2hpcCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBgJHtwYXJlbnRUeXBlfSB0byAke2NoaWxkVHlwZX0gcmVsYXRpb25zaGlwIGlzIGEgbm90IEhhcyBPbmVgXG4gICAgICAgICAgICAgICAgKyBgIG9yIEhhcyBhbmQgQmVsb25ncyB0byBNYW55IHJlbGF0aW9uc2hpcC5gXG4gICAgICAgICAgICAgICAgKyBgIEl0IGlzIGRlZmluZWQgYXM6ICR7cmVsYXRpb25zaGlwfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0R3JhcGhWYWx1ZXMocGFyZW50VHlwZSwgY2hpbGRUeXBlLCBwYXJlbnRLZXkpO1xuICAgIH1cblxuICAgIF9sb29rdXBSZWxhdGlvbnNoaXAoZnJvbU5vZGVUeXBlLCB0b05vZGVUeXBlKSB7XG4gICAgICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMuX3NjaGVtYU1hcFtmcm9tTm9kZVR5cGVdO1xuXG4gICAgICAgIGlmICghc2NoZW1hKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNjaGVtYSB3YXMgbm90IGRlZmluZWQgZm9yICR7ZnJvbU5vZGVUeXBlfWApXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXAgPSBzY2hlbWEucmVsYXRpb25zaGlwc1t0b05vZGVUeXBlXTtcblxuICAgICAgICBpZiAoIXJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyByZWxhdGlvbnNoaXAgZGVmaW5lZCBmcm9tICR7ZnJvbU5vZGVUeXBlfSB0byAke3RvTm9kZVR5cGV9YClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWxhdGlvbnNoaXA7XG4gICAgfVxuXG4gICAgX2lzT25lVG9PbmVSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwMSwgcmVsYXRpb25zaGlwMikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcDEgaW5zdGFuY2VvZiBIYXNPbmVSZWxhdGlvbnNoaXBcbiAgICAgICAgICAgICAgICAmJiByZWxhdGlvbnNoaXAyIGluc3RhbmNlb2YgQmVsb25nc1RvUmVsYXRpb25zaGlwXG4gICAgICAgICAgICApXG4gICAgICAgICAgICB8fCAoXG4gICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwMiBpbnN0YW5jZW9mIEhhc09uZVJlbGF0aW9uc2hpcFxuICAgICAgICAgICAgICAgICYmIHJlbGF0aW9uc2hpcDEgaW5zdGFuY2VvZiBCZWxvbmdzVG9SZWxhdGlvbnNoaXBcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBfaXNPbmVUb01hbnlSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwMSwgcmVsYXRpb25zaGlwMikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcDEgaW5zdGFuY2VvZiBIYXNNYW55UmVsYXRpb25zaGlwXG4gICAgICAgICAgICAgICAgJiYgcmVsYXRpb25zaGlwMiBpbnN0YW5jZW9mIEJlbG9uZ3NUb1JlbGF0aW9uc2hpcFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgfHwgKFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcDIgaW5zdGFuY2VvZiBIYXNNYW55UmVsYXRpb25zaGlwXG4gICAgICAgICAgICAgICAgJiYgcmVsYXRpb25zaGlwMSBpbnN0YW5jZW9mIEJlbG9uZ3NUb1JlbGF0aW9uc2hpcFxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIF9pc01hbnlUb01hbnlSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwMSwgcmVsYXRpb25zaGlwMikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwMSBpbnN0YW5jZW9mIEhhc0FuZEJlbG9uZ3NUb01hbnlSZWxhdGlvbnNoaXBcbiAgICAgICAgICAgICYmIHJlbGF0aW9uc2hpcDIgaW5zdGFuY2VvZiBIYXNBbmRCZWxvbmdzVG9NYW55UmVsYXRpb25zaGlwXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgX3NldFJlbGF0aW9uc2hpcChmcm9tVHlwZSwgZnJvbUtleSwgdG9UeXBlLCB0b0tleSkge1xuICAgICAgICBpZiAoZnJvbVR5cGUgPiB0b1R5cGUpIHtcbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuX2dyYXBoW2Zyb21UeXBlXVt0b1R5cGVdO1xuICAgICAgICAgICAgZ3JhcGguc2V0KGZyb21LZXksIHRvS2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuX2dyYXBoW3RvVHlwZV1bZnJvbVR5cGVdO1xuICAgICAgICAgICAgZ3JhcGguc2V0KHRvS2V5LCBmcm9tS2V5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9yZW1vdmVSZWxhdGlvbnNoaXAodG9UeXBlLCB0b0tleSwgZnJvbVR5cGUsIGZyb21LZXkpIHtcbiAgICAgICAgaWYgKGZyb21UeXBlID4gdG9UeXBlKSB7XG4gICAgICAgICAgICBsZXQgZ3JhcGggPSB0aGlzLl9ncmFwaFtmcm9tVHlwZV1bdG9UeXBlXTtcbiAgICAgICAgICAgIGdyYXBoLnJlbW92ZShmcm9tS2V5LCB0b0tleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZ3JhcGggPSB0aGlzLl9ncmFwaFt0b1R5cGVdW2Zyb21UeXBlXTtcbiAgICAgICAgICAgIGdyYXBoLnJlbW92ZSh0b0tleSwgZnJvbUtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfYXBwZW5kT25lVG9NYW55UmVsYXRpb25zaGlwKHRvVHlwZSwgdG9LZXksIGZyb21UeXBlLCBmcm9tS2V5KSB7XG4gICAgICAgIGlmIChmcm9tVHlwZSA+IHRvVHlwZSkge1xuICAgICAgICAgICAgbGV0IGdyYXBoID0gdGhpcy5fZ3JhcGhbZnJvbVR5cGVdW3RvVHlwZV07XG4gICAgICAgICAgICBncmFwaC5hcHBlbmRWYWx1ZVRvS2V5KGZyb21LZXksIHRvS2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuX2dyYXBoW3RvVHlwZV1bZnJvbVR5cGVdO1xuICAgICAgICAgICAgZ3JhcGguYXBwZW5kS2V5VG9WYWx1ZSh0b0tleSwgZnJvbUtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfYXBwZW5kTWFueVRvTWFueVJlbGF0aW9uc2hpcCh0b1R5cGUsIHRvS2V5LCBmcm9tVHlwZSwgZnJvbUtleSkge1xuICAgICAgICBpZiAoZnJvbVR5cGUgPiB0b1R5cGUpIHtcbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuX2dyYXBoW2Zyb21UeXBlXVt0b1R5cGVdO1xuICAgICAgICAgICAgZ3JhcGguYXBwZW5kKGZyb21LZXksIHRvS2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuX2dyYXBoW3RvVHlwZV1bZnJvbVR5cGVdO1xuICAgICAgICAgICAgZ3JhcGguYXBwZW5kKHRvS2V5LCBmcm9tS2V5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9jcmVhdGVHcmFwaFJlbGF0aW9uc2hpcHMoKSB7XG4gICAgICAgIGZvciAobGV0IHNjaGVtYSBvZiB0aGlzLl9zY2hlbWFzKSB7XG4gICAgICAgICAgICBsZXQgZnJvbVR5cGUgPSBzY2hlbWEuZm9yVHlwZTtcbiAgICAgICAgICAgIGxldCB0b1R5cGVzID0gT2JqZWN0LmtleXMoc2NoZW1hLnJlbGF0aW9uc2hpcHMpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCB0b1R5cGUgb2YgdG9UeXBlcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ncmFwaFtmcm9tVHlwZV0gJiYgdGhpcy5fZ3JhcGhbZnJvbVR5cGVdW3RvVHlwZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIEJpbWFwIGFscmVhZHkgY3JlYXRlZFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBiaW1hcCA9IG5ldyBCaW1hcCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZyb21UeXBlID4gdG9UeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21lcmdlR3JhcGgoZnJvbVR5cGUsIHtbdG9UeXBlXTogYmltYXB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZXJnZUdyYXBoKHRvVHlwZSwge1tmcm9tVHlwZV06IGJpbWFwfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX21lcmdlR3JhcGgoZm9yVHlwZSwgb2JqZWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl9ncmFwaFtmb3JUeXBlXSkge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLl9ncmFwaFtmb3JUeXBlXSwgb2JqZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoW2ZvclR5cGVdID0gb2JqZWN0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2dldEdyYXBoRm9yKGZyb21UeXBlLCB0b1R5cGUpIHtcbiAgICAgICAgaWYgKGZyb21UeXBlID4gdG9UeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ3JhcGhbZnJvbVR5cGVdW3RvVHlwZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ3JhcGhbdG9UeXBlXVtmcm9tVHlwZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2V0R3JhcGhWYWx1ZXMoZnJvbVR5cGUsIHRvVHlwZSwgZnJvbUtleSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gdGhpcy5fZ2V0R3JhcGhGb3IoZnJvbVR5cGUsIHRvVHlwZSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzID0gZnJvbVR5cGUgPiB0b1R5cGUgP1xuICAgICAgICAgICAgcmVsYXRpb25zaGlwcy5nZXRLZXlWYWx1ZXMoZnJvbUtleSkgOiByZWxhdGlvbnNoaXBzLmdldFZhbHVlS2V5cyhmcm9tS2V5KTtcblxuICAgICAgICByZXR1cm4gdmFsdWVzID8gQXJyYXkuZnJvbSh2YWx1ZXMpIDogW107XG4gICAgfVxuXG4gICAgX2dldEdyYXBoVmFsdWUoZnJvbVR5cGUsIHRvVHlwZSwgZnJvbUtleSkge1xuICAgICAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gdGhpcy5fZ2V0R3JhcGhGb3IoZnJvbVR5cGUsIHRvVHlwZSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzID0gZnJvbVR5cGUgPiB0b1R5cGUgP1xuICAgICAgICAgICAgcmVsYXRpb25zaGlwcy5nZXRLZXlWYWx1ZXMoZnJvbUtleSkgOiByZWxhdGlvbnNoaXBzLmdldFZhbHVlS2V5cyhmcm9tS2V5KTtcblxuICAgICAgICBpZiAoIXZhbHVlcykge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBbdmFsdWVdID0gdmFsdWVzO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxufSJdfQ==
