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
//# sourceMappingURL=data:application/json;base64,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QixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDckM7Ozs7Ozs7Ozs7Ozs7OztTQUNKOzs7V0FuSWdCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6ImxpYi9iaW1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VwcG9ydCBjbGFzcyBmb3IgYmktZGlyZWN0aW9uYWwga2V5LXZhbHVlIG1hcHMgdXNlZCBpbnRlcm5hbGx5IHRvIHBvd2VyXG4gKiBzdG9yaW5nIHJlbGF0aW9uc2hpcHMgZm9yIGEgYEdyYXBoYC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmltYXAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9rZXlzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl92YWx1ZXMgPSBuZXcgTWFwKCk7XG4gICAgfVxuXG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTGlua3NUb0tleShrZXkpO1xuICAgICAgICB0aGlzLl9yZW1vdmVMaW5rc1RvVmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLl9zZXRLZXlMaW5rVG8oa2V5LCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3NldFZhbHVlTGlua1RvKHZhbHVlLCBrZXkpO1xuICAgIH1cblxuICAgIGFwcGVuZFZhbHVlVG9LZXkoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9yZW1vdmVMaW5rc1RvVmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLl9hcHBlbmRLZXlMaW5rVG8oa2V5LCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3NldFZhbHVlTGlua1RvKHZhbHVlLCBrZXkpO1xuICAgIH1cblxuICAgIGFwcGVuZEtleVRvVmFsdWUodmFsdWUsIGtleSkge1xuICAgICAgICB0aGlzLl9yZW1vdmVMaW5rc1RvS2V5KGtleSk7XG4gICAgICAgIHRoaXMuX2FwcGVuZFZhbHVlTGlua1RvKHZhbHVlLCBrZXkpO1xuICAgICAgICB0aGlzLl9zZXRLZXlMaW5rVG8oa2V5LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgYXBwZW5kKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fYXBwZW5kS2V5TGlua1RvKGtleSwgdmFsdWUpO1xuICAgICAgICB0aGlzLl9hcHBlbmRWYWx1ZUxpbmtUbyh2YWx1ZSwga2V5KTtcbiAgICB9XG5cbiAgICByZW1vdmUoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9yZW1vdmVLZXlMaW5rVG8oa2V5LCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3JlbW92ZVZhbHVlTGlua1RvKHZhbHVlLCBrZXkpO1xuICAgIH1cblxuICAgIHJlbW92ZUtleShrZXkpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTGlua3NUb0tleShrZXkpO1xuICAgICAgICB0aGlzLl9rZXlzLmRlbGV0ZShrZXkpO1xuICAgIH1cblxuICAgIHJlbW92ZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUxpbmtzVG9WYWx1ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3ZhbHVlcy5kZWxldGUodmFsdWUpO1xuICAgIH1cblxuICAgIGdldEtleVZhbHVlcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleXMuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgZ2V0VmFsdWVLZXlzKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZXMuZ2V0KHZhbHVlKTtcbiAgICB9XG5cbiAgICB0b0xpdGVyYWwoKSB7XG4gICAgICAgIGxldCBrZXlzID0ge307XG5cbiAgICAgICAgdGhpcy5fa2V5cy5mb3JFYWNoKCh2YWx1ZXMsIGtleSkgPT4ge1xuICAgICAgICAgICAga2V5c1trZXldID0gQXJyYXkuZnJvbSh2YWx1ZXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgdmFsdWVzID0ge307XG5cbiAgICAgICAgdGhpcy5fdmFsdWVzLmZvckVhY2goKGtleXMsIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB2YWx1ZXNbdmFsdWVdID0gQXJyYXkuZnJvbShrZXlzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtrZXlzLCB2YWx1ZXN9O1xuICAgIH1cblxuICAgIF9zZXRLZXlMaW5rVG8oa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLl9rZXlzLnNldChrZXksIG5ldyBTZXQoW3ZhbHVlXSkpO1xuICAgIH1cblxuICAgIF9hcHBlbmRLZXlMaW5rVG8oa2V5LCB2YWx1ZSkge1xuICAgICAgICBsZXQga2V5TGlua3MgPSB0aGlzLl9rZXlzLmdldChrZXkpIHx8IG5ldyBTZXQoKTtcbiAgICAgICAga2V5TGlua3MuYWRkKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fa2V5cy5zZXQoa2V5LCBrZXlMaW5rcyk7XG4gICAgfVxuXG4gICAgX3NldFZhbHVlTGlua1RvKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgdGhpcy5fdmFsdWVzLnNldCh2YWx1ZSwgbmV3IFNldChba2V5XSkpO1xuICAgIH1cblxuICAgIF9hcHBlbmRWYWx1ZUxpbmtUbyh2YWx1ZSwga2V5KSB7XG4gICAgICAgIGxldCB2YWx1ZUxpbmtzID0gdGhpcy5fdmFsdWVzLmdldCh2YWx1ZSkgfHwgbmV3IFNldCgpO1xuICAgICAgICB2YWx1ZUxpbmtzLmFkZChrZXkpO1xuICAgICAgICB0aGlzLl92YWx1ZXMuc2V0KHZhbHVlLCB2YWx1ZUxpbmtzKTtcbiAgICB9XG5cbiAgICBfcmVtb3ZlS2V5TGlua1RvKGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qga2V5TGlua3MgPSB0aGlzLl9rZXlzLmdldChrZXkpO1xuXG4gICAgICAgIGlmIChrZXlMaW5rcyAmJiBrZXlMaW5rcy5zaXplID4gMSkge1xuICAgICAgICAgICAga2V5TGlua3MuZGVsZXRlKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2tleXMuZGVsZXRlKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcmVtb3ZlVmFsdWVMaW5rVG8odmFsdWUsIGtleSkge1xuICAgICAgICBjb25zdCB2YWx1ZUxpbmtzID0gdGhpcy5fdmFsdWVzLmdldCh2YWx1ZSk7XG5cbiAgICAgICAgaWYgKHZhbHVlTGlua3MgJiYgdmFsdWVMaW5rcy5zaXplID4gMSkge1xuICAgICAgICAgICAgdmFsdWVMaW5rcy5kZWxldGUoa2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5kZWxldGUodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlbW92ZUxpbmtzVG9LZXkoa2V5KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlc0xpbmtpbmdUb0tleSA9IHRoaXMuX2tleXMuZ2V0KGtleSk7XG5cbiAgICAgICAgaWYgKCF2YWx1ZXNMaW5raW5nVG9LZXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlc0xpbmtpbmdUb0tleSkge1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlVmFsdWVMaW5rVG8odmFsdWUsIGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcmVtb3ZlTGlua3NUb1ZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGtleXNMaW5raW5nVG9WYWx1ZSA9IHRoaXMuX3ZhbHVlcy5nZXQodmFsdWUpO1xuXG4gICAgICAgIGlmICgha2V5c0xpbmtpbmdUb1ZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5c0xpbmtpbmdUb1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVLZXlMaW5rVG8oa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59Il19
