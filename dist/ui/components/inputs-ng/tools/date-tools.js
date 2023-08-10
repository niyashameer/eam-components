function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import TextField from "../components/TextField";
import React from 'react';
export var renderDatePickerInput = function renderDatePickerInput(_ref, isInvalidDate, style, errorText, disabled) {
  var inputRef = _ref.inputRef,
    inputProps = _ref.inputProps,
    InputProps = _ref.InputProps;
  if (isInvalidDate) {
    errorText = "Wrong Date format";
  }
  var endAdornment = /*#__PURE__*/React.createElement("div", {
    style: {
      marginRight: 12,
      marginLeft: -8
    }
  }, InputProps?.endAdornment);
  return /*#__PURE__*/React.createElement(TextField, {
    style: style,
    inputRef: inputRef,
    inputProps: disabled ? _objectSpread({}, inputProps, {
      placeholder: ""
    }) : _objectSpread({}, inputProps),
    endAdornment: disabled ? null : endAdornment,
    errorText: errorText,
    disabled: disabled
  });
};
export var onChangeHandler = function onChangeHandler(onChange, setIsInvalidDate, newValue) {
  try {
    if (newValue) {
      onChange(newValue.toISOString());
    } else {
      onChange('');
    }
    setIsInvalidDate(false);
  } catch (_unused) {
    setIsInvalidDate(true);
  }
};