"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchInput = function (_Component) {
  _inherits(SearchInput, _Component);

  function SearchInput() {
    _classCallCheck(this, SearchInput);

    return _possibleConstructorReturn(this, (SearchInput.__proto__ || Object.getPrototypeOf(SearchInput)).apply(this, arguments));
  }

  _createClass(SearchInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      setTimeout(function () {
        _this2.input.focus();
      }, 0);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var searchTerm = this.props.searchTerm;
      if (searchTerm !== undefined) {
        this.props.select.actions.search(searchTerm);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var props = this.props;
      return _react2.default.createElement(
        "div",
        { className: "PowerSelect__SearchInputContainer" },
        _react2.default.createElement("input", {
          ref: function ref(input) {
            return _this3.input = input;
          },
          className: "PowerSelect__SearchInput",
          onChange: function onChange(e) {
            return props.select.actions.search(e.target.value);
          }
        })
      );
    }
  }]);

  return SearchInput;
}(_react.Component);

exports.default = SearchInput;