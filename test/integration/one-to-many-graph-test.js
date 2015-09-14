import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Graph} from '../../lib';
import {inspectGraph} from '../support/inspect';

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

    it('provides undefined for a missing parent relationship', () => {
        expect(graph.getParent('child', 'bar', 'parent')).to.be.undefined;
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

    it('can append relationships', () => {
        graph
            .append('child', 'bar').to('parent', 'foo')
            .append('child', 'baz').to('parent', 'foo')
        ;

        expect(graph.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(graph.getParent('child', 'baz', 'parent')).to.equal('foo');
        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar', 'baz']);
    });

    it('overwrites the relationship with subsequent appends to a different parent', () => {
        graph
            .append('child', 'bar').to('parent', 'foo')
            .append('child', 'bar').to('parent', 'foos')
        ;

        expect(graph.getParent('child', 'bar', 'parent')).to.equal('foos');

        expect(graph.getChildren('parent', 'foo', 'child')).to.be.an('array');
        expect(graph.getChildren('parent', 'foo', 'child')).to.be.empty;

        expect(graph.getChildren('parent', 'foos', 'child')).to.have.members(['bar']);
    });

    it('can remove a relationship', () => {
        graph
            .append('child', 'bar').to('parent', 'foo')
            .append('child', 'baz').to('parent', 'foo')
            .append('child', 'bazz').to('parent', 'foo')
            .remove('child', 'baz').from('parent', 'foo')
        ;

        expect(graph.getParent('child', 'baz', 'parent')).to.be.undefined;
        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar', 'bazz']);
    });

    it('can remove all relationships using a specific a key', () => {
        graph
            .append('child', 'bar').to('parent', 'foo')
            .append('child', 'baz').to('parent', 'foo')
            .append('child', 'barz').to('parent', 'foos')
            .append('child', 'bazz').to('parent', 'foos')
            .removeUsage('parent', 'foo')
        ;

        expect(graph.getChildren('parent', 'foo', 'child')).be.empty;
        expect(graph.getChildren('parent', 'foos', 'child')).to.have.members(['barz', 'bazz']);

        expect(graph.getParent('child', 'bar', 'parent')).to.be.undefined;
        expect(graph.getParent('child', 'bazz', 'parent')).to.equal('foos');
    });

    it('can set multiple relationships', () => {
        graph.set('parent', 'foo').to('child', 'bar', 'baz');

        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar', 'baz']);
        expect(graph.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(graph.getParent('child', 'baz', 'parent')).to.equal('foo');
    });

    it('can append multiple relationships', () => {
        graph
            .set('parent', 'foo').to('child', 'bar')
            .append('parent', 'foo').to('child', 'baz', 'barz')
        ;

        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar', 'baz', 'barz']);
        expect(graph.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(graph.getParent('child', 'baz', 'parent')).to.equal('foo');
        expect(graph.getParent('child', 'barz', 'parent')).to.equal('foo');
    });

    it('can remove multiple relationships', () => {
        graph
            .set('parent', 'foo').to('child', 'bar', 'baz', 'barz')
            .remove('parent', 'foo').from('child', 'baz', 'barz')
        ;

        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar']);
        expect(graph.getParent('child', 'baz', 'parent')).to.be.undefined;
        expect(graph.getParent('child', 'barz', 'parent')).to.be.undefined;
    });
});
