"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PayPalButton = void 0;

require("@babel/polyfill");

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PayPalButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(PayPalButton, _React$Component);

  function PayPalButton(props) {
    var _this;

    _classCallCheck(this, PayPalButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PayPalButton).call(this, props));
    _this.state = {
      isSdkReady: false
    };
    return _this;
  }

  _createClass(PayPalButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (window !== undefined && window.paypal === undefined) {
        this.addPaypalSdk();
      } else if (window !== undefined && window.paypal !== undefined && this.props.onButtonReady) {
        this.props.onButtonReady();
      }
    }
  }, {
    key: "createOrder",
    value: function createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: this.props.currency ? this.props.currency : this.props.options && this.props.options.currency ? this.props.options.currency : "USD",
            value: this.props.amount.toString()
          }
        }]
      });
    }
  }, {
    key: "onApprove",
    value: function onApprove(data, actions) {
      var _this2 = this;

      return actions.order.capture().then(function (details) {
        if (_this2.props.onSuccess) {
          return _this2.props.onSuccess(details, data);
        }
      })["catch"](function (err) {
        if (_this2.props.catchError) {
          return _this2.props.catchError(err);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          amount = _this$props.amount,
          onSuccess = _this$props.onSuccess,
          createOrder = _this$props.createOrder,
          onApprove = _this$props.onApprove,
          style = _this$props.style;
      var isSdkReady = this.state.isSdkReady;

      if (!isSdkReady && window.paypal === undefined) {
        return null;
      }

      var Button = window.paypal.Buttons.driver("react", {
        React: _react["default"],
        ReactDOM: _reactDom["default"]
      });
      return _react["default"].createElement(Button, _extends({}, this.props, {
        createOrder: amount && !createOrder ? function (data, actions) {
          return _this3.createOrder(data, actions);
        } : function (data, actions) {
          return createOrder(data, actions);
        },
        onApprove: onSuccess ? function (data, actions) {
          return _this3.onApprove(data, actions);
        } : function (data, actions) {
          return onApprove(data, actions);
        },
        style: style
      }));
    }
  }, {
    key: "addPaypalSdk",
    value: function addPaypalSdk() {
      var _this4 = this;

      var _this$props2 = this.props,
          options = _this$props2.options,
          onButtonReady = _this$props2.onButtonReady;
      var queryParams = []; // replacing camelCase with dashes

      Object.keys(options).forEach(function (k) {
        var name = k.split(/(?=[A-Z])/).join("-").toLowerCase();
        queryParams.push("".concat(name, "=").concat(options[k]));
      });
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://www.paypal.com/sdk/js?".concat(queryParams.join("&"));
      script.async = true;

      script.onload = function () {
        _this4.setState({
          isSdkReady: true
        });

        if (onButtonReady) {
          onButtonReady();
        }
      };

      script.onerror = function () {
        throw new Error("Paypal SDK could not be loaded.");
      };

      document.body.appendChild(script);
    }
  }]);

  return PayPalButton;
}(_react["default"].Component);

exports.PayPalButton = PayPalButton;

_defineProperty(PayPalButton, "propTypes", {
  amount: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  currency: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  onSuccess: _propTypes["default"].func,
  catchError: _propTypes["default"].func,
  onError: _propTypes["default"].func,
  createOrder: _propTypes["default"].func,
  onApprove: _propTypes["default"].func,
  style: _propTypes["default"].object,
  options: _propTypes["default"].shape({
    clientId: _propTypes["default"].string,
    merchantId: _propTypes["default"].string,
    currency: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
    intent: _propTypes["default"].string,
    commit: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].string]),
    vault: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].string]),
    component: _propTypes["default"].string,
    disableFunding: _propTypes["default"].string,
    disableCard: _propTypes["default"].string,
    integrationDate: _propTypes["default"].string,
    locale: _propTypes["default"].string,
    buyerCountry: _propTypes["default"].string,
    debug: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].string])
  }),
  onButtonReady: _propTypes["default"].func
});

