import {expect} from 'chai';
import sinon from 'sinon';

import {Schema, Graph} from '../../lib';
import {inspectGraph} from '../support/inspect';

describe('Graph with mixed relationships', () => {
    let schemas;
    let graph;

    describe('using various parent/child schemas', () => {
        beforeEach(() => {
            schemas = [
                Schema.define('parentWithChild')
                    .hasOne('child'),

                Schema.define('parentWithChildren')
                    .hasMany('child'),

                Schema.define('child')
                    .belongsTo('parentWithChild')
                    .belongsTo('parentWithChildren')
            ];

            graph = new Graph(schemas);
        });

        it('can append relationships', () => {
            graph
                .append('parentWithChild', 'foo').to('child', 'bar', 'baz')
                .append('parentWithChildren', 'foos').to('child', 'bar', 'baz')
            ;

            expect(graph.getParent('child', 'bar', 'parentWithChild')).to.be.undefined;
            expect(graph.getParent('child', 'baz', 'parentWithChild')).to.equal('foo');
            expect(graph.getChild('parentWithChild', 'foo', 'child')).to.equal('baz');

            expect(graph.getParent('child', 'bar', 'parentWithChildren')).to.equal('foos');
            expect(graph.getChildren('parentWithChildren', 'foos', 'child')).to.have.members(['bar', 'baz']);
        });

        it('can remove a relationship', () => {
            graph
                .set('parentWithChild', 'foo').to('child', 'bar')
                .set('parentWithChildren', 'foos').to('child', 'bar', 'baz')
                .removeFrom('parentWithChildren', 'foos', 'child', 'bar')
            ;

            expect(graph.getChild('parentWithChild', 'foo', 'child')).to.equal('bar');
            expect(graph.getChildren('parentWithChildren', 'foos', 'child')).to.have.members(['baz']);
        });

        it('can remove all relationships using a specific a key', () => {
            graph
                .setTo('parentWithChild', 'foo', 'child', 'bar')
                .appendTo('parentWithChildren', 'foos', 'child', 'bar')
                .appendTo('parentWithChildren', 'foos', 'child', 'baz')
                .removeUsage('child', 'bar')
            ;

            expect(graph.getChild('parentWithChild', 'foo', 'child')).to.be.undefined;
            expect(graph.getChildren('parentWithChildren', 'foos', 'child')).to.have.members(['baz']);
        });
    });

    describe('using readme example schemas', () => {
        it('should work as described in the readme', () => {
            // Model your relationships

            var schemas = [
                Schema.define('house')
                    .hasMany('room')
                    .hasOne('garage')
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
                .append('house', 'boulderEstate', 'beachHouse').to('person', 'jane')
            ;

            graph
                .append('house', 'boulderEstate')
                .to('room', 'livingroom', 'bedroom', 'bathroom')
            ;

            graph.set('garage', 'twoCar').to('house', 'boulderEstate');

            // Retrieve relationships

            let result1 = graph.getChild('house', 'boulderEstate', 'garage');
            // Result: 'twoCar'
            expect(result1).to.equal('twoCar');

            let result2 = graph.getChildren('person', 'jane', 'house');
            // Result: ['boulderEstate', 'beachHouse']
            expect(result2).to.eql(['boulderEstate', 'beachHouse']);

            let result3 = graph.getParent('room', 'bedroom', 'house');
            // Result: 'boulderEstate'
            expect(result3).to.equal('boulderEstate');
        });
    });
});
