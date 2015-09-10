import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Relations} from '../../lib';

describe('Relations with mixed relationships', () => {
    let schemas;
    let relations;

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

        relations = new Relations(schemas);
    });

    it('can set relationships', () => {
        relations
            .set('child', 'bar').to('parentWithChild', 'foo')
            .set('child', 'baz').to('parentWithChild', 'foo')
            .set('child', 'bar').to('parentWithChildren', 'foos')
            .set('child', 'baz').to('parentWithChildren', 'foos');

        //expect(relations.getParent('child', 'bar', 'parentWithChild')).to.equal('foo');
        //expect(relations.getChild('parentWithChild', 'foo', 'child')).to.equal('bar');
        //
        //expect(relations.getParent('child', 'bar', 'parentWithChildren')).to.equal('foos');
        //expect(relations.getChildren('parentWithChildren', 'foos', 'child')).to.have.members(['bar']);
    });

    //it('can remove a relationship', () => {
    //});

    //it('can remove all relationships using a specific a key', () => {
    //});
});
