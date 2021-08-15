"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const file_1 = __importDefault(require("./file"));
const List = (props) => (<file_1.default width={100} {...props}/>);
exports.default = List;
