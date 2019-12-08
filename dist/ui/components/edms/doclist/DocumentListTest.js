"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactTable = _interopRequireDefault(require("react-table"));

require("react-table/react-table.css");

var _StatusBox = _interopRequireDefault(require("./StatusBox"));

var _EDMSUtils = require("../utils/EDMSUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DocumentListTest =
/*#__PURE__*/
function (_Component) {
  _inherits(DocumentListTest, _Component);

  function DocumentListTest() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DocumentListTest);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DocumentListTest)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.thumbnailStyle = {
      maxWidth: 90,
      maxHeight: 90
    };

    _this.computeDropZoneStyle = function () {
      return {
        border: "1px solid transparent",
        backgroundColor: _this.props.index % 2 ? 'rgb(250, 250, 250)' : 'white'
      };
    };

    _this.computeDropZoneActiveStyle = function () {
      return {
        border: "1px dashed #a7a7a7",
        backgroundColor: _this.props.index % 2 ? 'rgb(250, 250, 250)' : 'white'
      };
    };

    _this.computeStatusBox = function (status) {
      var statusColor = '';

      switch (status) {
        case 'In Work':
          statusColor = 'rgb(204, 0, 0)';
          break;

        case 'Draft For Discussion':
          statusColor = 'rgb(255, 240, 0)';
          break;

        case 'Released':
          statusColor = 'rgb(0, 204, 0)';
          break;

        default:
          statusColor = 'rgb(119, 119, 119)';
      }

      return _react["default"].createElement(_StatusBox["default"], {
        color: statusColor
      });
    };

    _this.stopPropagation = function (event) {
      event.stopPropagation();
    };

    _this.onFileDrop = function (acceptedFiles, rejectedFiles) {
      _this.props.filesUploadHandler(_this.props.document.edmsId, _this.props.document.version, acceptedFiles);
    };

    return _this;
  }

  _createClass(DocumentListTest, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react["default"].createElement("div", null, _react["default"].createElement(_reactTable["default"], {
        data: this.props.documents,
        noDataText: "No documents found",
        columns: [{
          Header: 'Id',
          accessor: 'edmsId',
          maxWidth: 100,
          Cell: function Cell(cellInfo) {
            return _react["default"].createElement("a", {
              href: cellInfo.original.url,
              target: "_blank",
              onClick: _this2.stopPropagation
            }, " ", cellInfo.original.edmsId + ' v.' + cellInfo.original.version, " ");
          }
        }, {
          Header: 'Title',
          accessor: 'title'
        }, {
          Header: 'Status',
          accessor: 'status',
          maxWidth: 150,
          Cell: function Cell(row) {
            return _react["default"].createElement("span", null, _this2.computeStatusBox(row.value), row.value);
          }
        }],
        defaultPageSize: 10,
        className: "-striped -highlight",
        SubComponent: function SubComponent(cellInfo) {
          return _react["default"].createElement("div", {
            style: {
              padding: "20px"
            }
          }, _react["default"].createElement(_reactTable["default"], {
            data: cellInfo.original.properties.edms_property === null ? [] : cellInfo.original.properties.edms_property,
            noDataText: "No details for this document",
            columns: [{
              Header: 'Properties',
              columns: [{
                Header: 'Name',
                accessor: 'name'
              }, {
                Header: 'Value',
                accessor: 'value'
              }]
            }],
            defaultPageSize: 5,
            showPagination: false,
            style: {
              height: "200px"
            }
          }), _react["default"].createElement("br", null), _react["default"].createElement("br", null), _react["default"].createElement(_reactTable["default"], {
            data: cellInfo.original.files,
            noDataText: "No files in this document",
            columns: [{
              Header: 'File',
              columns: [{
                Header: 'Thumbnail',
                accessor: 'edmsId',
                width: 100,
                Cell: function Cell(cellInfo) {
                  return _react["default"].createElement("div", null, _react["default"].createElement("img", {
                    style: _this2.thumbnailStyle,
                    id: cellInfo.original.edmsId + "###" + cellInfo.original.innerId,
                    src: (0, _EDMSUtils.getEDMSFileUrl)(cellInfo.original)
                  }));
                }
              }, {
                Header: 'Name',
                accessor: 'fileName',
                Cell: function Cell(cellInfo) {
                  return _react["default"].createElement("a", {
                    href: cellInfo.original.fullPath,
                    target: "_blank"
                  }, cellInfo.original.fileName);
                }
              }]
            }],
            defaultPageSize: 5,
            showPagination: false,
            style: {
              height: "200px"
            }
          }));
        }
      }));
    }
  }]);

  return DocumentListTest;
}(_react.Component);

var _default = DocumentListTest;
exports["default"] = _default;