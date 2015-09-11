import {
    HasOneRelationship,
    HasManyRelationship,
    BelongsToRelationship,
    HasAndBelongsToManyRelationship
} from './relationships';

import Bimap from './bimap';

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

    get schemas() {
        return this._schemas;
    }

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

    set(fromNodeType, fromKey) {
        return {
            to: (toNodeType, toKey) => this.setTo(fromNodeType, fromKey, toNodeType, toKey)
        }
    }

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

    append(fromNodeType, fromKey) {
        return {
            to: (toNodeType, toKey) => this.appendTo(toNodeType, toKey, fromNodeType, fromKey)
        }
    }

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

    removeUsage(ofNodeType, ofKey) {
    }

    remove(ofNodeType, ofKey) {
        return {
            from: (fromNodeType, fromKey) => this.removeFrom(fromNodeType, fromKey, ofNodeType, ofKey)
        }
    }

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
            graph.appendKeyToValue(toKey, fromKey);
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