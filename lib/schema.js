import {
    HasOneRelationship,
    HasManyRelationship,
    BelongsToRelationship,
    HasAndBelongsToManyRelationship
} from './relationships';

export default class Schema {
    constructor(forType) {
        this.forType = forType;
        this.finder = this._createSimpleFinder();
        this.relationships = {};
    }

    static define(itemType) {
        return new this(itemType);
    }

    findBy(finder) {
        this.finder = finder;
    }

    hasOne(childType) {
        this.relationships[childType] = new HasOneRelationship(
            this.forType,
            childType
        );

        return this;
    }

    hasMany(childType) {
        this.relationships[childType] = new HasManyRelationship(
            this.forType,
            childType
        );

        return this;
    }

    belongsTo(parentType) {
        this.relationships[parentType] = new BelongsToRelationship(
            this.forType,
            parentType
        );

        return this;
    }

    hasAndBelongsToMany(childType) {
        this.relationships[childType] = new HasAndBelongsToManyRelationship(
            this.forType,
            childType
        );

        return this;
    }

    _createSimpleFinder() {
        return (collection, key) => collection[key];
    }
}