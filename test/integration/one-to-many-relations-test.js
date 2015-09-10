import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Relations} from '../../lib';

describe('Relations with a one to many relationship', () => {
    let schemas;
    let relations;

    beforeEach(() => {
        schemas = [
            Schema.define('parent').hasMany('child'),
            Schema.define('child').belongsTo('parent')
        ];

        relations = new Relations(schemas);
    });

    it('provides null for a missing parent relationship', () => {
        expect(relations.getParent('child', 'bar', 'parent')).to.equal(null);
    });

    it('provides an empty array for no children relationships', () => {
        expect(relations.getChildren('parent', 'foo', 'child')).to.be.an('array');
        expect(relations.getChildren('parent', 'foo', 'child')).to.be.empty;
    });

    it('can set a relationship', () => {
        relations.set('child', 'bar').to('parent', 'foo');

        expect(relations.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(relations.getChildren('parent', 'foo', 'child')).to.have.members(['bar']);
    });

    it('appends the relationship with subsequent sets', () => {
        relations
            .set('child', 'bar').to('parent', 'foo')
            .set('child', 'baz').to('parent', 'foo');

        expect(relations.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(relations.getParent('child', 'baz', 'parent')).to.equal('foo');
        expect(relations.getChildren('parent', 'foo', 'child')).to.have.members(['bar', 'baz']);
    });

    it('overwrites the relationship with subsequent sets to a different parent', () => {
        relations
            .set('child', 'bar').to('parent', 'foo')
            .set('child', 'bar').to('parent', 'foos');

        expect(relations.getParent('child', 'bar', 'parent')).to.equal('foos');

        expect(relations.getChildren('parent', 'foo', 'child')).to.be.an('array');
        expect(relations.getChildren('parent', 'foo', 'child')).to.be.empty;

        expect(relations.getChildren('parent', 'foos', 'child')).to.have.members(['bar']);
    });

    it('can remove a relationship', () => {
        relations
            .set('child', 'bar').to('parent', 'foo')
            .set('child', 'baz').to('parent', 'foo')
            .set('child', 'bazz').to('parent', 'foo')
            .remove('child', 'baz').from('parent', 'foo');

        expect(relations.getParent('child', 'baz', 'parent')).to.equal(null);
        expect(relations.getChildren('parent', 'foo', 'child')).to.have.members(['bar', 'bazz']);
    });
});
