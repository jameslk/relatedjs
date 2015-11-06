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
            const nodeType = schema.forType;

            if (this._schemaMap.hasOwnProperty(nodeType)) {
                throw new Error(`Schema for node type ${nodeType} should only be`
                                    + ` defined once, but occurs multiple times`);
            }

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
     * @param fromNodeType Other type of node.
     * @param fromKey Key of the other node.
     * @param toNodeType Type of node.
     * @param toKey Key of the node.
     * @returns {Graph}
     */
    setTo(fromNodeType, fromKey, toNodeType, toKey) {
        const fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);
        const toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);

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
     * Set multiple relationships at once. This will overwrite existing associations
     * to the specified nodes.
     *
     * @param fromNodeType
     * @param {array} fromKeys
     * @param toNodeType
     * @param {array} toKeys
     * @returns {Graph}
     */
    setMultiple(fromNodeType, fromKeys, toNodeType, toKeys) {
        if (fromKeys.length === 1 && toKeys.length === 1) {
            return this.setTo(fromNodeType, fromKeys[0], toNodeType, toKeys[0]);
        }

        const fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);
        const toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);

        if (this._isOneToOneRelationship(fromToRelationship, toFromRelationship)) {
            for (let fromKey of fromKeys) {
                for (let toKey of toKeys) {
                    this._setRelationship(fromNodeType, fromKey, toNodeType, toKey);
                }
            }

        } else if (this._isOneToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._removeUsagesBetweenTypes(fromNodeType, fromKeys, toNodeType, toKeys);

            for (let fromKey of fromKeys) {
                for (let toKey of toKeys) {
                    this._appendOneToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);
                }
            }

        } else if (this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._removeUsagesBetweenTypes(fromNodeType, fromKeys, toNodeType, toKeys);

            for (let fromKey of fromKeys) {
                for (let toKey of toKeys) {
                    this._appendManyToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);
                }
            }

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
     * Convenience method for {Graph#setTo}. Use it as:
     *
     * ```
     * set(nodeType, nodeKey[, nodeKey2, ...]).to(nodeType, nodeKey[, nodeKey2, ...])
     * ```
     */
    set(fromNodeType, ...fromKeys) {
        return {
            to: (toNodeType, ...toKeys) => {
                return this.setMultiple(fromNodeType, fromKeys, toNodeType, toKeys);
            }
        }
    }

    /**
     * Append a relationship between nodes. This only works for nodes that have a
     * relationship of one-to-many or many-to-many, otherwise it works the same as
     * {Graph#setTo}.
     *
     * @param fromNodeType Other type of node.
     * @param fromKey Key of the other node.
     * @param toNodeType Type of node.
     * @param toKey Key of the node.
     * @returns {Graph}
     */
    appendTo(fromNodeType, fromKey, toNodeType, toKey) {
        const fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);
        const toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);

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
     * append(nodeType, nodeKey[, nodeKey2, ...]).to(nodeType, nodeKey[, nodeKey2, ...])
     * ```
     */
    append(fromNodeType, ...fromKeys) {
        return {
            to: (toNodeType, ...toKeys) => {
                for (let fromKey of fromKeys) {
                    for (let toKey of toKeys) {
                        this.appendTo(fromNodeType, fromKey, toNodeType, toKey);
                    }
                }

                return this;
            }
        }
    }

    /**
     * Removes a relationship between two nodes.
     *
     * @param ofNodeType Other type of node.
     * @param ofKey Key of the other node.
     * @param fromNodeType Type of node.
     * @param fromKey Key of the node.
     * @returns {Graph}
     */
    removeFrom(ofNodeType, ofKey, fromNodeType, fromKey) {
        const fromToRelationship = this._lookupRelationship(ofNodeType, fromNodeType);
        const toFromRelationship = this._lookupRelationship(fromNodeType, ofNodeType);

        if (!this._isOneToOneRelationship(fromToRelationship, toFromRelationship)
            && !this._isOneToManyRelationship(fromToRelationship, toFromRelationship)
            && !this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {

            throw new Error(
                `Unknown relationship`
                + ` from ${fromNodeType} with "${fromToRelationship}"`
                + ` to ${toNodeType} with "${toFromRelationship}"`
            );
        }

        this._removeRelationship(ofNodeType, ofKey, fromNodeType, fromKey);

        return this;
    }

    /**
     * Convenience method for {Graph#removeFrom}. Use it as:
     *
     * ```
     * remove(nodeType, nodeKey[, nodeKey2, ...]).from(nodeType, nodeKey[, nodeKey2, ...])
     * ```
     */
    remove(ofNodeType, ...ofKeys) {
        return {
            from: (fromNodeType, ...fromKeys) => {
                for (let ofKey of ofKeys) {
                    for (let fromKey of fromKeys) {
                        this.removeFrom(ofNodeType, ofKey, fromNodeType, fromKey);
                    }
                }

                return this;
            }
        }
    }

    /**
     * Removes all relationships between two node types.
     *
     * @param fromNodeType Type of node.
     * @param toNodeType Type of node.
     */
    removeAllBetween(fromNodeType, toNodeType) {
        if (this._isPrimaryType(fromNodeType, toNodeType)) {
            this._graph[fromNodeType][toNodeType] = new Bimap();
        } else {
            this._graph[toNodeType][fromNodeType] = new Bimap();
        }

        return this;
    }

    /**
     * Removes all relationships of the specified node type.
     *
     * @param nodeType Type of node.
     */
    removeAllOfType(nodeType) {
        if (!this._schemaMap.hasOwnProperty(nodeType)) {
            throw new Error(`No schema exists for nodeType: ${nodeType}`);
        }

        const toTypes = Object.keys(this._schemaMap[nodeType].relationships);

        for (let toType of toTypes) {
            this.removeAllBetween(nodeType, toType)
        }

        return this;
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

    /**
     * Determines whether `this` graph is compatible with `otherGraph`. They will
     * be compatible if `this` has matching schemas with `otherGraph`, even if
     * `otherGraph` has more schemas than `this`. That is, `this` schemas must be a
     * subset of `otherGraph` schemas.
     *
     * This is useful to check if the graphs will be merged together.
     *
     * @param {Graph} otherGraph
     * @returns {boolean}
     */
    canMergeWith(otherGraph) {
        if (!otherGraph || !(otherGraph instanceof this.constructor)) {
            return false;
        }

        return Object.keys(this._schemaMap).every(nodeType => {
            const schema = this._schemaMap[nodeType];
            const otherSchema = otherGraph._schemaMap[nodeType];

            return schema.equals(otherSchema);
        });
    }

    /**
     * Creates a new graph with the relationships of `graphA` merged with `graphB`.
     *
     * @param {Graph} graphA
     * @param {Graph} graphB
     * @returns {Graph}
     */
    static merge(graphA, graphB) {
        if (!graphA.canMergeWith(graphB)) {
            throw new Error(`Cannot merge graphs due to incompatibilities (most`
                            + ` likely due to incompatible schemas)`);
        }

        return this.mergeCompatibleGraphs(graphA, graphB);
    }

    /**
     * Creates a new graph with the relationships of `graphA` merged with `graphB`.
     * It works exactly the same as {Graph#merge} except it doesn't check whether
     * both graphs have compatible schemas. This can be a performance boost if you
     * already know the schemas are compatible.
     *
     * Note: Merging incompatible graphs here will result in relationship errors.
     *
     * @param {Graph} graphA
     * @param {Graph} graphB
     * @returns {Graph}
     */
    static mergeCompatibleGraphs(graphA, graphB) {
        let resultGraph = new this(graphA._schemas);

        Object.keys(graphA._graph).forEach(primaryType => {
            Object.keys(graphA._graph[primaryType]).forEach(secondaryType => {
                const primaryRelationshipType = graphA._lookupRelationship(primaryType, secondaryType);
                const secondaryRelationshipType = graphA._lookupRelationship(secondaryType, primaryType);

                const relationshipsA = graphA._graph[primaryType][secondaryType];
                const relationshipsB = graphB._graph[primaryType][secondaryType];
                let mergedRelationships;

                if (graphA._isOneToOneRelationship(primaryRelationshipType, secondaryRelationshipType)) {
                    mergedRelationships = Bimap.replace(
                        relationshipsA,
                        relationshipsB
                    );

                } else if (graphA._isOneToManyRelationship(primaryRelationshipType, secondaryRelationshipType)) {
                    const primaryTypeIsParent = primaryRelationshipType instanceof HasManyRelationship;

                    if (primaryTypeIsParent) {
                        mergedRelationships = Bimap.mergeKeysReplaceValues(
                            relationshipsA,
                            relationshipsB
                        );
                    } else {
                        mergedRelationships = Bimap.replaceKeysMergeValues(
                            relationshipsA,
                            relationshipsB
                        );
                    }

                } else if (graphA._isManyToManyRelationship(primaryRelationshipType, secondaryRelationshipType)) {
                    mergedRelationships = Bimap.merge(
                        relationshipsA,
                        relationshipsB
                    );

                } else {
                    throw new Error(
                        `Unknown relationship`
                        + ` from ${primaryType} with "${primaryRelationshipType}"`
                        + ` to ${secondaryType} with "${secondaryRelationshipType}"`
                    );
                }

                resultGraph._mergeGraph(primaryType, {
                    [secondaryType]: mergedRelationships
                });
            });
        });

        return resultGraph;
    }

    /**
     * Converts the current graph into a plain JavaScript array. This allows for
     * serialization, such as with JSON, for example. The result does not include
     * any information about schemas.
     */
    toSerializable() {
        let serializable = [];

        Object.keys(this._graph).forEach(primaryType => {
            Object.keys(this._graph[primaryType]).forEach(secondaryType => {
                if (!this._graph[primaryType][secondaryType]
                    || this._graph[primaryType][secondaryType].isEmpty()) {

                    return; // Skip empty relationships
                }

                serializable.push([
                    primaryType,
                    secondaryType,
                    ...this._graph[primaryType][secondaryType].toSerializable()
                ]);
            });
        });

        return serializable;
    }

    /**
     * Uses the given array to construct a graph. For better performance, this
     * method does not check the integrity of the result, such as whether it
     * is compatible with the schemas.
     *
     * Note: This will also overwrite any current graph data if any exists.
     *
     * @param {array} serializableArrayGraph An array of graph data output from `toSerializable()`.
     */
    fromSerializable(serializableArrayGraph) {
        this._graph = {};
        this._createGraphRelationships();

        for (let relationshipArray of serializableArrayGraph) {
            const [primaryType, secondaryType] = relationshipArray;

            this._graph[primaryType][secondaryType] = Bimap.fromSerializable(
                relationshipArray.slice(2)
            );
        }

        return this;
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

    /*
     * Determine the primary type, which will be used as the primary index or key
     * for the graph.
     */
    _isPrimaryType(type1, type2) {
        return type1 > type2;
    }

    _setRelationship(fromType, fromKey, toType, toKey) {
        if (this._isPrimaryType(fromType, toType)) {
            let graph = this._graph[fromType][toType];
            graph.set(fromKey, toKey);
        } else {
            let graph = this._graph[toType][fromType];
            graph.set(toKey, fromKey);
        }
    }

    _removeRelationship(fromType, fromKey, toType, toKey) {
        if (this._isPrimaryType(fromType, toType)) {
            let graph = this._graph[fromType][toType];
            graph.remove(fromKey, toKey);
        } else {
            let graph = this._graph[toType][fromType];
            graph.remove(toKey, fromKey);
        }
    }

    _removeUsagesBetweenTypes(fromType, fromKeys, toType, toKeys) {
        const fromIsPrimaryType = this._isPrimaryType(fromType, toType);

        let relationships, keys, values;

        if (fromIsPrimaryType) {
            relationships = this._graph[fromType][toType];
            keys = fromKeys;
            values = toKeys;
        } else {
            relationships = this._graph[toType][fromType];
            keys = toKeys;
            values = fromKeys;
        }

        for (let key of keys) {
            relationships.removeKey(key);

            for (let value of values) {
                relationships.removeValue(value);
            }
        }
    }

    _appendOneToManyRelationship(fromType, fromKey, toType, toKey) {
        const graph = this._getGraphFor(fromType, toType);
        const fromToRelationship = this._lookupRelationship(fromType, toType);

        const fromTypeIsKey = this._isPrimaryType(fromType, toType);
        const fromTypeIsParent = fromToRelationship instanceof HasManyRelationship;

        if (fromTypeIsKey) {
            if (fromTypeIsParent) {
                graph.appendValueToKey(fromKey, toKey);
            } else {
                graph.appendKeyToValue(fromKey, toKey);
            }
        } else {
            if (fromTypeIsParent) {
                graph.appendKeyToValue(toKey, fromKey);
            } else {
                graph.appendValueToKey(toKey, fromKey);
            }
        }
    }

    _appendManyToManyRelationship(fromType, fromKey, toType, toKey) {
        if (this._isPrimaryType(fromType, toType)) {
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

                if (this._isPrimaryType(fromType, toType)) {
                    this._mergeGraph(fromType, {[toType]: bimap});
                } else {
                    this._mergeGraph(toType, {[fromType]: bimap});
                }
            }
        }
    }

    _mergeGraph(forType, object) {
        if (this._graph.hasOwnProperty(forType)) {
            Object.assign(this._graph[forType], object);
        } else {
            this._graph[forType] = object;
        }
    }

    _getGraphFor(fromType, toType) {
        if (this._isPrimaryType(fromType, toType)) {
            return this._graph[fromType][toType];
        } else {
            return this._graph[toType][fromType];
        }
    }

    _getGraphValues(fromType, toType, fromKey) {
        const relationships = this._getGraphFor(fromType, toType);

        const values = this._isPrimaryType(fromType, toType) ?
            relationships.getKeyValues(fromKey) : relationships.getValueKeys(fromKey);

        return values ? Array.from(values) : [];
    }

    _getGraphValue(fromType, toType, fromKey) {
        const relationships = this._getGraphFor(fromType, toType);

        const values = this._isPrimaryType(fromType,  toType) ?
            relationships.getKeyValues(fromKey) : relationships.getValueKeys(fromKey);

        if (!values) {
            return undefined;
        }

        let [value] = values;
        return value;
    }
}