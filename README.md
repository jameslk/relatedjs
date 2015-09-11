# RelatedJs

A schematic store of relationships between plain old JavaScript objects.

## Why?

Often times, it's necessary to model the relationships between different domain
aspects of an application. This has often been the job of a *Model* library, such
as the ones commonly bundled in MVC frameworks. A particular pain with these
libraries is that they bundle a bunch of unrelated logic in your data models, such
as persistence logic, finders/data retrievers and other garbage.

With **relatedjs**, the logic for defining and creating relationships has been
separated out so that you're not forced to any specific implementation of how you
define your data. One particular benefit of this is that your data can be immutable
and normalized the way you'd like, as the relationships are stored elsewhere.

## Quick start

```javascript
// Model your relationships

var schemas = [
    Schema.define('house')
        .hasMany('rooms'),
        .hasOne('garage'),
        .hasAndBelongsToMany('person'),

    Schema.define('room')
        .belongsTo('house'),

    Schema.define('garage')
        .belongsTo('house'),

    Schema.define('person')
        .hasAndBelongsToMany('house')
];

// Create the store for your relationships

var graph = new Graph(schemas);

// Define relationships

graph
    .append('house', 'boulderEstate').to('person', 'james')
    .append('house', 'boulderEstate').to('person', 'jane')
    .append('house', 'beachHouse').to('person', 'jane')
;

graph
    .append('room', 'livingroom').to('house', 'boulderEstate')
    .append('room', 'bedroom').to('house', 'boulderEstate')
    .append('room', 'bathroom').to('house', 'boulderEstate')
;

graph.set('garage', 'twoCar').to('house', 'boulderEstate');

// Retrieve relationships

graph.getChild('house', 'boulderEstate', 'garage');
// Result: 'twoCar'

graph.getChildren('person', 'jane', 'house');
// Result: ['boulderEstate', 'beachHouse']

graph.getParent('room', 'bedroom', 'house');
// Result: 'boulderEstate'
```

## License

The MIT License (MIT)

Copyright (c) 2015 James Koshigoe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.