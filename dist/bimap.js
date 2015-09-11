/**
 * Support class for bi-directional key-value maps used internally to power
 * storing relationships for a `Graph`.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bimap = (function () {
    function Bimap() {
        _classCallCheck(this, Bimap);

        this._keys = new Map();
        this._values = new Map();
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
                keys[key] = Array.from(values);
            });

            var values = {};

            this._values.forEach(function (keys, value) {
                values[value] = Array.from(keys);
            });

            return { keys: keys, values: values };
        }
    }, {
        key: "_setKeyLinkTo",
        value: function _setKeyLinkTo(key, value) {
            this._keys.set(key, new Set([value]));
        }
    }, {
        key: "_appendKeyLinkTo",
        value: function _appendKeyLinkTo(key, value) {
            var keyLinks = this._keys.get(key) || new Set();
            keyLinks.add(value);
            this._keys.set(key, keyLinks);
        }
    }, {
        key: "_setValueLinkTo",
        value: function _setValueLinkTo(value, key) {
            this._values.set(value, new Set([key]));
        }
    }, {
        key: "_appendValueLinkTo",
        value: function _appendValueLinkTo(value, key) {
            var valueLinks = this._values.get(value) || new Set();
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
                for (var _iterator = valuesLinkingToKey[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
                for (var _iterator2 = keysLinkingToValue[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
//# sourceMappingURL=data:application/json;base64,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QUFDckIsdUJBQU87YUFDVjs7Ozs7OztBQUVELHNDQUFnQixrQkFBa0IsbUlBQUU7d0JBQTNCLEdBQUc7O0FBQ1Isd0JBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3JDOzs7Ozs7Ozs7Ozs7Ozs7U0FDSjs7O1dBbklnQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJsaWIvYmltYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1cHBvcnQgY2xhc3MgZm9yIGJpLWRpcmVjdGlvbmFsIGtleS12YWx1ZSBtYXBzIHVzZWQgaW50ZXJuYWxseSB0byBwb3dlclxuICogc3RvcmluZyByZWxhdGlvbnNoaXBzIGZvciBhIGBHcmFwaGAuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpbWFwIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fa2V5cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5fdmFsdWVzID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUxpbmtzVG9LZXkoa2V5KTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTGlua3NUb1ZhbHVlKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fc2V0S2V5TGlua1RvKGtleSwgdmFsdWUpO1xuICAgICAgICB0aGlzLl9zZXRWYWx1ZUxpbmtUbyh2YWx1ZSwga2V5KTtcbiAgICB9XG5cbiAgICBhcHBlbmRWYWx1ZVRvS2V5KGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTGlua3NUb1ZhbHVlKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fYXBwZW5kS2V5TGlua1RvKGtleSwgdmFsdWUpO1xuICAgICAgICB0aGlzLl9zZXRWYWx1ZUxpbmtUbyh2YWx1ZSwga2V5KTtcbiAgICB9XG5cbiAgICBhcHBlbmRLZXlUb1ZhbHVlKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTGlua3NUb0tleShrZXkpO1xuICAgICAgICB0aGlzLl9hcHBlbmRWYWx1ZUxpbmtUbyh2YWx1ZSwga2V5KTtcbiAgICAgICAgdGhpcy5fc2V0S2V5TGlua1RvKGtleSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGFwcGVuZChrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2FwcGVuZEtleUxpbmtUbyhrZXksIHZhbHVlKTtcbiAgICAgICAgdGhpcy5fYXBwZW5kVmFsdWVMaW5rVG8odmFsdWUsIGtleSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlS2V5TGlua1RvKGtleSwgdmFsdWUpO1xuICAgICAgICB0aGlzLl9yZW1vdmVWYWx1ZUxpbmtUbyh2YWx1ZSwga2V5KTtcbiAgICB9XG5cbiAgICByZW1vdmVLZXkoa2V5KSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUxpbmtzVG9LZXkoa2V5KTtcbiAgICAgICAgdGhpcy5fa2V5cy5kZWxldGUoa2V5KTtcbiAgICB9XG5cbiAgICByZW1vdmVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9yZW1vdmVMaW5rc1RvVmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLl92YWx1ZXMuZGVsZXRlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBnZXRLZXlWYWx1ZXMoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9rZXlzLmdldChrZXkpO1xuICAgIH1cblxuICAgIGdldFZhbHVlS2V5cyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVzLmdldCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgdG9MaXRlcmFsKCkge1xuICAgICAgICBsZXQga2V5cyA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2tleXMuZm9yRWFjaCgodmFsdWVzLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGtleXNba2V5XSA9IEFycmF5LmZyb20odmFsdWVzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHZhbHVlcyA9IHt9O1xuXG4gICAgICAgIHRoaXMuX3ZhbHVlcy5mb3JFYWNoKChrZXlzLCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdmFsdWVzW3ZhbHVlXSA9IEFycmF5LmZyb20oa2V5cyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7a2V5cywgdmFsdWVzfTtcbiAgICB9XG5cbiAgICBfc2V0S2V5TGlua1RvKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fa2V5cy5zZXQoa2V5LCBuZXcgU2V0KFt2YWx1ZV0pKTtcbiAgICB9XG5cbiAgICBfYXBwZW5kS2V5TGlua1RvKGtleSwgdmFsdWUpIHtcbiAgICAgICAgbGV0IGtleUxpbmtzID0gdGhpcy5fa2V5cy5nZXQoa2V5KSB8fCBuZXcgU2V0KCk7XG4gICAgICAgIGtleUxpbmtzLmFkZCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX2tleXMuc2V0KGtleSwga2V5TGlua3MpO1xuICAgIH1cblxuICAgIF9zZXRWYWx1ZUxpbmtUbyh2YWx1ZSwga2V5KSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlcy5zZXQodmFsdWUsIG5ldyBTZXQoW2tleV0pKTtcbiAgICB9XG5cbiAgICBfYXBwZW5kVmFsdWVMaW5rVG8odmFsdWUsIGtleSkge1xuICAgICAgICBsZXQgdmFsdWVMaW5rcyA9IHRoaXMuX3ZhbHVlcy5nZXQodmFsdWUpIHx8IG5ldyBTZXQoKTtcbiAgICAgICAgdmFsdWVMaW5rcy5hZGQoa2V5KTtcbiAgICAgICAgdGhpcy5fdmFsdWVzLnNldCh2YWx1ZSwgdmFsdWVMaW5rcyk7XG4gICAgfVxuXG4gICAgX3JlbW92ZUtleUxpbmtUbyhrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGtleUxpbmtzID0gdGhpcy5fa2V5cy5nZXQoa2V5KTtcblxuICAgICAgICBpZiAoa2V5TGlua3MgJiYga2V5TGlua3Muc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgIGtleUxpbmtzLmRlbGV0ZSh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9rZXlzLmRlbGV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlbW92ZVZhbHVlTGlua1RvKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgY29uc3QgdmFsdWVMaW5rcyA9IHRoaXMuX3ZhbHVlcy5nZXQodmFsdWUpO1xuXG4gICAgICAgIGlmICh2YWx1ZUxpbmtzICYmIHZhbHVlTGlua3Muc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgIHZhbHVlTGlua3MuZGVsZXRlKGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZXMuZGVsZXRlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9yZW1vdmVMaW5rc1RvS2V5KGtleSkge1xuICAgICAgICBjb25zdCB2YWx1ZXNMaW5raW5nVG9LZXkgPSB0aGlzLl9rZXlzLmdldChrZXkpO1xuXG4gICAgICAgIGlmICghdmFsdWVzTGlua2luZ1RvS2V5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXNMaW5raW5nVG9LZXkpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZVZhbHVlTGlua1RvKHZhbHVlLCBrZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlbW92ZUxpbmtzVG9WYWx1ZSh2YWx1ZSkge1xuICAgICAgICBjb25zdCBrZXlzTGlua2luZ1RvVmFsdWUgPSB0aGlzLl92YWx1ZXMuZ2V0KHZhbHVlKTtcblxuICAgICAgICBpZiAoIWtleXNMaW5raW5nVG9WYWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQga2V5IG9mIGtleXNMaW5raW5nVG9WYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlS2V5TGlua1RvKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==
