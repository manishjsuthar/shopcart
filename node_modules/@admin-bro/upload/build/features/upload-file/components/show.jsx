"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const design_system_1 = require("@admin-bro/design-system");
const file_1 = __importDefault(require("./file"));
const Show = (props) => {
    const { property } = props;
    return (<design_system_1.FormGroup>
      <design_system_1.Label>{property.label}</design_system_1.Label>
      <file_1.default width="100%" {...props}/>
    </design_system_1.FormGroup>);
};
exports.default = Show;
