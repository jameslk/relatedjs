import {expect} from 'chai';
import sinon from 'sinon';

import Bimap from '../lib/bimap';

describe('Bimap', () => {
    let bimap;

    beforeEach(() => {
        bimap = new Bimap();
    });

    it('can set a key to a value', () => {
        bimap.set('a', 'b');

        expect(keyValues('a')).to.eql(['b']);
        expect(valueKeys('b')).to.eql(['a']);
    });

    it('can replace a key and value', () => {
        bimap.set('a', 'b');
        bimap.set('a', 'c');

        expect(keyValues('a')).to.eql(['c']);
        expect(valueKeys('c')).to.eql(['a']);
        expect(valueKeys('b')).to.be.undefined;

        bimap.set('a2', 'c');

        expect(valueKeys('c')).to.eql(['a2']);
        expect(keyValues('a')).to.be.undefined;
    });

    it('can append a key and value', () => {
        bimap.append('a1', 'b');
        bimap.append('a1', 'c');
        bimap.append('a2', 'c');
        bimap.append('a2', 'd');
        bimap.append('a3', 'd');

        expect(keyValues('a1')).to.eql(['b', 'c']);
        expect(keyValues('a2')).to.eql(['c', 'd']);
        expect(keyValues('a3')).to.eql(['d']);

        expect(valueKeys('b')).to.eql(['a1']);
        expect(valueKeys('c')).to.eql(['a1', 'a2']);
        expect(valueKeys('d')).to.eql(['a2', 'a3']);
    });

    it('can append a value to a key', () => {
        bimap.set('a', 'b');
        bimap.appendValueToKey('a', 'c');
        bimap.appendValueToKey('a', 'd');

        expect(keyValues('a')).to.eql(['b', 'c', 'd']);
        expect(valueKeys('b')).to.eql(['a']);
        expect(valueKeys('c')).to.eql(['a']);
        expect(valueKeys('d')).to.eql(['a']);
    });

    it('can append a key to a value', () => {
        bimap.set('a', 'b');
        bimap.appendKeyToValue('b', 'c');
        bimap.appendKeyToValue('b', 'd');

        expect(keyValues('a')).to.eql(['b']);
        expect(valueKeys('b')).to.eql(['a', 'c', 'd']);
        expect(keyValues('c')).to.eql(['b']);
        expect(keyValues('d')).to.eql(['b']);
    });

    it('can get values for a key', () => {
        bimap.append('a', 'b');
        bimap.append('a', 'c');
        bimap.append('a', 'd');

        expect(keyValues('a')).to.eql(['b', 'c', 'd']);
    });

    it('can get keys for a value', () => {
        bimap.append('a', 'b');
        bimap.append('c', 'b');
        bimap.append('d', 'b');

        expect(valueKeys('b')).to.eql(['a', 'c', 'd']);
    });

    it('can remove a key to a value', () => {
        bimap.append('a', 'b');
        bimap.append('a', 'c');
        bimap.append('a2', 'c');
        bimap.append('a2', 'd');
        bimap.append('a3', 'd');

        bimap.remove('a', 'c');
        bimap.remove('a3', 'd');

        expect(keyValues('a')).to.eql(['b']);
        expect(keyValues('a2')).to.eql(['c', 'd']);
        expect(keyValues('a3')).to.be.undefined;

        expect(valueKeys('b')).to.eql(['a']);
        expect(valueKeys('c')).to.eql(['a2']);
        expect(valueKeys('d')).to.eql(['a2']);
    });

    it('can remove a key', () => {
        bimap.append('a', 'b');
        bimap.append('a2', 'b');
        bimap.append('a', 'c');
        bimap.append('a2', 'c');

        bimap.removeKey('a');

        expect(keyValues('a')).to.be.undefined;
        expect(keyValues('a2')).to.eql(['b', 'c']);

        expect(valueKeys('b')).to.eql(['a2']);
        expect(valueKeys('c')).to.eql(['a2']);
    });

    it('can remove a value', () => {
        bimap.append('a', 'b');
        bimap.append('a2', 'b');
        bimap.append('a', 'c');
        bimap.append('a2', 'c');

        bimap.removeValue('c');

        expect(keyValues('a')).to.eql(['b']);
        expect(keyValues('a2')).to.eql(['b']);

        expect(valueKeys('b')).to.eql(['a', 'a2']);
        expect(valueKeys('c')).to.be.undefined;
    });

    it('can convert to a literal object', () => {
        bimap.append('a', 'b');
        bimap.append('a2', 'b');
        bimap.append('a', 'c');
        bimap.append('a2', 'c');

        expect(bimap.toLiteral()).to.eql({
            keys: {'a': ['b', 'c'], 'a2': ['b', 'c']},
            values: {'b': ['a', 'a2'], 'c': ['a', 'a2']}
        });
    });

    function keyValues(key) {
        const keyValues = bimap.getKeyValues(key);
        return keyValues ? Array.from(keyValues) : keyValues;
    }

    function valueKeys(value) {
        const valueKeys = bimap.getValueKeys(value);
        return valueKeys ? Array.from(valueKeys) : valueKeys;
    }
});
