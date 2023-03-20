function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
import React, { useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import useFetchAutocompleteOptions from '../hooks/useFetchAutocompleteOptions';
import { areEqual, componentsProps, renderOptionHandler } from '../tools/input-tools';
import EAMBaseInput from '../components/EAMBaseInput';
import TextField from './TextField';
import { saveHistory, HISTORY_ID_PREFIX } from '../tools/history-tools';
import Chip from '@mui/material/Chip';
var filter = createFilterOptions();

// TODO: this component is an extension of the EAMAutocomplete that supports
// multiple values. Although it is expected to still work the same for single
// values, it should be re-tested with them to make sure it still works as before.
var EAMAutocomplete = function EAMAutocomplete(props) {
  // NOTE: the 'multiple' and 'tagLabelKey' props is not in the non-wip version
  var autocompleteHandler = props.autocompleteHandler,
    autocompleteHandlerParams = props.autocompleteHandlerParams,
    value = props.value,
    desc = props.desc,
    id = props.id,
    renderValue = props.renderValue,
    onChange = props.onChange,
    multiple = props.multiple,
    tagLabelKey = props.tagLabelKey,
    creatable = props.creatable;

  // NOTE: this logic is not in the non-wip version
  var optionValueKey = tagLabelKey ? tagLabelKey : 'code';
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    inputValue = _useState2[0],
    setInputValue = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    open = _useState4[0],
    setOpen = _useState4[1];
  var _useFetchAutocomplete = useFetchAutocompleteOptions(autocompleteHandler, autocompleteHandlerParams, inputValue, value, open, id),
    _useFetchAutocomplete2 = _slicedToArray(_useFetchAutocomplete, 2),
    fetchedOptions = _useFetchAutocomplete2[0],
    loading = _useFetchAutocomplete2[1];
  var getOptionLabelHandler = function getOptionLabelHandler(option) {
    // NOTE: we adapt if the option object is not using 'code'
    return option[optionValueKey] ?? option;
  };
  var onInputChangeHandler = function onInputChangeHandler(event, newInputValue) {
    setInputValue(newInputValue);
    if (newInputValue !== value && desc) {
      onChange({
        desc: ''
      });
    }
  };
  var onChangeHandler = function onChangeHandler(event, newValue, reason) {
    if (reason === 'clear' || reason === 'createOption') {
      // Cases handled by the onCloseHandler
      return;
    }
    saveHistory(HISTORY_ID_PREFIX + id, newValue.code, newValue.desc);
    onChange(newValue);

    // Don't bubble up any events (won't trigger a save when we select something by pressing enter)
    event.stopPropagation();
    event.preventDefault();
  };
  var onCloseHandler = function onCloseHandler(event, reason) {
    setOpen(false);
    // Only to be fired when we blur, press ESC or hit enter and the
    // inputValue is different than the original value
    if (['blur', 'escape', 'createOption'].includes(reason) && inputValue !== value && !multiple // avoids adding a tag // NOTE: this is not in the non-wip version
    ) {
      // TODO: validation if inputValue is not empty
      onChange({
        code: inputValue
      });
    }
  };

  // NOTE: this handler is not in the non-wip version
  var filterOptionsHandler = function filterOptionsHandler(options, params) {
    if (!creatable) {
      return options;
    }
    var inputValue = params.inputValue;

    // Disallow adding the same option twice
    if (value.some(function (option) {
      return option[optionValueKey] === inputValue;
    })) {
      return [];
    }

    // check if input value is in the suggested options
    var exists = options.some(function (option) {
      return inputValue === (optionValueKey ? option[optionValueKey] : option);
    });
    var filtered = filter(options, params);

    // if not, add it to the suggestions list
    if (inputValue !== '' && !exists) {
      var _filtered$push;
      filtered.push((_filtered$push = {}, _defineProperty(_filtered$push, optionValueKey, inputValue), _defineProperty(_filtered$push, "desc", "Add \"".concat(inputValue, "\"")), _filtered$push));
    }
    return filtered;
  };
  return /*#__PURE__*/React.createElement(EAMBaseInput, props, /*#__PURE__*/React.createElement(Autocomplete
  // Options
  , {
    options: fetchedOptions,
    getOptionLabel: getOptionLabelHandler,
    renderOption: renderOptionHandler.bind(null, renderValue)
    // Open props
    ,
    open: open,
    onOpen: function onOpen() {
      return setOpen(true);
    },
    onClose: onCloseHandler
    // On change
    ,
    onChange: onChangeHandler,
    onInputChange: onInputChangeHandler
    // Misc
    ,
    filterOptions: filterOptionsHandler // NOTE: this prop is different in the non-wip version
    ,
    id: id,
    freeSolo: true,
    multiple: multiple // NOTE: this prop is not in the non-wip version
    ,
    value: value ? value : multiple ? undefined : '' // NOTE: this cond is not in the non-wip version
    // NOTE: this prop is not in the non-wip version
    ,
    renderTags: function renderTags(value, getTagProps) {
      return value.map(function (option, index) {
        return /*#__PURE__*/React.createElement(Chip, _extends({
          variant: "outlined",
          label: optionValueKey ? option[optionValueKey] : option
        }, getTagProps({
          index: index
        })));
      });
    }
    // Visuals
    ,
    openOnFocus: true // Very important, otherwise onCloseHandler won't be fired for example when we focus a field with a tab and delete its value.
    // Funningly without this prop it still works correctly when we manually gain focus using the mouse.
    ,
    componentsProps: componentsProps,
    includeInputInList: true,
    loading: loading,
    size: "small",
    fullWidth: true,
    renderInput: function renderInput(params) {
      return /*#__PURE__*/React.createElement(TextField, _extends({}, params, props));
    }
  }));
};
EAMAutocomplete.defaultProps = {};
export default React.memo(EAMAutocomplete, areEqual);