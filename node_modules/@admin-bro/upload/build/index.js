"use strict";
/**
 * @module @admin-bro/upload
 * @subcategory Features
 * @section modules
 * @load ./index.doc.md
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_file_feature_1 = __importDefault(require("./features/upload-file/upload-file.feature"));
exports.default = upload_file_feature_1.default;
__exportStar(require("./features/upload-file/types/upload-options.type"), exports);
__exportStar(require("./features/upload-file/providers"), exports);
