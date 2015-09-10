import {
    HasOneRelationship,
    HasManyRelationship,
    BelongsToRelationship,
    HasAndBelongsToManyRelationship
} from './relationships';

export default class Graph {
    constructor(schemas) {
        this._graph = {};

        this._schemas = schemas;
        this._schemaMap = {};

        for (let schema of schemas) {
            this._schemaMap[schema.forType] = schema;
        }
    }

    get schemas() {
        return this._schemas;
    }

    setTo(toNodeType, toKey, fromNodeType, fromKey) {
        const fromToRelationship = this._lookupRelationship(fromNodeType, toNodeType);
        const toFromRelationship = this._lookupRelationship(toNodeType, fromNodeType);

        if (this._isOneToOneRelationship(fromToRelationship, toFromRelationship)) {
            this._setOneToOneRelationship(toNodeType, toKey, fromNodeType, fromKey);
        } else if (this._isOneToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._setOneToManyRelationship(fromNodeType, fromKey, toNodeType, toKey);
        } else if (this._isOneToManyRelationship(toFromRelationship, fromToRelationship)) {
            this._setOneToManyRelationship(toNodeType, toKey, fromNodeType, fromKey);
        } else if (this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._setManyToManyRelationship(toNodeType, toKey, fromNodeType, fromKey);
        } else {
            throw new Error(
                `Unknown relationship`
                + ` from ${fromNodeType} with "${fromToRelationship}"`
                + ` to ${toNodeType} with "${toFromRelationship}"`
            );
        }

        return this;
    }

    set(fromNodeType, fromKey) {
        return {
            to: (toNodeType, toKey) => this.setTo(fromNodeType, fromKey, toNodeType, toKey)
        }
    }

    removeFrom(fromNodeType, fromKey, ofNodeType, ofKey) {
        const fromToRelationship = this._lookupRelationship(fromNodeType, ofNodeType);
        const toFromRelationship = this._lookupRelationship(ofNodeType, fromNodeType);

        if (this._isOneToOneRelationship(fromToRelationship, toFromRelationship)) {
            this._removeOneToOneRelationship(ofNodeType, ofKey, fromNodeType, fromKey);
        } else if (this._isOneToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._removeOneToManyRelationship(fromNodeType, fromKey, ofNodeType, ofKey);
        } else if (this._isOneToManyRelationship(toFromRelationship, fromToRelationship)) {
            this._removeOneToManyRelationship(ofNodeType, ofKey, fromNodeType, fromKey);
        } else if (this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._removeManyToManyRelationship(ofNodeType, ofKey, fromNodeType, fromKey);
        } else {
            throw new Error(
                `Unknown relationship`
                + ` from ${fromNodeType} with "${fromToRelationship}"`
                + ` to ${ofNodeType} with "${toFromRelationship}"`
            );
        }

        return this;
    }

    removeUsage(ofNodeType, ofKey) {
    }

    remove(ofNodeType, ofKey) {
        return {
            from: (fromNodeType, fromKey) => this.removeFrom(fromNodeType, fromKey, ofNodeType, ofKey)
        }
    }

    getChild(fromType, fromKey, ofType) {
        return this._graphAtPath(fromType, fromKey, ofType);
    }

    getParent(fromType, fromKey, ofType) {
        return this._graphAtPath(fromType, fromKey, ofType);
    }

    getChildren(fromType, fromKey, ofType) {
        const childrenMap = this._graphAtPath(fromType, fromKey, ofType);

        if (!childrenMap) {
            return [];
        }

        return Object.keys(childrenMap);
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

    _isOneToManyRelationship(parentRelationship, childRelationship) {
        return (
            parentRelationship instanceof HasManyRelationship
            && childRelationship instanceof BelongsToRelationship
        );
    }

    _isManyToManyRelationship(relationship1, relationship2) {
        return (
            relationship1 instanceof HasAndBelongsToManyRelationship
            && relationship2 instanceof HasAndBelongsToManyRelationship
        );
    }

    _setOneToOneRelationship(toType, toKey, fromType, fromKey) {
        const parent = this.getParent(toType, toKey, fromType);
        const child = this.getChild(fromType, fromKey, toType);


        //console.log(`parent (${toType}.${toKey}.${fromType}):`, parent, `child (${fromType}.${fromKey}.${toType}):`, child)

        this._removeOneToOneRelationship(toType, child, fromType, parent);

        this._setLink(toType, toKey, fromType, fromKey);
        this._setLink(fromType, fromKey, toType, toKey);
    }

    _removeOneToOneRelationship(toType, toKey, fromType, fromKey) {
        this._removeLink(toType, toKey, fromType);
        this._removeLink(fromType, fromKey, toType);
    }

    _setOneToManyRelationship(parentType, parentKey, childType, childKey) {
        //console.log(this._graph)
        this._setLink(childType, childKey, parentType, parentKey);
        this._appendChildLink(parentType, parentKey, childType, childKey);
    }

    _removeOneToManyRelationship(parentType, parentKey, childType, childKey) {
        this._removeLink(childType, childKey, parentType);
        this._removeChildLink(parentType, parentKey, childType, childKey);
    }

    _setManyToManyRelationship(toType, toKey, fromType, fromKey) {
        this._appendChildLink(toType, toKey, fromType, fromKey);
        this._appendChildLink(fromType, fromKey, toType, toKey);
    }

    _setLink(toType, toKey, fromType, fromKey) {
        this._mergeGraphAtPath(
            [toType, toKey],
            {[fromType]: fromKey}
        );
    }

    _removeLink(toType, toKey, fromType) {
        let relation = this._graphAtPath(toType, toKey);

        if (!relation) {
            //console.log(`Path doesnt exist ${toType}.${toKey}.${fromType}:`
            //    + ` ${toType} is`, this._graphAtPath(toType), `,`
            //    + ` ${toKey} is `, this._graphAtPath(toType, toKey), `,`
            //    + ` ${fromType} is `, this._graphAtPath(toType, toKey, fromType)
            //)
            return;
        }

        //console.log(`Deleting ${toType}.${toKey}.${fromType}`)
        delete relation[fromType]
    }

    _appendChildLink(parentType, parentKey, childType, childKey) {
        this._mergeGraphAtPath(
            [parentType, parentKey, childType],
            {[childKey]: childKey}
        );
    }

    _removeChildLink(parentType, parentKey, childType, childKey) {
        let relation = this._graphAtPath(parentType, parentKey, childType);

        if (!relation) {
            return;
        }

        delete relation[childKey]
    }

    _graphAtPath(...path) {
        let scoped = this._graph;

        for (let step of path) {
            if (!scoped.hasOwnProperty(step)) {
                return null;
            }

            scoped = scoped[step];
        }

        return scoped;
    }

    _mergeGraphAtPath(path, object) {
        let scoped = this._graph;

        for (let step of path) {
            if (!scoped.hasOwnProperty(step)) {
                scoped[step] = {};
            }

            scoped = scoped[step];
        }

        return Object.assign(scoped, object);
    }
}