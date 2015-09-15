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

    it('overwrites relationships with subsequent sets', () => {
        graph.set('parent', 'foo').to('child', 'bar');
        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar']);

        graph.set('parent', 'foo').to('child', 'baz');
        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['baz']);

        graph.set('parent', 'foo').to('child', 'barz', 'bazz');
        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['barz', 'bazz']);
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
        graph
            .set('parent', 'foo').to('child', 'bar', 'baz')
            .set('parent', 'foo2').to('child', 'barz', 'bazz')
        ;

        expect(graph.getChildren('parent', 'foo', 'child')).to.have.members(['bar', 'baz']);
        expect(graph.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(graph.getParent('child', 'baz', 'parent')).to.equal('foo');

        expect(graph.getChildren('parent', 'foo2', 'child')).to.have.members(['barz', 'bazz']);
        expect(graph.getParent('child', 'barz', 'parent')).to.equal('foo2');
        expect(graph.getParent('child', 'bazz', 'parent')).to.equal('foo2');
    });

    it('will overwrite the last parent with multiple sets to a parent', () => {
        graph
            .set('parent', 'foo', 'foo2').to('child', 'bar', 'baz')
        ;

        expect(graph.getChildren('parent', 'foo', 'child')).to.be.empty;
        expect(graph.getChildren('parent', 'foo2', 'child')).to.have.members(['bar', 'baz']);
    });

    it('can append multiple relationships', () => {
        graph
            .append('parent', 'foo').to('child', 'bar')
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

    it('creates a new graph with merged relationships', () => {
        graph
            .set('parent', 'apple').to('child', 'square', 'triangle')
            .set('parent', 'orange').to('child', 'circle', 'rectangle')
        ;

        let graph2 = new Graph(schemas);

        graph2
            .set('parent', 'apple').to('child', 'triangle', 'star')
            .set('parent', 'peach').to('child', 'diamond', 'heart', 'circle')
        ;

        let mergedGraph = Graph.merge(graph, graph2);

        expect(mergedGraph.getChildren('parent', 'apple', 'child'))
            .to.have.members(['square', 'triangle', 'star']);

        expect(mergedGraph.getChildren('parent', 'orange', 'child'))
            .to.have.members(['rectangle']);

        expect(mergedGraph.getChildren('parent', 'peach', 'child'))
            .to.have.members(['diamond', 'heart', 'circle']);
    });
});
