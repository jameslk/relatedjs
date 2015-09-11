'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _relationships = require('./relationships');

/**
 * Defines a type of node's relationships with another node. A node is simply a unit
 * of data. For example, one node type might be a `car` and another is a `wheel`.
 * A `Schema` for `car` would specify it `hasMany` `wheels` and likewise, a `wheel`
 * `Schema` would specify it `belongsTo` a `car`.
 */

var Schema = (function () {
    function Schema(forType) {
        _classCallCheck(this, Schema);

        this.forType = forType;
        this.relationships = {};
    }

    /**
     * Convenience method instead of using `new Schema`. Use it as:
     * ```
     * Schema.define(nodeType).[...]
     * ```
     *
     * @param nodeType
     */

    _createClass(Schema, [{
        key: 'hasOne',

        /**
         * Specify that the node can have one child of `childType`.
         *
         * @param childType Type of child node.
         * @returns {Schema}
         */
        value: function hasOne(childType) {
            this.relationships[childType] = new _relationships.HasOneRelationship(this.forType, childType);

            return this;
        }

        /**
         * Specify that the node can have any number of child nodes of `childType`.
         *
         * @param childType Type of child nodes.
         * @returns {Schema}
         */
    }, {
        key: 'hasMany',
        value: function hasMany(childType) {
            this.relationships[childType] = new _relationships.HasManyRelationship(this.forType, childType);

            return this;
        }

        /**
         * Specify that the node can belong to a parent node of `parentType`.
         *
         * @param parentType Type of parent node.
         * @returns {Schema}
         */
    }, {
        key: 'belongsTo',
        value: function belongsTo(parentType) {
            this.relationships[parentType] = new _relationships.BelongsToRelationship(this.forType, parentType);

            return this;
        }

        /**
         * Specify that the node can have many child nodes and also can belong to many
         * parent nodes of `childType`.
         *
         * @param childType Type of child/parent node.
         * @returns {Schema}
         */
    }, {
        key: 'hasAndBelongsToMany',
        value: function hasAndBelongsToMany(childType) {
            this.relationships[childType] = new _relationships.HasAndBelongsToManyRelationship(this.forType, childType);

            return this;
        }
    }], [{
        key: 'define',
        value: function define(nodeType) {
            return new this(nodeType);
        }
    }]);

    return Schema;
})();

