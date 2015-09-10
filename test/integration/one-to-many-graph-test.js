import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Graph} from '../../lib';

describe('Graph with a one to many relationship', () => {
    let schemas;
    let graph;

    beforeEach(() => {
        schemas = [
            Schema.define('parent').hasMany('child'),
            Schema.define('child').belongsTo('parent')
        ];

        graph = new Graph(schemas);
    });

    it('provides null for a missing parent relationship', () => {
        expect(graph.getParent('child', 'bar', 'parent')).to.equal(null);
    });

    it('provides an empty array for no children relationships', () => {
        expect(graph.getChildren('parent', 'foo', 'child')).to.be.an('array');
        expect(graph.getChildren('parent', 'foo', 'child')).to.be.empty;
    });

    it('can set a relationship', () => {
        graph.set('child', 'bar').to('parent', 'foo');

        expect(graph.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar']);
    });

    it('appends the relationship with subsequent sets', () => {
        graph
            .set('child', 'bar').to('parent', 'foo')
            .set('child', 'baz').to('parent', 'foo');

        expect(graph.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(graph.getParent('child', 'baz', 'parent')).to.equal('foo');
        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar', 'baz']);
    });

    it('overwrites the relationship with subsequent sets to a different parent', () => {
        graph
            .set('child', 'bar').to('parent', 'foo')
            .set('child', 'bar').to('parent', 'foos');

        expect(graph.getParent('child', 'bar', 'parent')).to.equal('foos');

        expect(graph.getChildren('parent', 'foo', 'child')).to.be.an('array');
        expect(graph.getChildren('parent', 'foo', 'child')).to.be.empty;

        expect(graph.getChildren('parent', 'foos', 'child')).to.have.members(['bar']);
    });

    it('can remove a relationship', () => {
        graph
            .set('child', 'bar').to('parent', 'foo')
            .set('child', 'baz').to('parent', 'foo')
            .set('child', 'bazz').to('parent', 'foo')
            .remove('child', 'baz').from('parent', 'foo');

        expect(graph.getParent('child', 'baz', 'parent')).to.equal(null);
        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar', 'bazz']);
    });
});
