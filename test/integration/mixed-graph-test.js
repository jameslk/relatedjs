import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Graph} from '../../lib';
import {inspectGraph} from '../support/inspect';

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

    it('can append relationships', () => {
        graph
            .appendTo('parentWithChild', 'foo', 'child', 'bar')
            .appendTo('parentWithChild', 'foo', 'child', 'baz')
            .appendTo('parentWithChildren', 'foos', 'child', 'bar')
            .appendTo('parentWithChildren', 'foos', 'child', 'baz')
        ;

        expect(graph.getParent('child', 'bar', 'parentWithChild')).to.be.undefined;
        expect(graph.getParent('child', 'baz', 'parentWithChild')).to.equal('foo');
        expect(graph.getChild('parentWithChild', 'foo', 'child')).to.equal('baz');

        expect(graph.getParent('child', 'bar', 'parentWithChildren')).to.equal('foos');
        expect(graph.getChildren('parentWithChildren', 'foos', 'child')).to.have.members(['bar', 'baz']);
    });

    it('can remove a relationship', () => {
        graph
            .setTo('parentWithChild', 'foo', 'child', 'bar')
            .appendTo('parentWithChildren', 'foos', 'child', 'bar')
            .appendTo('parentWithChildren', 'foos', 'child', 'baz')
            .removeFrom('parentWithChildren', 'foos', 'child', 'bar')
        ;

        expect(graph.getChild('parentWithChild', 'foo', 'child')).to.equal('bar');
        expect(graph.getChildren('parentWithChildren', 'foos', 'child')).to.have.members(['baz']);
    });

    it('can remove all relationships using a specific a key', () => {
        graph
            .setTo('parentWithChild', 'foo', 'child', 'bar')
            .appendTo('parentWithChildren', 'foos', 'child', 'bar')
            .appendTo('parentWithChildren', 'foos', 'child', 'baz')
            .removeUsage('child', 'bar')
        ;

        expect(graph.getChild('parentWithChild', 'foo', 'child')).to.be.undefined;
        expect(graph.getChildren('parentWithChildren', 'foos', 'child')).to.have.members(['baz']);
    });
});
