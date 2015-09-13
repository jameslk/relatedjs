import {expect} from 'chai';
import sinon from 'sinon';

import Bimap from '../lib/bimap';

describe('Bimap', () => {
    let bimap;

    beforeEach(() => {
        bimap = new Bimap();
    });

    it('can set a key to a value', () => {
        bimap.set('apple', 'triangle');

        expect(keyValues('apple')).to.eql(['triangle']);
        expect(valueKeys('triangle')).to.eql(['apple']);
    });

    it('can replace a key and value', () => {
        bimap.set('apple', 'triangle');
        bimap.set('apple', 'circle');

        expect(keyValues('apple')).to.eql(['circle']);
        expect(valueKeys('circle')).to.eql(['apple']);
        expect(valueKeys('triangle')).to.be.undefined;

        bimap.set('orange', 'circle');

        expect(valueKeys('circle')).to.eql(['orange']);
        expect(keyValues('apple')).to.be.undefined;
    });

    it('can append a key and value', () => {
        bimap.append('lemon', 'triangle');
        bimap.append('lemon', 'circle');
        bimap.append('orange', 'circle');
        bimap.append('orange', 'heart');
        bimap.append('melon', 'heart');

        expect(keyValues('lemon')).to.eql(['triangle', 'circle']);
        expect(keyValues('orange')).to.eql(['circle', 'heart']);
        expect(keyValues('melon')).to.eql(['heart']);

        expect(valueKeys('triangle')).to.eql(['lemon']);
        expect(valueKeys('circle')).to.eql(['lemon', 'orange']);
        expect(valueKeys('heart')).to.eql(['orange', 'melon']);
    });

    it('can append a value to a key', () => {
        bimap.set('apple', 'triangle');
        bimap.appendValueToKey('apple', 'circle');
        bimap.appendValueToKey('apple', 'heart');

        expect(keyValues('apple')).to.eql(['triangle', 'circle', 'heart']);
        expect(valueKeys('triangle')).to.eql(['apple']);
        expect(valueKeys('circle')).to.eql(['apple']);
        expect(valueKeys('heart')).to.eql(['apple']);
    });

    it('can append a key to a value', () => {
        bimap.set('apple', 'triangle');
        bimap.appendKeyToValue('triangle', 'circle');
        bimap.appendKeyToValue('triangle', 'heart');

        expect(keyValues('apple')).to.eql(['triangle']);
        expect(valueKeys('triangle')).to.eql(['apple', 'circle', 'heart']);
        expect(keyValues('circle')).to.eql(['triangle']);
        expect(keyValues('heart')).to.eql(['triangle']);
    });

    it('can get values for a key', () => {
        bimap.append('apple', 'triangle');
        bimap.append('apple', 'circle');
        bimap.append('apple', 'heart');

        expect(keyValues('apple')).to.eql(['triangle', 'circle', 'heart']);
    });

    it('can get keys for a value', () => {
        bimap.append('apple', 'triangle');
        bimap.append('circle', 'triangle');
        bimap.append('heart', 'triangle');

        expect(valueKeys('triangle')).to.eql(['apple', 'circle', 'heart']);
    });

    it('can remove a key to a value', () => {
        bimap.append('apple', 'triangle');
        bimap.append('apple', 'circle');
        bimap.append('orange', 'circle');
        bimap.append('orange', 'heart');
        bimap.append('melon', 'heart');

        bimap.remove('apple', 'circle');
        bimap.remove('melon', 'heart');

        expect(keyValues('apple')).to.eql(['triangle']);
        expect(keyValues('orange')).to.eql(['circle', 'heart']);
        expect(keyValues('melon')).to.be.undefined;

        expect(valueKeys('triangle')).to.eql(['apple']);
        expect(valueKeys('circle')).to.eql(['orange']);
        expect(valueKeys('heart')).to.eql(['orange']);
    });

    it('can remove a key', () => {
        bimap.append('apple', 'triangle');
        bimap.append('orange', 'triangle');
        bimap.append('apple', 'circle');
        bimap.append('orange', 'circle');

        bimap.removeKey('apple');

        expect(keyValues('apple')).to.be.undefined;
        expect(keyValues('orange')).to.eql(['triangle', 'circle']);

        expect(valueKeys('triangle')).to.eql(['orange']);
        expect(valueKeys('circle')).to.eql(['orange']);
    });

    it('can remove a value', () => {
        bimap.append('apple', 'triangle');
        bimap.append('orange', 'triangle');
        bimap.append('apple', 'circle');
        bimap.append('orange', 'circle');

        bimap.removeValue('circle');

        expect(keyValues('apple')).to.eql(['triangle']);
        expect(keyValues('orange')).to.eql(['triangle']);

        expect(valueKeys('triangle')).to.eql(['apple', 'orange']);
        expect(valueKeys('circle')).to.be.undefined;
    });

    it('can convert to a literal object', () => {
        bimap.append('apple', 'triangle');
        bimap.append('orange', 'triangle');
        bimap.append('apple', 'circle');
        bimap.append('orange', 'circle');

        expect(bimap.toLiteral()).to.eql({
            keys: {'apple': ['triangle', 'circle'], 'orange': ['triangle', 'circle']},
            values: {'triangle': ['apple', 'orange'], 'circle': ['apple', 'orange']}
        });
    });

    describe('with two Bimaps', () => {
        let bimap1, bimap2;

        beforeEach(() => {
            bimap1 = new Bimap();
            bimap2 = new Bimap();

            // foo grouping
            bimap1.set('foo_apple', 'foo_triangle');

            // ->

            bimap2.set('foo_apple', 'foo_circle');
            bimap2.set('foo_orange', 'foo_heart');

            // bar grouping
            bimap1.set('bar_apple', 'bar_triangle');
            bimap1.set('bar_orange', 'bar_circle');
            bimap1.set('bar_lemon', 'bar_diamond');

            // ->

            bimap2.set('bar_apple', 'bar_circle');
            bimap2.append('bar_apple', 'bar_heart');
            bimap2.set('bar_melon', 'bar_diamond');
        });

        it('creates a new Bimap of merged keys and values', () => {
            let {keys, values} = Bimap.merge(bimap1, bimap2).toLiteral();

            expectLiteralsToMatch(keys, {
                foo_apple: ['foo_triangle', 'foo_circle'],
                foo_orange: ['foo_heart'],

                bar_apple: ['bar_triangle', 'bar_circle', 'bar_heart'],
                bar_orange: ['bar_circle'],
                bar_lemon: ['bar_diamond'],
                bar_melon: ['bar_diamond']
            });

            expectLiteralsToMatch(values, keysToValues(keys));
        });

        it('creates a new Bimap of the former keys and values replaced with the latter', () => {
            let {keys, values} = Bimap.replace(bimap1, bimap2).toLiteral();

            expect(keys).to.eql({
                foo_apple: ['foo_circle'],
                foo_orange: ['foo_heart'],

                bar_apple: ['bar_circle', 'bar_heart'],
                bar_melon: ['bar_diamond']
            });

            expectLiteralsToMatch(keysToValues(keys), values);
        });

        it('creates a new Bimap of merged keys and replaced values', () => {
            let {keys, values} = Bimap.mergeKeysReplaceValues(bimap1, bimap2).toLiteral();

            expectLiteralsToMatch(keys, {
                foo_apple: ['foo_triangle', 'foo_circle'],
                foo_orange: ['foo_heart'],

                bar_apple: ['bar_triangle', 'bar_circle', 'bar_heart'],
                bar_melon: ['bar_diamond']
            });

            expectLiteralsToMatch(values, keysToValues(keys));
        });

        it('creates a new Bimap of replaced keys and merged values', () => {
            let {keys, values} = Bimap.replaceKeysMergeValues(bimap1, bimap2).toLiteral();

            expect(keys).to.eql({
                foo_apple: ['foo_circle'],
                foo_orange: ['foo_heart'],

                bar_apple: ['bar_circle', 'bar_heart'],
                bar_orange: ['bar_circle'],
                bar_lemon: ['bar_diamond'],
                bar_melon: ['bar_diamond']
            });

            expectLiteralsToMatch(keysToValues(keys), values);
        });
    });

    function keyValuesFor(forBimap, key) {
        const keyValues = forBimap.getKeyValues(key);
        return keyValues ? Array.from(keyValues) : keyValues;
    }

    function valueKeysFor(forBimap, value) {
        const valueKeys = forBimap.getValueKeys(value);
        return valueKeys ? Array.from(valueKeys) : valueKeys;
    }

    function keyValues(key) {
        return keyValuesFor(bimap, key);
    }

    function valueKeys(value) {
        return valueKeysFor(bimap, value);
    }

    function keysToValues(keysObject) {
        let valuesObject = {};

        Object.keys(keysObject).forEach(key => {
            const values = keysObject[key];

            values.forEach(value => {
                if (valuesObject.hasOwnProperty(value)) {
                    valuesObject[value].push(key);
                } else {
                    valuesObject[value] = [key];
                }
            });
        });

        return valuesObject;
    }

    function expectLiteralsToMatch(literal1, literal2) {
        expect(literal1).to.have.all.keys(literal2);

        Object.keys(literal1).forEach(key => {
            expect(literal1[key]).to.have.members(literal2[key]);
        });
    }
});
