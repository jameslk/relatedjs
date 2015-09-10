import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Graph} from '../../lib';

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

    it('appends the relationship with subsequent sets', () => {
        graph
            .set('type2', 'bar').to('type1', 'foo')
            .set('type2', 'baz').to('type1', 'foo')
            .set('type1', 'foos').to('type2', 'baz');

        expect(graph.getChildren('type1', 'foo', 'type2')).to.have.members(['bar', 'baz']);
        expect(graph.getChildren('type1', 'foos', 'type2')).to.have.members(['baz']);
        expect(graph.getChildren('type2', 'bar', 'type1')).to.have.members(['foo']);
        expect(graph.getChildren('type2', 'baz', 'type1')).to.have.members(['foo', 'foos']);
    });

    //it('can remove a relationship', () => {
    //});
});
