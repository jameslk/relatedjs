export default class Bimap {
    constructor() {
        this._keys = new Map();
        this._values = new Map();
    }

    set(key, value) {
        this._removeLinksToKey(key);
        this._removeLinksToValue(value);
        this._setKeyLinkTo(key, value);
        this._setValueLinkTo(value, key);
    }

    appendValueToKey(key, value) {
        this._removeLinksToValue(value);
        this._appendKeyLinkTo(key, value);
        this._setValueLinkTo(value, key);
    }

    appendKeyToValue(value, key) {
        this._removeLinksToKey(key);
        this._appendValueLinkTo(value, key);
        this._setKeyLinkTo(key, value);
    }

    append(key, value) {
        this._appendKeyLinkTo(key, value);
        this._appendValueLinkTo(value, key);
    }

    remove(key, value) {
        this._removeKeyLinkTo(key, value);
        this._removeValueLinkTo(value, key);
    }

    removeKey(key) {
        this._removeLinksToKey(key);
        this._keys.delete(key);
    }

    removeValue(value) {
        this._removeLinksToValue(value);
        this._values.delete(value);
    }

    getKeyValues(key) {
        return this._keys.get(key);
    }

    getValueKeys(value) {
        return this._values.get(value);
    }

    toLiteral() {
        let keys = {};

        this._keys.forEach((values, key) => {
            keys[key] = Array.from(values);
        });

        let values = {};

        this._values.forEach((keys, value) => {
            values[value] = Array.from(keys);
        });

        return {keys, values};
    }

    _setKeyLinkTo(key, value) {
        this._keys.set(key, new Set([value]));
    }

    _appendKeyLinkTo(key, value) {
        let keyLinks = this._keys.get(key) || new Set();
        keyLinks.add(value);
        this._keys.set(key, keyLinks);
    }

    _setValueLinkTo(value, key) {
        this._values.set(value, new Set([key]));
    }

    _appendValueLinkTo(value, key) {
        let valueLinks = this._values.get(value) || new Set();
        valueLinks.add(key);
        this._values.set(value, valueLinks);
    }

    _removeKeyLinkTo(key, value) {
        const keyLinks = this._keys.get(key);

        if (keyLinks && keyLinks.size > 1) {
            keyLinks.delete(value);
        } else {
            this._keys.delete(key);
        }
    }

    _removeValueLinkTo(value, key) {
        const valueLinks = this._values.get(value);

        if (valueLinks && valueLinks.size > 1) {
            valueLinks.delete(key);
        } else {
            this._values.delete(value);
        }
    }

    _removeLinksToKey(key) {
        const valuesLinkingToKey = this._keys.get(key);

        if (!valuesLinkingToKey) {
            return;
        }

        for (let value of valuesLinkingToKey) {
            this._removeValueLinkTo(value, key);
        }
    }

    _removeLinksToValue(value) {
        const keysLinkingToValue = this._values.get(value);

        if (!keysLinkingToValue) {
            return;
        }

        for (let key of keysLinkingToValue) {
            this._removeKeyLinkTo(key, value);
        }
    }
}