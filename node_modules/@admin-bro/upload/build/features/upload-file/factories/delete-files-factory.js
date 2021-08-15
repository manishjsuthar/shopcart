"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFilesFactory = void 0;
const delete_file_1 = require("../utils/delete-file");
exports.deleteFilesFactory = (uploadOptionsWithDefault, provider) => async function deleteFilesHook(response, request, context) {
    const { records = [] } = context;
    await Promise.all(records.map(async (record) => {
        await delete_file_1.deleteFile(uploadOptionsWithDefault, provider, context, record);
    }));
    return response;
};
