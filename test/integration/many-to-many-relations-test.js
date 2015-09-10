import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Relations} from '../../lib';

describe('Relations with many to many relationships', () => {
    let schemas;
    let relations;

    beforeEach(() => {
        schemas = [
            Schema.define('type1').hasAndBelongsToMany('type2'),
            Schema.define('type2').hasAndBelongsToMany('type1')
        ];

        relations = new Relations(schemas);
    });

    it('provides an empty array for no children relationships', () => {
        expect(relations.getChildren('type1', 'foo', 'type2')).to.be.an('array');
        expect(relations.getChildren('type1', 'foo', 'type2')).to.be.empty;

        expect(relations.getChildren('type2', 'foo', 'type1')).to.be.an('array');
        expect(relations.getChildren('type2', 'foo', 'type1')).to.be.empty;
    });

    it('can set a relationship', () => {
        relations.set('type2', 'bar').to('type1', 'foo');

        expect(relations.getChildren('type1', 'foo', 'type2')).to.have.members(['bar']);
        expect(relations.getChildren('type2', 'bar', 'type1')).to.have.members(['foo']);
    });

    it('appends the relationship with subsequent sets', () => {
        relations
            .set('type2', 'bar').to('type1', 'foo')
            .set('type2', 'baz').to('type1', 'foo')
            .set('type1', 'foos').to('type2', 'baz');

        expect(relations.getChildren('type1', 'foo', 'type2')).to.have.members(['bar', 'baz']);
        expect(relations.getChildren('type1', 'foos', 'type2')).to.have.members(['baz']);
        expect(relations.getChildren('type2', 'bar', 'type1')).to.have.members(['foo']);
        expect(relations.getChildren('type2', 'baz', 'type1')).to.have.members(['foo', 'foos']);
    });

    //it('can remove a relationship', () => {
    //});
});
