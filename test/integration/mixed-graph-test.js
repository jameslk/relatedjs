import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Graph} from '../../lib';

describe('Graph with mixed relationships', () => {
    let schemas;
    let graph;

    beforeEach(() => {
        schemas = [
            Schema.define('parentWithChild')
                .hasOne('child'),

            Schema.define('parentWithChildren')
                .hasMany('child'),

            Schema.define('child')
                .belongsTo('parentWithChild')
                .belongsTo('parentWithChildren')
        ];

        graph = new Graph(schemas);
    });

    it('can set relationships', () => {
        graph
            .set('child', 'bar').to('parentWithChild', 'foo')
            .set('child', 'baz').to('parentWithChild', 'foo')
            .set('child', 'bar').to('parentWithChildren', 'foos')
            .set('child', 'baz').to('parentWithChildren', 'foos');

        //expect(graph.getParent('child', 'bar', 'parentWithChild')).to.equal('foo');
        //expect(graph.getChild('parentWithChild', 'foo', 'child')).to.equal('bar');
        //
        //expect(graph.getParent('child', 'bar', 'parentWithChildren')).to.equal('foos');
        //expect(graph.getChildren('parentWithChildren', 'foos', 'child')).to.have.members(['bar']);
    });

    //it('can remove a relationship', () => {
    //});

    //it('can remove all relationships using a specific a key', () => {
    //});
});
