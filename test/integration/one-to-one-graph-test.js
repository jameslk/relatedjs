import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Graph} from '../../lib';

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

    it('provides null for a missing relationship', () => {
        expect(graph.getParent('child', 'bar', 'parent')).to.equal(null);
        expect(graph.getChild('parent', 'foo', 'child')).to.equal(null);
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

        expect(graph.getParent('child', 'bar', 'parent')).to.equal(null);

        expect(graph.getParent('child', 'baz', 'parent')).to.equal('foo');
        expect(graph.getChild('parent', 'foo', 'child')).to.equal('baz');
    });

    it('can remove a relationship', () => {
        graph
            .set('child', 'bar').to('parent', 'foo')
            .remove('child', 'bar').from('parent', 'foo');

        expect(graph.getParent('child', 'bar', 'parent')).to.equal(null);
        expect(graph.getChild('parent', 'foo', 'child')).to.equal(null);
    });

    //it('can remove all relationships using a specific a key', () => {
    //    graph
    //        .set('child', 'bar').to('parent', 'foo')
    //        .removeUsage('child', 'bar');
    //
    //    expect(graph.getParent('child', 'bar', 'parent')).to.equal(null);
    //    expect(graph.getChild('parent', 'foo', 'child')).to.equal(null);
    //});
});
