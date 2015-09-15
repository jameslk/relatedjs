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

    it('can check whether schemas are equal', () => {
        schema.hasMany('bar');
        schema.belongsTo('baz');

        let otherSchema = Schema.define('foo').hasMany('bar').belongsTo('baz');

        expect(schema.equals(otherSchema)).to.be.true;

        otherSchema = Schema.define('foo');

        expect(schema.equals(otherSchema)).to.be.false;

        otherSchema = Schema.define('foo').hasOne('bar').belongsTo('baz');

        expect(schema.equals(otherSchema)).to.be.false;

        otherSchema = Schema.define('foooooo').hasMany('bar').belongsTo('baz');

        expect(schema.equals(otherSchema)).to.be.false;

        otherSchema = Schema.define('foo').hasMany('baz').belongsTo('bar');

        expect(schema.equals(otherSchema)).to.be.false;
    });

    function expectRelationToBe(relationshipClass) {
        const relationship = schema.relationships.bar;

        expect(relationship).to.be.an.instanceof(relationshipClass);
        expect(relationship.from).to.equal('foo');
        expect(relationship.to).to.equal('bar');
    }
});