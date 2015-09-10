import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Relations} from '../../lib';

describe('Relations with a one-to-one relationship', () => {
    let schemas;
    let relations;

    beforeEach(() => {
        schemas = [
            Schema.define('parent').hasOne('child'),
            Schema.define('child').belongsTo('parent')
        ];

        relations = new Relations(schemas);
    });

    it('provides null for a missing relationship', () => {
        expect(relations.getParent('child', 'bar', 'parent')).to.equal(null);
        expect(relations.getChild('parent', 'foo', 'child')).to.equal(null);
    });

    it('can set a relationship', () => {
        relations.set('child', 'bar').to('parent', 'foo');

        expect(relations.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(relations.getChild('parent', 'foo', 'child')).to.equal('bar');
    });

    it('overwrites the relationship with subsequent sets', () => {
        relations
            .set('child', 'bar').to('parent', 'foo')
            .set('child', 'baz').to('parent', 'foo');

        expect(relations.getParent('child', 'bar', 'parent')).to.equal(null);

        expect(relations.getParent('child', 'baz', 'parent')).to.equal('foo');
        expect(relations.getChild('parent', 'foo', 'child')).to.equal('baz');
    });

    it('can remove a relationship', () => {
        relations
            .set('child', 'bar').to('parent', 'foo')
            .remove('child', 'bar').from('parent', 'foo');

        expect(relations.getParent('child', 'bar', 'parent')).to.equal(null);
        expect(relations.getChild('parent', 'foo', 'child')).to.equal(null);
    });

    //it('can remove all relationships using a specific a key', () => {
    //    relations
    //        .set('child', 'bar').to('parent', 'foo')
    //        .removeUsage('child', 'bar');
    //
    //    expect(relations.getParent('child', 'bar', 'parent')).to.equal(null);
    //    expect(relations.getChild('parent', 'foo', 'child')).to.equal(null);
    //});
});