exports['default'] = Schema;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zY2hlbWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs2QkFLTyxpQkFBaUI7Ozs7Ozs7OztJQVFILE1BQU07QUFDWixhQURNLE1BQU0sQ0FDWCxPQUFPLEVBQUU7OEJBREosTUFBTTs7QUFFbkIsWUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsWUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7S0FDM0I7Ozs7Ozs7Ozs7O2lCQUpnQixNQUFNOzs7Ozs7Ozs7ZUF3QmpCLGdCQUFDLFNBQVMsRUFBRTtBQUNkLGdCQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLHNDQUM1QixJQUFJLENBQUMsT0FBTyxFQUNaLFNBQVMsQ0FDWixDQUFDOztBQUVGLG1CQUFPLElBQUksQ0FBQztTQUNmOzs7Ozs7Ozs7O2VBUU0saUJBQUMsU0FBUyxFQUFFO0FBQ2YsZ0JBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsdUNBQzVCLElBQUksQ0FBQyxPQUFPLEVBQ1osU0FBUyxDQUNaLENBQUM7O0FBRUYsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7Ozs7Ozs7Ozs7ZUFRUSxtQkFBQyxVQUFVLEVBQUU7QUFDbEIsZ0JBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcseUNBQzdCLElBQUksQ0FBQyxPQUFPLEVBQ1osVUFBVSxDQUNiLENBQUM7O0FBRUYsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7Ozs7Ozs7Ozs7O2VBU2tCLDZCQUFDLFNBQVMsRUFBRTtBQUMzQixnQkFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxtREFDNUIsSUFBSSxDQUFDLE9BQU8sRUFDWixTQUFTLENBQ1osQ0FBQzs7QUFFRixtQkFBTyxJQUFJLENBQUM7U0FDZjs7O2VBL0RZLGdCQUFDLFFBQVEsRUFBRTtBQUNwQixtQkFBTyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM3Qjs7O1dBaEJnQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJsaWIvc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBIYXNPbmVSZWxhdGlvbnNoaXAsXG4gICAgSGFzTWFueVJlbGF0aW9uc2hpcCxcbiAgICBCZWxvbmdzVG9SZWxhdGlvbnNoaXAsXG4gICAgSGFzQW5kQmVsb25nc1RvTWFueVJlbGF0aW9uc2hpcFxufSBmcm9tICcuL3JlbGF0aW9uc2hpcHMnO1xuXG4vKipcbiAqIERlZmluZXMgYSB0eXBlIG9mIG5vZGUncyByZWxhdGlvbnNoaXBzIHdpdGggYW5vdGhlciBub2RlLiBBIG5vZGUgaXMgc2ltcGx5IGEgdW5pdFxuICogb2YgZGF0YS4gRm9yIGV4YW1wbGUsIG9uZSBub2RlIHR5cGUgbWlnaHQgYmUgYSBgY2FyYCBhbmQgYW5vdGhlciBpcyBhIGB3aGVlbGAuXG4gKiBBIGBTY2hlbWFgIGZvciBgY2FyYCB3b3VsZCBzcGVjaWZ5IGl0IGBoYXNNYW55YCBgd2hlZWxzYCBhbmQgbGlrZXdpc2UsIGEgYHdoZWVsYFxuICogYFNjaGVtYWAgd291bGQgc3BlY2lmeSBpdCBgYmVsb25nc1RvYCBhIGBjYXJgLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlbWEge1xuICAgIGNvbnN0cnVjdG9yKGZvclR5cGUpIHtcbiAgICAgICAgdGhpcy5mb3JUeXBlID0gZm9yVHlwZTtcbiAgICAgICAgdGhpcy5yZWxhdGlvbnNoaXBzID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVuaWVuY2UgbWV0aG9kIGluc3RlYWQgb2YgdXNpbmcgYG5ldyBTY2hlbWFgLiBVc2UgaXQgYXM6XG4gICAgICogYGBgXG4gICAgICogU2NoZW1hLmRlZmluZShub2RlVHlwZSkuWy4uLl1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlVHlwZVxuICAgICAqL1xuICAgIHN0YXRpYyBkZWZpbmUobm9kZVR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKG5vZGVUeXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTcGVjaWZ5IHRoYXQgdGhlIG5vZGUgY2FuIGhhdmUgb25lIGNoaWxkIG9mIGBjaGlsZFR5cGVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkVHlwZSBUeXBlIG9mIGNoaWxkIG5vZGUuXG4gICAgICogQHJldHVybnMge1NjaGVtYX1cbiAgICAgKi9cbiAgICBoYXNPbmUoY2hpbGRUeXBlKSB7XG4gICAgICAgIHRoaXMucmVsYXRpb25zaGlwc1tjaGlsZFR5cGVdID0gbmV3IEhhc09uZVJlbGF0aW9uc2hpcChcbiAgICAgICAgICAgIHRoaXMuZm9yVHlwZSxcbiAgICAgICAgICAgIGNoaWxkVHlwZVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwZWNpZnkgdGhhdCB0aGUgbm9kZSBjYW4gaGF2ZSBhbnkgbnVtYmVyIG9mIGNoaWxkIG5vZGVzIG9mIGBjaGlsZFR5cGVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkVHlwZSBUeXBlIG9mIGNoaWxkIG5vZGVzLlxuICAgICAqIEByZXR1cm5zIHtTY2hlbWF9XG4gICAgICovXG4gICAgaGFzTWFueShjaGlsZFR5cGUpIHtcbiAgICAgICAgdGhpcy5yZWxhdGlvbnNoaXBzW2NoaWxkVHlwZV0gPSBuZXcgSGFzTWFueVJlbGF0aW9uc2hpcChcbiAgICAgICAgICAgIHRoaXMuZm9yVHlwZSxcbiAgICAgICAgICAgIGNoaWxkVHlwZVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwZWNpZnkgdGhhdCB0aGUgbm9kZSBjYW4gYmVsb25nIHRvIGEgcGFyZW50IG5vZGUgb2YgYHBhcmVudFR5cGVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFR5cGUgVHlwZSBvZiBwYXJlbnQgbm9kZS5cbiAgICAgKiBAcmV0dXJucyB7U2NoZW1hfVxuICAgICAqL1xuICAgIGJlbG9uZ3NUbyhwYXJlbnRUeXBlKSB7XG4gICAgICAgIHRoaXMucmVsYXRpb25zaGlwc1twYXJlbnRUeXBlXSA9IG5ldyBCZWxvbmdzVG9SZWxhdGlvbnNoaXAoXG4gICAgICAgICAgICB0aGlzLmZvclR5cGUsXG4gICAgICAgICAgICBwYXJlbnRUeXBlXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3BlY2lmeSB0aGF0IHRoZSBub2RlIGNhbiBoYXZlIG1hbnkgY2hpbGQgbm9kZXMgYW5kIGFsc28gY2FuIGJlbG9uZyB0byBtYW55XG4gICAgICogcGFyZW50IG5vZGVzIG9mIGBjaGlsZFR5cGVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkVHlwZSBUeXBlIG9mIGNoaWxkL3BhcmVudCBub2RlLlxuICAgICAqIEByZXR1cm5zIHtTY2hlbWF9XG4gICAgICovXG4gICAgaGFzQW5kQmVsb25nc1RvTWFueShjaGlsZFR5cGUpIHtcbiAgICAgICAgdGhpcy5yZWxhdGlvbnNoaXBzW2NoaWxkVHlwZV0gPSBuZXcgSGFzQW5kQmVsb25nc1RvTWFueVJlbGF0aW9uc2hpcChcbiAgICAgICAgICAgIHRoaXMuZm9yVHlwZSxcbiAgICAgICAgICAgIGNoaWxkVHlwZVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0iXX0=
