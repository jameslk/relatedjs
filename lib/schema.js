import {
    HasOneRelationship,
    HasManyRelationship,
    BelongsToRelationship,
    HasAndBelongsToManyRelationship
} from './relationships';

/**
 * Defines a type of node's relationships with another node. A node is simply a unit
 * of data. For example, one node type might be a `car` and another is a `wheel`.
 * A `Schema` for `car` would specify it `hasMany` `wheels` and likewise, a `wheel`
 * `Schema` would specify it `belongsTo` a `car`.
 */
export default class Schema {
    constructor(forType) {
        this.forType = forType;
        this.relationships = {};
    }

    /**
     * Convenience method instead of using `new Schema`. Use it as:
     * ```
     * Schema.define(nodeType).[...]
     * ```
     *
     * @param nodeType
     */
    static define(nodeType) {
        return new this(nodeType);
    }

    /**
     * Specify that the node can have one child of `childType`.
     *
     * @param childType Type of child node.
     * @returns {Schema}
     */
    hasOne(childType) {
        this.relationships[childType] = new HasOneRelationship(
            this.forType,
            childType
        );

        return this;
    }

    /**
     * Specify that the node can have any number of child nodes of `childType`.
     *
     * @param childType Type of child nodes.
     * @returns {Schema}
     */
    hasMany(childType) {
        this.relationships[childType] = new HasManyRelationship(
            this.forType,
            childType
        );

        return this;
    }

    /**
     * Specify that the node can belong to a parent node of `parentType`.
     *
     * @param parentType Type of parent node.
     * @returns {Schema}
     */
    belongsTo(parentType) {
        this.relationships[parentType] = new BelongsToRelationship(
            this.forType,
            parentType
        );

        return this;
    }

    /**
     * Specify that the node can have many child nodes and also can belong to many
     * parent nodes of `childType`.
     *
     * @param childType Type of child/parent node.
     * @returns {Schema}
     */
    hasAndBelongsToMany(childType) {
        this.relationships[childType] = new HasAndBelongsToManyRelationship(
            this.forType,
            childType
        );

        return this;
    }

    /**
     * Determines whether `otherSchema` equals `this` schema.
     *
     * @param otherSchema
     */
    equals(otherSchema) {
        if (this === otherSchema) {
            return true;
        }

        if (!otherSchema) {
            return false;
        }

        if (this.forType !== otherSchema.forType) {
            return false;
        }

        const relatedNodeTypes = Object.keys(this.relationships);

        if (relatedNodeTypes.length !== Object.keys(otherSchema.relationships).length) {
            return false;
        }

        return relatedNodeTypes.every(nodeType => {
            if (!otherSchema.relationships.hasOwnProperty(nodeType)) {
                return false;
            }

            return this.relationships[nodeType].equals(otherSchema.relationships[nodeType]);
        });
    }
}