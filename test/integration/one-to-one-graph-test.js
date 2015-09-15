import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Graph} from '../../lib';
import {inspectGraph} from '../support/inspect';

describe('Graph with a one-to-one relationship', () => {
    let schemas;
    let graph;

    beforeEach(() => {
        schemas = [
            Schema.define('parent').hasOne('child'),
            Schema.define('child').belongsTo('parent')
        ];

        graph = new Graph(schemas);
    });

    it('provides undefined for a missing relationship', () => {
        expect(graph.getParent('child', 'bar', 'parent')).to.be.undefined;
        expect(graph.getChild('parent', 'foo', 'child')).to.be.undefined;
    });

    it('can set a relationship', () => {
        graph.set('child', 'bar').to('parent', 'foo');

        expect(graph.getParent('child', 'bar', 'parent')).to.equal('foo');
        expect(graph.getChild('parent', 'foo', 'child')).to.equal('bar');
    });

    it('overwrites the relationship with subsequent sets', () => {
        graph
            .set('child', 'bar').to('parent', 'foo')
            .set('child', 'baz').to('parent', 'foo');

        expect(graph.getParent('child', 'bar', 'parent')).to.be.undefined;

        expect(graph.getParent('child', 'baz', 'parent')).to.equal('foo');
        expect(graph.getChild('parent', 'foo', 'child')).to.equal('baz');
    });

    it('can remove a relationship', () => {
        graph
            .set('child', 'bar').to('parent', 'foo')
            .remove('child', 'bar').from('parent', 'foo');

        expect(graph.getParent('child', 'bar', 'parent')).to.be.undefined;
        expect(graph.getChild('parent', 'foo', 'child')).to.be.undefined;
    });

    it('can remove all relationships using a specific a key', () => {
        graph
            .set('child', 'bar').to('parent', 'foo')
            .set('child', 'foo').to('parent', 'bar')
            .removeUsage('child', 'bar');

        expect(graph.getParent('child', 'bar', 'parent')).to.be.undefined;
        expect(graph.getChild('parent', 'foo', 'child')).to.be.undefined;

        expect(graph.getParent('child', 'foo', 'parent')).to.equal('bar');
        expect(graph.getChild('parent', 'bar', 'child')).to.equal('foo');
    });

    it('creates a new graph with merged relationships', () => {
        graph
            .setTo('parent', 'foo', 'child', 'bar')
            .setTo('parent', 'foos', 'child', 'baz')
            .setTo('parent', 'fooss', 'child', 'bazz')
        ;

        let graph2 = new Graph(schemas);

        graph2
            .setTo('parent', 'foo', 'child', 'barz')
            .setTo('parent', 'fooz', 'child', 'baz')
        ;

        let mergedGraph = Graph.merge(graph, graph2);

        expect(mergedGraph.getChild('parent', 'foo', 'child')).to.equal('barz');
        expect(mergedGraph.getChild('parent', 'foo', 'child', 'barz'));
    });
});
