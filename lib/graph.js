import {
    HasOneRelationship,
    HasManyRelationship,
    BelongsToRelationship,
    HasAndBelongsToManyRelationship
} from './relationships';

import Bimap from './bimap';

/**
 * Stores relationships between different types of nodes. It requires an
 * `array` of `Schema`s to enforce the validity of relationships and govern how it
 * stores and looks up those relationships.
 */
export default class Graph {
    constructor(schemas) {
        this._graph = {};

        this._schemas = schemas;
        this._schemaMap = {};

        for (let schema of schemas) {
            this._schemaMap[schema.forType] = schema;
        }

        this._createGraphRelationships();
    }

    /**
     * Get the original array of `Schema`s that were passed into the constructor.
     *
     * This is enforced read-only because changing the `Schema`s invalidates the
     * internal structure of the `Graph` and its relationships. Instead, a new
     * `Graph` should be created.
     *
     * @returns {array} `Schema`s passed into the constructor.
     */
    get schemas() {
        return this._schemas;
    }

    /**
     * Set a node's relationship to another node.
     *
     * @param toNodeType Type of node.
     * @param toKey Key of the node.
     * @param fromNodeType Other type of node.
     * @param fromKey Key of the other node.
     * @returns {Graph}
     */
    setTo(toNodeType, toKey, fromNodeType, fromKey) {
        const toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);
        const fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);

        if (!this._isOneToOneRelationship(fromToRelationship, toFromRelationship)
            && !this._isOneToManyRelationship(fromToRelationship, toFromRelationship)
            && !this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {

            throw new Error(
                `Unknown relationship`
                + ` from ${fromNodeType} with "${fromToRelationship}"`
                + ` to ${toNodeType} with "${toFromRelationship}"`
            );
        }

        this._setRelationship(fromNodeType, fromKey, toNodeType, toKey);

        return this;
    }

    /**
     * Convenience method for {Graph#setTo}. Use it as:
     *
     * ```
     * set(nodeType, nodeKey).to(nodeType, nodeKey)
     * ```
     */
    set(fromNodeType, fromKey) {
        return {
            to: (toNodeType, toKey) => this.setTo(fromNodeType, fromKey, toNodeType, toKey)
        }
    }

    /**
     * Append a relationship between nodes. This only works for nodes that have a
     * relationship of one-to-many or many-to-many, otherwise it works the same as
     * {Graph#setTo}.
     *
     * @param toNodeType Type of node.
     * @param toKey Key of the node.
     * @param fromNodeType Other type of node.
     * @param fromKey Key of the other node.
     * @returns {Graph}
     */
    appendTo(toNodeType, toKey, fromNodeType, fromKey) {
        const toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);
        const fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);

        if (this._isOneToOneRelationship(fromToRelationship, toFromRelationship)) {
            this._setRelationship(fromNodeType, fromKey, toNodeType, toKey);

        } else if (this._isOneToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._appendOneToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);

        } else if (this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._appendManyToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);

        } else {
            throw new Error(
                `Unknown relationship`
                + ` from ${fromNodeType} with "${fromToRelationship}"`
                + ` to ${toNodeType} with "${toFromRelationship}"`
            );
        }

        return this;
    }

    /**
     * Convenience method for {Graph#appendTo}. Use it as:
     *
     * ```
     * append(nodeType, nodeKey).to(nodeType, nodeKey)
     * ```
     */
    append(fromNodeType, fromKey) {
        return {
            to: (toNodeType, toKey) => this.appendTo(toNodeType, toKey, fromNodeType, fromKey)
        }
    }

    /**
     * Removes a relationship between two nodes.
     *
     * @param fromNodeType Type of node.
     * @param fromKey Key of the node.
     * @param ofNodeType Other type of node.
     * @param ofKey Key of the other node.
     * @returns {Graph}
     */
    removeFrom(fromNodeType, fromKey, ofNodeType, ofKey) {
        const fromToRelationship = this._lookupRelationship(fromNodeType, ofNodeType);
        const toFromRelationship = this._lookupRelationship(ofNodeType, fromNodeType);

        if (!this._isOneToOneRelationship(fromToRelationship, toFromRelationship)
            && !this._isOneToManyRelationship(fromToRelationship, toFromRelationship)
            && !this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {

            throw new Error(
                `Unknown relationship`
                + ` from ${fromNodeType} with "${fromToRelationship}"`
                + ` to ${toNodeType} with "${toFromRelationship}"`
            );
        }

        this._removeRelationship(fromNodeType, fromKey, ofNodeType, ofKey);

        return this;
    }

    /**
     * Convenience method for {Graph#removeFrom}. Use it as:
     *
     * ```
     * remove(nodeType, nodeKey).from(nodeType, nodeKey)
     * ```
     */
    remove(ofNodeType, ofKey) {
        return {
            from: (fromNodeType, fromKey) => this.removeFrom(fromNodeType, fromKey, ofNodeType, ofKey)
        }
    }

    /**
     * Removes all relationships with a particular node. This is useful, for example,
     * if the node no longer exists.
     *
     * @param ofNodeType Type of node.
     * @param ofKey Key of the node to disconnect from other nodes.
     */
    removeUsage(ofNodeType, ofKey) {
        Object.keys(this._graph).forEach(keyNodeType => {
            Object.keys(this._graph[keyNodeType]).forEach(valueNodeType => {
                let relationships = this._graph[keyNodeType][valueNodeType];

                if (keyNodeType === ofNodeType) {
                    relationships.removeKey(ofKey);
                } else if (valueNodeType === ofNodeType) {
                    relationships.removeValue(ofKey);
                }
            });
        });
    }

    /**
     * Get the child's key of a has-one parent node.
     *
     * @param parentType Type of node for the parent node.
     * @param parentKey Key of the parent node.
     * @param childType Type of node for the child node.
     * @returns {*} Key of the child node.
     */
    getChild(parentType, parentKey, childType) {
        const relationship = this._lookupRelationship(parentType, childType);

        if (!(relationship instanceof HasOneRelationship)) {
            throw new Error(
                `${parentType} to ${childType} relationship is a not Has One relationship.`
                + ` It is defined as: ${relationship}`
            );
        }

        return this._getGraphValue(parentType, childType, parentKey);
    }

    /**
     * Get the parent's key of a belongs-to child node.
     *
     * @param childType Type of node for the child node.
     * @param childKey Key of the child node.
     * @param parentType Type of node for the parent node.
     * @returns {*} Key of the parent node.
     */
    getParent(childType, childKey, parentType) {
        const relationship = this._lookupRelationship(parentType, childType);

        if (!(relationship instanceof HasOneRelationship)
            && !(relationship instanceof HasManyRelationship)) {

            throw new Error(
                `${parentType} to ${childType} relationship is not a Has One or Has Many relationship.`
                + ` It is defined as: ${relationship}`
            );
        }

        return this._getGraphValue(childType, parentType, childKey);
    }

    /**
     * Get an `array` of all the child node keys for a has-many or
     * has-and-belongs-to-many parent node.
     *
     * @param parentType Type of node for the parent node.
     * @param parentKey Key of the parent node.
     * @param childType Type of node for the child nodes.
     * @returns {array} All child node keys associated with the parent node.
     */
    getChildren(parentType, parentKey, childType) {
        const relationship = this._lookupRelationship(parentType, childType);

        if (!(relationship instanceof HasManyRelationship)
            && !(relationship instanceof HasAndBelongsToManyRelationship)) {
            throw new Error(
                `${parentType} to ${childType} relationship is a not Has One`
                + ` or Has and Belongs to Many relationship.`
                + ` It is defined as: ${relationship}`
            );
        }

        return this._getGraphValues(parentType, childType, parentKey);
    }

    _lookupRelationship(fromNodeType, toNodeType) {
        const schema = this._schemaMap[fromNodeType];

        if (!schema) {
            throw new Error(`Schema was not defined for ${fromNodeType}`)
        }

        const relationship = schema.relationships[toNodeType];

        if (!relationship) {
            throw new Error(`No relationship defined from ${fromNodeType} to ${toNodeType}`)
        }

        return relationship;
    }

    _isOneToOneRelationship(relationship1, relationship2) {
        return (
            (
                relationship1 instanceof HasOneRelationship
                && relationship2 instanceof BelongsToRelationship
            )
            || (
                relationship2 instanceof HasOneRelationship
                && relationship1 instanceof BelongsToRelationship
            )
        );
    }

    _isOneToManyRelationship(relationship1, relationship2) {
        return (
            (
                relationship1 instanceof HasManyRelationship
                && relationship2 instanceof BelongsToRelationship
            )
            || (
                relationship2 instanceof HasManyRelationship
                && relationship1 instanceof BelongsToRelationship
            )
        );
    }

    _isManyToManyRelationship(relationship1, relationship2) {
        return (
            relationship1 instanceof HasAndBelongsToManyRelationship
            && relationship2 instanceof HasAndBelongsToManyRelationship
        );
    }

    _setRelationship(fromType, fromKey, toType, toKey) {
        if (fromType > toType) {
            let graph = this._graph[fromType][toType];
            graph.set(fromKey, toKey);
        } else {
            let graph = this._graph[toType][fromType];
            graph.set(toKey, fromKey);
        }
    }

    _removeRelationship(toType, toKey, fromType, fromKey) {
        if (fromType > toType) {
            let graph = this._graph[fromType][toType];
            graph.remove(fromKey, toKey);
        } else {
            let graph = this._graph[toType][fromType];
            graph.remove(toKey, fromKey);
        }
    }

    _appendOneToManyRelationship(toType, toKey, fromType, fromKey) {
        if (fromType > toType) {
            let graph = this._graph[fromType][toType];
            graph.appendValueToKey(fromKey, toKey);
        } else {
            let graph = this._graph[toType][fromType];
            graph.appendKeyToValue(fromKey, toKey);
        }
    }

    _appendManyToManyRelationship(toType, toKey, fromType, fromKey) {
        if (fromType > toType) {
            let graph = this._graph[fromType][toType];
            graph.append(fromKey, toKey);
        } else {
            let graph = this._graph[toType][fromType];
            graph.append(toKey, fromKey);
        }
    }

    _createGraphRelationships() {
        for (let schema of this._schemas) {
            let fromType = schema.forType;
            let toTypes = Object.keys(schema.relationships);

            for (let toType of toTypes) {
                if (this._graph[fromType] && this._graph[fromType][toType]) {
                    continue; // Bimap already created
                }

                let bimap = new Bimap();

                if (fromType > toType) {
                    this._mergeGraph(fromType, {[toType]: bimap});
                } else {
                    this._mergeGraph(toType, {[fromType]: bimap});
                }
            }
        }
    }

    _mergeGraph(forType, object) {
        if (this._graph[forType]) {
            Object.assign(this._graph[forType], object);
        } else {
            this._graph[forType] = object;
        }
    }

    _getGraphFor(fromType, toType) {
        if (fromType > toType) {
            return this._graph[fromType][toType];
        } else {
            return this._graph[toType][fromType];
        }
    }

    _getGraphValues(fromType, toType, fromKey) {
        const relationships = this._getGraphFor(fromType, toType);

        const values = fromType > toType ?
            relationships.getKeyValues(fromKey) : relationships.getValueKeys(fromKey);

        return values ? Array.from(values) : [];
    }

    _getGraphValue(fromType, toType, fromKey) {
        const relationships = this._getGraphFor(fromType, toType);

        const values = fromType > toType ?
            relationships.getKeyValues(fromKey) : relationships.getValueKeys(fromKey);

        if (!values) {
            return undefined;
        }

        let [value] = values;
        return value;
    }
}