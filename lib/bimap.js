/**
 * Support class for bi-directional key-value maps used internally to power
 * storing relationships for a `Graph`.
 */
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

    appendKeyToValue(key, value) {
        this._removeLinksToKey(key);
        this._appendValueLinkTo(value, key);
        this._setKeyLinkTo(key, value);
    }

    append(key, value) {
        this._appendKeyLinkTo(key, value);
        this._appendValueLinkTo(value, key);
    }

    remove(key, value) {
        if (this.has(key, value)) {
            this._removeKeyLinkTo(key, value);
            this._removeValueLinkTo(value, key);
        }
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

    has(key, value) {
        return this._keys.has(key) && this._keys.get(key).has(value);
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

    static merge(bimap1, bimap2) {
        let resultBimap = new this();

        resultBimap._keys = this._mergeMapSets(
            [new Map(), bimap1._keys, bimap2._keys]
        );

        resultBimap._values = this._mergeMapSets(
            [new Map(), bimap1._values, bimap2._values]
        );

        return resultBimap;
    }

    static replace(bimap1, bimap2) {
        let resultBimap = new this();

        const excludedKeyValues = new Set(bimap2._values.keys());
        const excludedValueKeys = new Set(bimap2._keys.keys());

        resultBimap._values = this._mergeMapSets([
            this._newFilteredMapSet(bimap1._values, excludedKeyValues, excludedValueKeys),
            bimap2._values
        ]);

        resultBimap._keys = this._mergeMapSets([
            this._newFilteredMapSet(bimap1._keys, excludedValueKeys, excludedKeyValues),
            bimap2._keys
        ]);

        return resultBimap;
    }

    static mergeKeysReplaceValues(bimap1, bimap2) {
        let resultBimap = new this();

        const excludedKeyValues = new Set(bimap2._values.keys());

        resultBimap._values = this._mergeMapSets([this._newFilteredMapSet(
            bimap1._values,
            excludedKeyValues
        ), bimap2._values]);

        const excludedValueKeys = new Set(function *() {
            for (let valueKeys of bimap2._values) {
                yield *valueKeys;
            }
        }());

        resultBimap._keys = this._mergeMapSets([
            this._newFilteredMapSet(bimap1._keys, null, excludedValueKeys),
            bimap2._keys
        ]);

        return resultBimap;
    }

    static replaceKeysMergeValues(bimap1, bimap2) {
        let resultBimap = new this();

        const excludedValueKeys = new Set(bimap2._keys.keys());

        resultBimap._keys = this._mergeMapSets([this._newFilteredMapSet(
            bimap1._keys,
            excludedValueKeys
        ), bimap2._keys]);

        const excludedKeyValues = new Set(function *() {
            for (let keyValues of bimap2._keys) {
                yield *keyValues;
            }
        }());

        resultBimap._values = this._mergeMapSets([
            this._newFilteredMapSet(bimap1._values, null, excludedKeyValues),
            bimap2._values
        ]);

        return resultBimap;
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

    static _mergeMapSets(mapSets) {
        const mergeSets = (set1, set2) => new Set(function *() {
            yield *set1;
            yield *set2;
        }());

        return mapSets.reduce((resultMapSet, mapSet) => {
            mapSet.forEach((values, key) => {
                const currentValues = resultMapSet.get(key);

                if (currentValues) {
                    resultMapSet.set(key, mergeSets(currentValues, values));
                } else {
                    resultMapSet.set(key, values);
                }
            });

            return resultMapSet;

        });
    }

    static _newFilteredMapSet(mapSet, excludedKeySet = null, excludedValueSet = null) {
        let resultMapSet = new Map();

        mapSet.forEach((values, key) => {
            if (excludedKeySet && excludedKeySet.has(key)) {
                return;
            }

            let filteredValues;

            if (excludedValueSet) {
                filteredValues = new Set();

                for (let value of values) {
                    if (!excludedValueSet.has(value)) {
                        filteredValues.add(value);
                    }
                }
            } else {
                filteredValues = new Set(values);
            }

            if (!filteredValues.size) {
                return;
            }

            resultMapSet.set(key, filteredValues);
        });

        return resultMapSet;
    }
}