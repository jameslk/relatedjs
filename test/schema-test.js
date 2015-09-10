import {expect} from 'chai';
import sinon from 'sinon';

import {
    Schema,
    HasOneRelationship,
    HasManyRelationship,
    BelongsToRelationship,
    HasAndBelongsToManyRelationship
} from '../lib';

describe('Schema', () => {
    let schema;

    beforeEach(() => {
        schema = Schema.define('foo');
    });

    it('can define a schema for a type', () => {
        expect(schema.forType).to.equal('foo');
    });

    it('can create a has-one relationship', () => {
        schema.hasOne('bar');
        expectRelationToBe(HasOneRelationship);
    });

    it('can create a has-many relationship', () => {
        schema.hasMany('bar');
        expectRelationToBe(HasManyRelationship);
    });

    it('can create a belongs-to-parent relationship', () => {
        schema.belongsTo('bar');
        expectRelationToBe(BelongsToRelationship);
    });

    it('can create a many-to-many relationship', () => {
        schema.hasAndBelongsToMany('bar');
        expectRelationToBe(HasAndBelongsToManyRelationship);
    });

    function expectRelationToBe(relationshipClass) {
        const relationship = schema.relationships.bar;

        expect(relationship).to.be.an.instanceof(relationshipClass);
        expect(relationship.from).to.equal('foo');
        expect(relationship.to).to.equal('bar');
    }
});