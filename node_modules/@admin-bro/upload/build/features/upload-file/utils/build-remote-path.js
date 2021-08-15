"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRemotePath = void 0;
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
/**
 * Creates a path to the file. Related to the given provider. If it is an AWS
 * path is related to the bucket.
 *
 * @param   {BaseRecord}  record
 * @param   {UploadedFile} file  uploaded file
 * @param   {UploadPathFunction}      [pathFunction]
 *
 * @return  {string}
 * @private
 */
exports.buildRemotePath = (record, file, uploadPathFunction) => {
    if (!record.id()) {
        throw new Error(constants_1.ERROR_MESSAGES.NO_PERSISTENT_RECORD_UPLOAD);
    }
    if (!file.name) {
        throw new Error(constants_1.ERROR_MESSAGES.NO_FILENAME);
    }
    const { ext, name } = path_1.default.parse(file.name);
    if (uploadPathFunction) {
        return uploadPathFunction(record, `${name}${ext}`);
    }
    return `${record.id()}/${name}${ext}`;
};
