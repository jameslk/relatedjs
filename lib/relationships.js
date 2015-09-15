/**
 * The relationship types used by `Schema`s and `Graph`s.
 */

export class Relationship {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    equals(otherRelationship) {
        if (this === otherRelationship) {
            return true;
        }

        if (!otherRelationship) {
            return false;
        }

        return (
            this.constructor === otherRelationship.constructor
            && this.from === otherRelationship.from
            && this.to === otherRelationship.to
        );
    }
}

export class HasOneRelationship extends Relationship {
    toString() {
        return 'Has One Relationship';
    }
}

export class HasManyRelationship extends Relationship {
    toString() {
        return 'Has Many Relationship';
    }
}

export class BelongsToRelationship extends Relationship {
    toString() {
        return 'Belongs To Relationship';
    }
}

export class HasAndBelongsToManyRelationship extends Relationship {
    toString() {
        return 'Has and Belongs To Many Relationship';
    }
}
