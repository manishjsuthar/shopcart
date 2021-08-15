"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFactory = void 0;
const delete_file_1 = require("../utils/delete-file");
exports.deleteFileFactory = (uploadOptionsWithDefault, provider) => async function deleteFileHook(response, request, context) {
    const { record } = context;
    await delete_file_1.deleteFile(uploadOptionsWithDefault, provider, context, record);
    return response;
};
