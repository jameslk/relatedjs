export class Relationship {
    constructor(from, to) {
        this.from = from;
        this.to = to;
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
