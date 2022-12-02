function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useState } from 'react';
var BLANK_ERROR = ' cannot be blank';
/**
 * Validates fields and generates the error messages to be shown (typically through the an errorText prop).
 * @param  {Object} requiredFieldsData Contains `<K,V>` pairs of `<valueKey,fieldLabel>`
 * where `valueKey` is the same key used to store the corresponding value in the parameter
 * `formValues` and `fieldLabel` is the label describing the field (used in generating the
 * error message).
 * @param  {Object} formValues Where all the values for the form fields are being kept.
 * It contains `<K,V>` pairs where `V` is the current field value (usually passed as prop to the field)
 * and `K` is the same key as the one passed to the corresponding entry in `requiredFieldsData`.
 * @param  {String} errorString The text to show, in the generated error message, following the field label.
 * @return {Object} Returns `errorMessages` and `validateFields`. `errorMessages` contains the error
 * messages using keys that match the ones passed in `requiredFieldsData` and `formValues`.
 * `validateFields` is the validation function to be used before submitting the form.
 */

var useFieldsValidator = function useFieldsValidator(requiredFieldsData, formValues) {
  var errorString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : BLANK_ERROR;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      errorMessages = _useState2[0],
      setErrorMessages = _useState2[1]; // Returns false if validation for at least one field fails
  // and sets generated error messages


  var validateFields = function validateFields() {
    var allFieldsAreValid = true;
    var generatedErrorMessages = Object.entries(requiredFieldsData).reduce(function (errorMessagesAcc, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          fieldKey = _ref2[0],
          fieldLabel = _ref2[1];

      if (!formValues[fieldKey]) {
        errorMessagesAcc[fieldKey] = fieldLabel + errorString;
        allFieldsAreValid = false;
      }

      return errorMessagesAcc;
    }, {});
    setErrorMessages(generatedErrorMessages);
    return allFieldsAreValid;
  };

  return {
    errorMessages: errorMessages,
    validateFields: validateFields
  };
};

export default useFieldsValidator;