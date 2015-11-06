# Graph

Stores relationships between different types of nodes. It requires an
`array` of `Schema`s to enforce the validity of relationships and govern how it
stores and looks up those relationships.

**Parameters**

-   `schemas`  

## append

Convenience method for {Graph#appendTo}. Use it as:

    append(nodeType, nodeKey[, nodeKey2, ...]).to(nodeType, nodeKey[, nodeKey2, ...])

**Parameters**

-   `fromNodeType`  
-   `fromKeys` **...** 

## appendTo

Append a relationship between nodes. This only works for nodes that have a
relationship of one-to-many or many-to-many, otherwise it works the same as
{Graph#setTo}.

**Parameters**

-   `fromNodeType`  Other type of node.
-   `fromKey`  Key of the other node.
-   `toNodeType`  Type of node.
-   `toKey`  Key of the node.

Returns **Graph** 

## canMergeWith

Determines whether `this` graph is compatible with `otherGraph`. They will
be compatible if `this` has matching schemas with `otherGraph`, even if
`otherGraph` has more schemas than `this`. That is, `this` schemas must be a
subset of `otherGraph` schemas.

This is useful to check if the graphs will be merged together.

**Parameters**

-   `otherGraph` **Graph** 

Returns **boolean** 

## getChild

Get the child's key of a has-one parent node.

**Parameters**

-   `parentType`  Type of node for the parent node.
-   `parentKey`  Key of the parent node.
-   `childType`  Type of node for the child node.

Returns **Any** Key of the child node.

## getChildren

Get an `array` of all the child node keys for a has-many or
has-and-belongs-to-many parent node.

**Parameters**

-   `parentType`  Type of node for the parent node.
-   `parentKey`  Key of the parent node.
-   `childType`  Type of node for the child nodes.

Returns **array** All child node keys associated with the parent node.

## getParent

Get the parent's key of a belongs-to child node.

**Parameters**

-   `childType`  Type of node for the child node.
-   `childKey`  Key of the child node.
-   `parentType`  Type of node for the parent node.

Returns **Any** Key of the parent node.

## remove

Convenience method for {Graph#removeFrom}. Use it as:

    remove(nodeType, nodeKey[, nodeKey2, ...]).from(nodeType, nodeKey[, nodeKey2, ...])

**Parameters**

-   `ofNodeType`  
-   `ofKeys` **...** 

## removeAllBetween

Removes all relationships between two node types.

**Parameters**

-   `fromNodeType`  Type of node.
-   `toNodeType`  Type of node.

## removeAllOfType

Removes all relationships of the specified node type.

**Parameters**

-   `nodeType`  Type of node.

## removeFrom

Removes a relationship between two nodes.

**Parameters**

-   `ofNodeType`  Other type of node.
-   `ofKey`  Key of the other node.
-   `fromNodeType`  Type of node.
-   `fromKey`  Key of the node.

Returns **Graph** 

## removeUsage

Removes all relationships with a particular node. This is useful, for example,
if the node no longer exists.

**Parameters**

-   `ofNodeType`  Type of node.
-   `ofKey`  Key of the node to disconnect from other nodes.

## schemas

Get the original array of `Schema`s that were passed into the constructor.

This is enforced read-only because changing the `Schema`s invalidates the
internal structure of the `Graph` and its relationships. Instead, a new
`Graph` should be created.

Returns **array** `Schema`s passed into the constructor.

## set

Convenience method for {Graph#setTo}. Use it as:

    set(nodeType, nodeKey[, nodeKey2, ...]).to(nodeType, nodeKey[, nodeKey2, ...])

**Parameters**

-   `fromNodeType`  
-   `fromKeys` **...** 

## setMultiple

Set multiple relationships at once. This will overwrite existing associations
to the specified nodes.

**Parameters**

-   `fromNodeType`  
-   `fromKeys` **array** 
-   `toNodeType`  
-   `toKeys` **array** 

Returns **Graph** 

## setTo

Set a node's relationship to another node.

**Parameters**

-   `fromNodeType`  Other type of node.
-   `fromKey`  Key of the other node.
-   `toNodeType`  Type of node.
-   `toKey`  Key of the node.

Returns **Graph** 

## merge

Creates a new graph with the relationships of `graphA` merged with `graphB`.

**Parameters**

-   `graphA` **Graph** 
-   `graphB` **Graph** 

Returns **Graph** 

## mergeCompatibleGraphs

Creates a new graph with the relationships of `graphA` merged with `graphB`.
It works exactly the same as {Graph#merge} except it doesn't check whether
both graphs have compatible schemas. This can be a performance boost if you
already know the schemas are compatible.

Note: Merging incompatible graphs here will result in relationship errors.

**Parameters**

-   `graphA` **Graph** 
-   `graphB` **Graph** 

Returns **Graph** 

# Schema

Defines a type of node's relationships with another node. A node is simply a unit
of data. For example, one node type might be a `car` and another is a `wheel`.
A `Schema` for `car` would specify it `hasMany` `wheels` and likewise, a `wheel`
`Schema` would specify it `belongsTo` a `car`.

**Parameters**

-   `forType`  

## belongsTo

Specify that the node can belong to a parent node of `parentType`.

**Parameters**

-   `parentType`  Type of parent node.

Returns **Schema** 

## equals

Determines whether `otherSchema` equals `this` schema.

**Parameters**

-   `otherSchema`  

## hasAndBelongsToMany

Specify that the node can have many child nodes and also can belong to many
parent nodes of `childType`.

**Parameters**

-   `childType`  Type of child/parent node.

Returns **Schema** 

## hasMany

Specify that the node can have any number of child nodes of `childType`.

**Parameters**

-   `childType`  Type of child nodes.

Returns **Schema** 

## hasOne

Specify that the node can have one child of `childType`.

**Parameters**

-   `childType`  Type of child node.

Returns **Schema** 

## define

Convenience method instead of using `new Schema`. Use it as:

    Schema.define(nodeType).[...]

**Parameters**

-   `nodeType`  

# Relationship

The relationship types used by `Schema`s and `Graph`s.

**Parameters**

-   `from`  
-   `to`  
