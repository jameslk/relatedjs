import {
    HasOneRelationship,
    HasManyRelationship,
    BelongsToRelationship,
    HasAndBelongsToManyRelationship
} from './relationships';

export default class Relations {
    constructor(schemas) {
        this._relations = {};

        this._schemas = schemas;
        this._schemaMap = {};

        for (let schema of schemas) {
            this._schemaMap[schema.forType] = schema;
        }
    }

    get schemas() {
        return this._schemas;
    }

    setTo(toItemType, toKey, fromItemType, fromKey) {
        const fromToRelationship = this._lookupRelationship(fromItemType, toItemType);
        const toFromRelationship = this._lookupRelationship(toItemType, fromItemType);

        if (this._isOneToOneRelationship(fromToRelationship, toFromRelationship)) {
            this._setOneToOneRelationship(toItemType, toKey, fromItemType, fromKey);
        } else if (this._isOneToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._setOneToManyRelationship(fromItemType, fromKey, toItemType, toKey);
        } else if (this._isOneToManyRelationship(toFromRelationship, fromToRelationship)) {
            this._setOneToManyRelationship(toItemType, toKey, fromItemType, fromKey);
        } else if (this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._setManyToManyRelationship(toItemType, toKey, fromItemType, fromKey);
        } else {
            throw new Error(
                `Unknown relationship`
                + ` from ${fromItemType} with "${fromToRelationship}"`
                + ` to ${toItemType} with "${toFromRelationship}"`
            );
        }

        return this;
    }

    set(fromItemType, fromKey) {
        return {
            to: (toItemType, toKey) => this.setTo(fromItemType, fromKey, toItemType, toKey)
        }
    }

    removeFrom(fromItemType, fromKey, ofItemType, ofKey) {
        const fromToRelationship = this._lookupRelationship(fromItemType, ofItemType);
        const toFromRelationship = this._lookupRelationship(ofItemType, fromItemType);

        if (this._isOneToOneRelationship(fromToRelationship, toFromRelationship)) {
            this._removeOneToOneRelationship(ofItemType, ofKey, fromItemType, fromKey);
        } else if (this._isOneToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._removeOneToManyRelationship(fromItemType, fromKey, ofItemType, ofKey);
        } else if (this._isOneToManyRelationship(toFromRelationship, fromToRelationship)) {
            this._removeOneToManyRelationship(ofItemType, ofKey, fromItemType, fromKey);
        } else if (this._isManyToManyRelationship(fromToRelationship, toFromRelationship)) {
            this._removeManyToManyRelationship(ofItemType, ofKey, fromItemType, fromKey);
        } else {
            throw new Error(
                `Unknown relationship`
                + ` from ${fromItemType} with "${fromToRelationship}"`
                + ` to ${ofItemType} with "${toFromRelationship}"`
            );
        }

        return this;
    }

    removeUsage(ofItemType, ofKey) {
    }

    remove(ofItemType, ofKey) {
        return {
            from: (fromItemType, fromKey) => this.removeFrom(fromItemType, fromKey, ofItemType, ofKey)
        }
    }

    getChild(fromType, fromKey, ofType) {
        return this._relationAtPath(fromType, fromKey, ofType);
    }

    getParent(fromType, fromKey, ofType) {
        return this._relationAtPath(fromType, fromKey, ofType);
    }

    getChildren(fromType, fromKey, ofType) {
        const childrenMap = this._relationAtPath(fromType, fromKey, ofType);

        if (!childrenMap) {
            return [];
        }

        return Object.keys(childrenMap);
    }

    _lookupRelationship(fromItemType, toItemType) {
        const schema = this._schemaMap[fromItemType];

        if (!schema) {
            throw new Error(`Schema was not defined for ${fromItemType}`)
        }

        const relationship = schema.relationships[toItemType];

        if (!relationship) {
            throw new Error(`No relationship defined from ${fromItemType} to ${toItemType}`)
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

        this._setRelation(toType, toKey, fromType, fromKey);
        this._setRelation(fromType, fromKey, toType, toKey);
    }

    _removeOneToOneRelationship(toType, toKey, fromType, fromKey) {
        this._removeRelation(toType, toKey, fromType);
        this._removeRelation(fromType, fromKey, toType);
    }

    _setOneToManyRelationship(parentType, parentKey, childType, childKey) {
        //console.log(this._relations)
        this._setRelation(childType, childKey, parentType, parentKey);
        this._appendChildRelation(parentType, parentKey, childType, childKey);
    }

    _removeOneToManyRelationship(parentType, parentKey, childType, childKey) {
        this._removeRelation(childType, childKey, parentType);
        this._removeChildRelation(parentType, parentKey, childType, childKey);
    }

    _setManyToManyRelationship(toType, toKey, fromType, fromKey) {
        this._appendChildRelation(toType, toKey, fromType, fromKey);
        this._appendChildRelation(fromType, fromKey, toType, toKey);
    }

    _setRelation(toType, toKey, fromType, fromKey) {
        this._mergeRelationAtPath(
            [toType, toKey],
            {[fromType]: fromKey}
        );
    }

    _removeRelation(toType, toKey, fromType) {
        let relation = this._relationAtPath(toType, toKey);

        if (!relation) {
            //console.log(`Path doesnt exist ${toType}.${toKey}.${fromType}:`
            //    + ` ${toType} is`, this._relationAtPath(toType), `,`
            //    + ` ${toKey} is `, this._relationAtPath(toType, toKey), `,`
            //    + ` ${fromType} is `, this._relationAtPath(toType, toKey, fromType)
            //)
            return;
        }

        //console.log(`Deleting ${toType}.${toKey}.${fromType}`)
        delete relation[fromType]
    }

    _appendChildRelation(parentType, parentKey, childType, childKey) {
        this._mergeRelationAtPath(
            [parentType, parentKey, childType],
            {[childKey]: childKey}
        );
    }

    _removeChildRelation(parentType, parentKey, childType, childKey) {
        let relation = this._relationAtPath(parentType, parentKey, childType);

        if (!relation) {
            return;
        }

        delete relation[childKey]
    }

    _relationAtPath(...path) {
        let scoped = this._relations;

        for (let step of path) {
            if (!scoped.hasOwnProperty(step)) {
                return null;
            }

            scoped = scoped[step];
        }

        return scoped;
    }

    _mergeRelationAtPath(path, object) {
        let scoped = this._relations;

        for (let step of path) {
            if (!scoped.hasOwnProperty(step)) {
                scoped[step] = {};
            }

            scoped = scoped[step];
        }

        return Object.assign(scoped, object);
    }
}