_defineProperty(PayPalButton, "defaultProps", {
  style: {},
  options: {
    clientId: "sb",
    currency: "USD"
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50c3giXSwibmFtZXMiOlsiUGF5UGFsQnV0dG9uIiwicHJvcHMiLCJzdGF0ZSIsImlzU2RrUmVhZHkiLCJ3aW5kb3ciLCJ1bmRlZmluZWQiLCJwYXlwYWwiLCJhZGRQYXlwYWxTZGsiLCJvbkJ1dHRvblJlYWR5IiwiZGF0YSIsImFjdGlvbnMiLCJvcmRlciIsImNyZWF0ZSIsInB1cmNoYXNlX3VuaXRzIiwiYW1vdW50IiwiY3VycmVuY3lfY29kZSIsImN1cnJlbmN5Iiwib3B0aW9ucyIsInZhbHVlIiwidG9TdHJpbmciLCJjYXB0dXJlIiwidGhlbiIsImRldGFpbHMiLCJvblN1Y2Nlc3MiLCJlcnIiLCJjYXRjaEVycm9yIiwiY3JlYXRlT3JkZXIiLCJvbkFwcHJvdmUiLCJzdHlsZSIsIkJ1dHRvbiIsIkJ1dHRvbnMiLCJkcml2ZXIiLCJSZWFjdCIsIlJlYWN0RE9NIiwicXVlcnlQYXJhbXMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImsiLCJuYW1lIiwic3BsaXQiLCJqb2luIiwidG9Mb3dlckNhc2UiLCJwdXNoIiwic2NyaXB0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsInNyYyIsImFzeW5jIiwib25sb2FkIiwic2V0U3RhdGUiLCJvbmVycm9yIiwiRXJyb3IiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvbmVPZlR5cGUiLCJudW1iZXIiLCJzdHJpbmciLCJmdW5jIiwib25FcnJvciIsIm9iamVjdCIsInNoYXBlIiwiY2xpZW50SWQiLCJtZXJjaGFudElkIiwiaW50ZW50IiwiY29tbWl0IiwiYm9vbCIsInZhdWx0IiwiY29tcG9uZW50IiwiZGlzYWJsZUZ1bmRpbmciLCJkaXNhYmxlQ2FyZCIsImludGVncmF0aW9uRGF0ZSIsImxvY2FsZSIsImJ1eWVyQ291bnRyeSIsImRlYnVnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7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XCJyZWFjdFwiO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBQYXlQYWxCdXR0b25Qcm9wcyB7XG4gICAgYW1vdW50PzogbnVtYmVyfHN0cmluZyxcbiAgICBjdXJyZW5jeT86IG51bWJlcnxzdHJpbmcsXG4gICAgb25TdWNjZXNzPzogRnVuY3Rpb24sXG4gICAgY2F0Y2hFcnJvcj86IEZ1bmN0aW9uLFxuICAgIG9uRXJyb3I/OiBGdW5jdGlvbixcbiAgICBjcmVhdGVPcmRlcj86IEZ1bmN0aW9uLFxuICAgIG9uQXBwcm92ZT86IEZ1bmN0aW9uLFxuICAgIHN0eWxlPzogb2JqZWN0LFxuICAgIG9wdGlvbnM/OiBQYXlwYWxPcHRpb25zLFxuICAgIG9uQnV0dG9uUmVhZHk/OiBGdW5jdGlvbixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXlQYWxCdXR0b25TdGF0ZSB7XG4gICAgaXNTZGtSZWFkeTogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBheXBhbE9wdGlvbnMge1xuICAgIGNsaWVudElkPzogc3RyaW5nLFxuICAgIG1lcmNoYW50SWQ/OiBzdHJpbmcsXG4gICAgY3VycmVuY3k/OiBudW1iZXJ8c3RyaW5nLFxuICAgIGludGVudD86IHN0cmluZyxcbiAgICBjb21taXQ/OiBib29sZWFufHN0cmluZyxcbiAgICB2YXVsdD86IGJvb2xlYW58c3RyaW5nLFxuICAgIGNvbXBvbmVudD86IHN0cmluZyxcbiAgICBkaXNhYmxlRnVuZGluZz86IHN0cmluZyxcbiAgICBkaXNhYmxlQ2FyZD86IHN0cmluZyxcbiAgICBpbnRlZ3JhdGlvbkRhdGU/OiBzdHJpbmcsXG4gICAgbG9jYWxlPzogc3RyaW5nLFxuICAgIGJ1eWVyQ291bnRyeT86IHN0cmluZyxcbiAgICBkZWJ1Zz86IGJvb2xlYW58c3RyaW5nXG59XG5cbmNsYXNzIFBheVBhbEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQYXlQYWxCdXR0b25Qcm9wcywgUGF5UGFsQnV0dG9uU3RhdGU+IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgICBhbW91bnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIF0pLFxuICAgICAgICBjdXJyZW5jeTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgXSksXG4gICAgICAgIG9uU3VjY2VzczogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGNhdGNoRXJyb3I6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkVycm9yOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgY3JlYXRlT3JkZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkFwcHJvdmU6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgb3B0aW9uczogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIGNsaWVudElkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgbWVyY2hhbnRJZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIGN1cnJlbmN5OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIGludGVudDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIGNvbW1pdDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICAgICAgUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZ1xuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICB2YXVsdDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICAgICAgUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZ1xuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBjb21wb25lbnQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBkaXNhYmxlRnVuZGluZzogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIGRpc2FibGVDYXJkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgaW50ZWdyYXRpb25EYXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgbG9jYWxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgYnV5ZXJDb3VudHJ5OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgZGVidWc6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgICAgIFByb3BUeXBlcy5ib29sLFxuICAgICAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmdcbiAgICAgICAgICAgIF0pXG4gICAgICAgIH0pLFxuICAgICAgICBvbkJ1dHRvblJlYWR5OiBQcm9wVHlwZXMuZnVuYyxcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBzdHlsZToge30sXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNsaWVudElkOiBcInNiXCIsXG4gICAgICAgICAgICBjdXJyZW5jeTogXCJVU0RcIlxuICAgICAgICB9LFxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBQYXlQYWxCdXR0b25Qcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGlzU2RrUmVhZHk6IGZhbHNlLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB3aW5kb3cgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgd2luZG93LnBheXBhbCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5hZGRQYXlwYWxTZGsoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgIHdpbmRvdyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB3aW5kb3cucGF5cGFsICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25CdXR0b25SZWFkeVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25CdXR0b25SZWFkeSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlT3JkZXIoZGF0YTogYW55LCBhY3Rpb25zOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbnMub3JkZXJcbiAgICAgICAgICAgIC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIHB1cmNoYXNlX3VuaXRzOiBbe1xuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbmN5X2NvZGU6IHRoaXMucHJvcHMuY3VycmVuY3lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMucHJvcHMuY3VycmVuY3lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMucHJvcHMub3B0aW9ucyAmJiB0aGlzLnByb3BzLm9wdGlvbnMuY3VycmVuY3lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMucHJvcHMub3B0aW9ucy5jdXJyZW5jeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJVU0RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnByb3BzLmFtb3VudC50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uQXBwcm92ZShkYXRhOiBhbnksIGFjdGlvbnM6IGFueSkge1xuICAgICAgICByZXR1cm4gYWN0aW9ucy5vcmRlclxuICAgICAgICAgICAgLmNhcHR1cmUoKVxuICAgICAgICAgICAgLnRoZW4oKGRldGFpbHMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5vblN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25TdWNjZXNzKGRldGFpbHMsIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmNhdGNoRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY2F0Y2hFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgYW1vdW50LFxuICAgICAgICAgICAgb25TdWNjZXNzLFxuICAgICAgICAgICAgY3JlYXRlT3JkZXIsXG4gICAgICAgICAgICBvbkFwcHJvdmUsXG4gICAgICAgICAgICBzdHlsZSxcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IHsgaXNTZGtSZWFkeSB9ID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICBpZiAoIWlzU2RrUmVhZHkgJiYgd2luZG93LnBheXBhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEJ1dHRvbiA9IHdpbmRvdy5wYXlwYWwuQnV0dG9ucy5kcml2ZXIoXCJyZWFjdFwiLCB7XG4gICAgICAgICAgICBSZWFjdCxcbiAgICAgICAgICAgIFJlYWN0RE9NLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAgICAgICAgIGNyZWF0ZU9yZGVyPXtcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50ICYmICFjcmVhdGVPcmRlclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAoZGF0YTogYW55LCBhY3Rpb25zOiBhbnkpID0+IHRoaXMuY3JlYXRlT3JkZXIoZGF0YSwgYWN0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgIDogKGRhdGE6IGFueSwgYWN0aW9uczogYW55KSA9PiBjcmVhdGVPcmRlcihkYXRhLCBhY3Rpb25zKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvbkFwcHJvdmU9e1xuICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKGRhdGE6IGFueSwgYWN0aW9uczogYW55KSA9PiB0aGlzLm9uQXBwcm92ZShkYXRhLCBhY3Rpb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiAoZGF0YTogYW55LCBhY3Rpb25zOiBhbnkpID0+IG9uQXBwcm92ZShkYXRhLCBhY3Rpb25zKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkUGF5cGFsU2RrKCkge1xuICAgICAgICBjb25zdCB7IG9wdGlvbnMsIG9uQnV0dG9uUmVhZHkgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IHF1ZXJ5UGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIC8vIHJlcGxhY2luZyBjYW1lbENhc2Ugd2l0aCBkYXNoZXNcbiAgICAgICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChrID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBrLnNwbGl0KC8oPz1bQS1aXSkvKS5qb2luKFwiLVwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgcXVlcnlQYXJhbXMucHVzaChgJHtuYW1lfT0ke29wdGlvbnNba119YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICAgICAgc2NyaXB0LnNyYyA9IGBodHRwczovL3d3dy5wYXlwYWwuY29tL3Nkay9qcz8ke3F1ZXJ5UGFyYW1zLmpvaW4oXCImXCIpfWA7XG4gICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNTZGtSZWFkeTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgaWYgKG9uQnV0dG9uUmVhZHkpIHtcbiAgICAgICAgICAgICAgICBvbkJ1dHRvblJlYWR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNjcmlwdC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGF5cGFsIFNESyBjb3VsZCBub3QgYmUgbG9hZGVkLlwiKTtcbiAgICAgICAgfTtcbiAgICBcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgUGF5UGFsQnV0dG9uIH07XG4iXX0=