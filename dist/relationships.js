/**
 * The relationship types used by `Schema`s and `Graph`s.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Relationship = function Relationship(from, to) {
    _classCallCheck(this, Relationship);

    this.from = from;
    this.to = to;
};

exports.Relationship = Relationship;

var HasOneRelationship = (function (_Relationship) {
    _inherits(HasOneRelationship, _Relationship);

    function HasOneRelationship() {
        _classCallCheck(this, HasOneRelationship);

        _get(Object.getPrototypeOf(HasOneRelationship.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HasOneRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Has One Relationship';
        }
    }]);

    return HasOneRelationship;
})(Relationship);

exports.HasOneRelationship = HasOneRelationship;

var HasManyRelationship = (function (_Relationship2) {
    _inherits(HasManyRelationship, _Relationship2);

    function HasManyRelationship() {
        _classCallCheck(this, HasManyRelationship);

        _get(Object.getPrototypeOf(HasManyRelationship.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HasManyRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Has Many Relationship';
        }
    }]);

    return HasManyRelationship;
})(Relationship);

exports.HasManyRelationship = HasManyRelationship;

var BelongsToRelationship = (function (_Relationship3) {
    _inherits(BelongsToRelationship, _Relationship3);

    function BelongsToRelationship() {
        _classCallCheck(this, BelongsToRelationship);

        _get(Object.getPrototypeOf(BelongsToRelationship.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(BelongsToRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Belongs To Relationship';
        }
    }]);

    return BelongsToRelationship;
})(Relationship);

exports.BelongsToRelationship = BelongsToRelationship;

var HasAndBelongsToManyRelationship = (function (_Relationship4) {
    _inherits(HasAndBelongsToManyRelationship, _Relationship4);

    function HasAndBelongsToManyRelationship() {
        _classCallCheck(this, HasAndBelongsToManyRelationship);

        _get(Object.getPrototypeOf(HasAndBelongsToManyRelationship.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HasAndBelongsToManyRelationship, [{
        key: 'toString',
        value: function toString() {
            return 'Has and Belongs To Many Relationship';
        }
    }]);

    return HasAndBelongsToManyRelationship;
})(Relationship);

exports.HasAndBelongsToManyRelationship = HasAndBelongsToManyRelationship;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZWxhdGlvbnNoaXBzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlhLFlBQVksR0FDVixTQURGLFlBQVksQ0FDVCxJQUFJLEVBQUUsRUFBRSxFQUFFOzBCQURiLFlBQVk7O0FBRWpCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0NBQ2hCOzs7O0lBR1Esa0JBQWtCO2NBQWxCLGtCQUFrQjs7YUFBbEIsa0JBQWtCOzhCQUFsQixrQkFBa0I7O21DQUFsQixrQkFBa0I7OztpQkFBbEIsa0JBQWtCOztlQUNuQixvQkFBRztBQUNQLG1CQUFPLHNCQUFzQixDQUFDO1NBQ2pDOzs7V0FIUSxrQkFBa0I7R0FBUyxZQUFZOzs7O0lBTXZDLG1CQUFtQjtjQUFuQixtQkFBbUI7O2FBQW5CLG1CQUFtQjs4QkFBbkIsbUJBQW1COzttQ0FBbkIsbUJBQW1COzs7aUJBQW5CLG1CQUFtQjs7ZUFDcEIsb0JBQUc7QUFDUCxtQkFBTyx1QkFBdUIsQ0FBQztTQUNsQzs7O1dBSFEsbUJBQW1CO0dBQVMsWUFBWTs7OztJQU14QyxxQkFBcUI7Y0FBckIscUJBQXFCOzthQUFyQixxQkFBcUI7OEJBQXJCLHFCQUFxQjs7bUNBQXJCLHFCQUFxQjs7O2lCQUFyQixxQkFBcUI7O2VBQ3RCLG9CQUFHO0FBQ1AsbUJBQU8seUJBQXlCLENBQUM7U0FDcEM7OztXQUhRLHFCQUFxQjtHQUFTLFlBQVk7Ozs7SUFNMUMsK0JBQStCO2NBQS9CLCtCQUErQjs7YUFBL0IsK0JBQStCOzhCQUEvQiwrQkFBK0I7O21DQUEvQiwrQkFBK0I7OztpQkFBL0IsK0JBQStCOztlQUNoQyxvQkFBRztBQUNQLG1CQUFPLHNDQUFzQyxDQUFDO1NBQ2pEOzs7V0FIUSwrQkFBK0I7R0FBUyxZQUFZIiwiZmlsZSI6ImxpYi9yZWxhdGlvbnNoaXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgcmVsYXRpb25zaGlwIHR5cGVzIHVzZWQgYnkgYFNjaGVtYWBzIGFuZCBgR3JhcGhgcy5cbiAqL1xuXG5leHBvcnQgY2xhc3MgUmVsYXRpb25zaGlwIHtcbiAgICBjb25zdHJ1Y3Rvcihmcm9tLCB0bykge1xuICAgICAgICB0aGlzLmZyb20gPSBmcm9tO1xuICAgICAgICB0aGlzLnRvID0gdG87XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSGFzT25lUmVsYXRpb25zaGlwIGV4dGVuZHMgUmVsYXRpb25zaGlwIHtcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuICdIYXMgT25lIFJlbGF0aW9uc2hpcCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSGFzTWFueVJlbGF0aW9uc2hpcCBleHRlbmRzIFJlbGF0aW9uc2hpcCB7XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiAnSGFzIE1hbnkgUmVsYXRpb25zaGlwJztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCZWxvbmdzVG9SZWxhdGlvbnNoaXAgZXh0ZW5kcyBSZWxhdGlvbnNoaXAge1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gJ0JlbG9uZ3MgVG8gUmVsYXRpb25zaGlwJztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIYXNBbmRCZWxvbmdzVG9NYW55UmVsYXRpb25zaGlwIGV4dGVuZHMgUmVsYXRpb25zaGlwIHtcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuICdIYXMgYW5kIEJlbG9uZ3MgVG8gTWFueSBSZWxhdGlvbnNoaXAnO1xuICAgIH1cbn1cbiJdfQ==
