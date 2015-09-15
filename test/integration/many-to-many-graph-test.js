import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Graph} from '../../lib';
import {inspectGraph} from '../support/inspect';

describe('Graph with many to many relationships', () => {
    let schemas;
    let graph;

    beforeEach(() => {
        schemas = [
            Schema.define('type1').hasAndBelongsToMany('type2'),
            Schema.define('type2').hasAndBelongsToMany('type1')
        ];

        graph = new Graph(schemas);
    });

    it('provides an empty array for no children relationships', () => {
        expect(graph.getChildren('type1', 'foo', 'type2')).to.be.an('array');
        expect(graph.getChildren('type1', 'foo', 'type2')).to.be.empty;

        expect(graph.getChildren('type2', 'foo', 'type1')).to.be.an('array');
        expect(graph.getChildren('type2', 'foo', 'type1')).to.be.empty;
    });

    it('can set a relationship', () => {
        graph.set('type2', 'bar').to('type1', 'foo');

        expect(graph.getChildren('type1', 'foo', 'type2')).to.have.members(['bar']);
        expect(graph.getChildren('type2', 'bar', 'type1')).to.have.members(['foo']);
    });

    it('overwrites relationships with subsequent sets', () => {
        graph
            .set('type1', 'foo').to('type2', 'bar')
            .set('type1', 'foos').to('type2', 'bar')
        ;

        expect(graph.getChildren('type1', 'foo', 'type2')).to.be.empty;
        expect(graph.getChildren('type1', 'foos', 'type2')).to.have.members(['bar']);

        graph
            .set('type1', 'foo', 'foos').to('type2', 'bar')
            .set('type1', 'foo', 'foos').to('type2', 'baz', 'bazz')
        ;

        expect(graph.getChildren('type1', 'foo', 'type2')).to.have.members(['baz', 'bazz']);
        expect(graph.getChildren('type1', 'foos', 'type2')).to.have.members(['baz', 'bazz']);
    });

    it('can append relationships', () => {
        graph
            .append('type2', 'bar').to('type1', 'foo')
            .append('type2', 'baz').to('type1', 'foo')
            .append('type1', 'foos').to('type2', 'baz');

        expect(graph.getChildren('type1', 'foo', 'type2')).to.have.members(['bar', 'baz']);
        expect(graph.getChildren('type1', 'foos', 'type2')).to.have.members(['baz']);
        expect(graph.getChildren('type2', 'bar', 'type1')).to.have.members(['foo']);
        expect(graph.getChildren('type2', 'baz', 'type1')).to.have.members(['foo', 'foos']);
    });

    it('can remove a relationship', () => {
        graph
            .appendTo('type1', 'foo', 'type2', 'bar')
            .appendTo('type1', 'foo', 'type2', 'baz')
            .appendTo('type1', 'foo', 'type2', 'bazz')
            .removeFrom('type1', 'foo', 'type2', 'baz');

        expect(graph.getChildren('type1', 'foo', 'type2')).to.have.members(['bar', 'bazz']);
        expect(graph.getChildren('type2', 'bar', 'type1')).to.have.members(['foo']);
        expect(graph.getChildren('type2', 'baz', 'type1')).to.be.empty;
    });

    it('can remove all relationships using a specific a key', () => {
        graph
            .appendTo('type1', 'foo', 'type2', 'bar')
            .appendTo('type1', 'foo', 'type2', 'baz')
            .appendTo('type2', 'foos', 'type1', 'foo')
            .appendTo('type2', 'foosz', 'type1', 'foos')
            .removeUsage('type1', 'foo');

        expect(graph.getChildren('type1', 'foo', 'type2')).to.be.empty;
        expect(graph.getChildren('type2', 'foos', 'type1')).to.be.empty;

        expect(graph.getChildren('type1', 'foos', 'type2')).to.be.have.members(['foosz']);
        expect(graph.getChildren('type2', 'foosz', 'type1')).to.have.members(['foos']);
    });

    it('can remove all relationships between two node types', () => {
        schemas = [
            Schema.define('type1').hasAndBelongsToMany('type2'),
            Schema.define('type2').hasAndBelongsToMany('type1'),

            Schema.define('type3').hasAndBelongsToMany('type4'),
            Schema.define('type4').hasAndBelongsToMany('type3')
        ];

        graph = new Graph(schemas);

        graph
            .appendTo('type1', 'foo', 'type2', 'bar')
            .appendTo('type1', 'foo', 'type2', 'baz')
            .appendTo('type3', 'foo', 'type4', 'bar')
            .appendTo('type3', 'foo', 'type4', 'baz')
            .removeAllBetween('type2', 'type1')
        ;

        expect(graph.getChildren('type1', 'foo', 'type2')).to.be.empty;
        expect(graph.getChildren('type3', 'foo', 'type4')).to.have.members(['bar', 'baz']);
    });

    it('can set multiple relationships', () => {
        graph.set('type1', 'foo', 'foo2').to('type2', 'bar', 'baz');

        expect(graph.getChildren('type1', 'foo', 'type2')).to.have.members(['bar', 'baz']);
        expect(graph.getChildren('type1', 'foo2', 'type2')).to.have.members(['bar', 'baz']);
        expect(graph.getChildren('type2', 'bar', 'type1')).to.have.members(['foo', 'foo2']);
        expect(graph.getChildren('type2', 'baz', 'type1')).to.have.members(['foo', 'foo2']);
    });

    it('can append multiple relationships', () => {
        graph
            .set('type1', 'foo', 'foo2').to('type2', 'bar', 'baz')
            .append('type1', 'foo', 'foo3').to('type2', 'baz', 'barz')
        ;

        expect(graph.getChildren('type1', 'foo', 'type2')).to.have.members(['bar', 'baz', 'barz']);
        expect(graph.getChildren('type1', 'foo2', 'type2')).to.have.members(['bar', 'baz']);
        expect(graph.getChildren('type1', 'foo3', 'type2')).to.have.members(['baz', 'barz']);
        expect(graph.getChildren('type2', 'bar', 'type1')).to.have.members(['foo', 'foo2']);
        expect(graph.getChildren('type2', 'baz', 'type1')).to.have.members(['foo', 'foo2', 'foo3']);
        expect(graph.getChildren('type2', 'barz', 'type1')).to.have.members(['foo', 'foo3']);
    });

    it('can remove multiple relationships', () => {
        graph
            .set('type1', 'foo', 'foo2', 'foo3').to('type2', 'bar', 'baz', 'barz')
            .remove('type1', 'foo', 'foo3').from('type2', 'baz', 'barz')
        ;

        expect(graph.getChildren('type1', 'foo', 'type2')).to.have.members(['bar']);
        expect(graph.getChildren('type1', 'foo2', 'type2')).to.have.members(['bar', 'baz', 'barz']);
        expect(graph.getChildren('type1', 'foo3', 'type2')).to.have.members(['bar']);
        expect(graph.getChildren('type2', 'bar', 'type1')).to.have.members(['foo', 'foo2', 'foo3']);
        expect(graph.getChildren('type2', 'baz', 'type1')).to.have.members(['foo2']);
        expect(graph.getChildren('type2', 'barz', 'type1')).to.have.members(['foo2']);
    });

    it('creates a new graph with merged relationships', () => {
        graph
            .append('type1', 'apple').to('type2', 'square', 'circle')
            .append('type1', 'orange').to('type2', 'circle', 'triangle')
        ;

        let graph2 = new Graph(schemas);

        graph2
            .append('type1', 'apple', 'orange').to('type2', 'square', 'rectangle', 'heart')
            .append('type1', 'peach').to('type2', 'circle', 'diamond')
        ;

        let mergedGraph = Graph.merge(graph, graph2);

        expect(mergedGraph.getChildren('type1', 'apple', 'type2'))
            .to.have.members(['square', 'circle', 'rectangle', 'heart']);

        expect(mergedGraph.getChildren('type1', 'orange', 'type2'))
            .to.have.members(['circle', 'triangle', 'square', 'rectangle', 'heart']);

        expect(mergedGraph.getChildren('type1', 'peach', 'type2'))
            .to.have.members(['circle', 'diamond']);
    });
});
