"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecordFactory = void 0;
const admin_bro_1 = require("admin-bro");
const build_remote_path_1 = require("../utils/build-remote-path");
const constants_1 = require("../constants");
const strip_payload_factory_1 = require("./strip-payload-factory");
exports.updateRecordFactory = (uploadOptionsWithDefault, provider) => {
    const { properties, uploadPath, multiple } = uploadOptionsWithDefault;
    const updateRecord = async (response, request, context) => {
        var _a;
        const { record } = context;
        const { [properties.file]: files, [properties.filesToDelete]: filesToDelete, } = strip_payload_factory_1.getNamespaceFromContext(context);
        const { method } = request;
        if (method !== 'post') {
            return response;
        }
        if (record && record.isValid()) {
            if (multiple && filesToDelete && filesToDelete.length) {
                const filesData = filesToDelete.map((index) => ({
                    key: record.get(properties.key)[index],
                    bucket: record.get(properties.bucket)[index],
                }));
                await Promise.all(filesData.map(async (fileData) => (provider.delete(fileData.key, fileData.bucket || provider.bucket, context))));
                const newParams = constants_1.DB_PROPERTIES.reduce((params, propertyName) => {
                    if (properties[propertyName]) {
                        const filtered = record.get(properties[propertyName]).filter((el, i) => (!filesToDelete.includes(i.toString())));
                        return admin_bro_1.flat.set(params, properties[propertyName], filtered);
                    }
                    return params;
                }, {});
                await record.update(newParams);
            }
            if (multiple && files) {
                const uploadedFiles = files;
                const keys = await Promise.all(uploadedFiles.map(async (uploadedFile) => {
                    const key = build_remote_path_1.buildRemotePath(record, uploadedFile, uploadPath);
                    await provider.upload(uploadedFile, key, context);
                    return key;
                }));
                let params = admin_bro_1.flat.set({}, properties.key, [
                    ...(record.get(properties.key) || []),
                    ...keys,
                ]);
                if (properties.bucket) {
                    params = admin_bro_1.flat.set(params, properties.bucket, [
                        ...(record.get(properties.bucket) || []),
                        ...uploadedFiles.map(() => provider.bucket),
                    ]);
                }
                if (properties.size) {
                    params = admin_bro_1.flat.set(params, properties.size, [
                        ...(record.get(properties.size) || []),
                        ...uploadedFiles.map((file) => file.size),
                    ]);
                }
                if (properties.mimeType) {
                    params = admin_bro_1.flat.set(params, properties.mimeType, [
                        ...(record.get(properties.mimeType) || []),
                        ...uploadedFiles.map((file) => file.type),
                    ]);
                }
                if (properties.filename) {
                    params = admin_bro_1.flat.set(params, properties.filename, [
                        ...(record.get(properties.filename) || []),
                        ...uploadedFiles.map((file) => file.name),
                    ]);
                }
                await record.update(params);
                return Object.assign(Object.assign({}, response), { record: record.toJSON(context.currentAdmin) });
            }
            if (!multiple && files && files.length) {
                const uploadedFile = files[0];
                const oldRecordParams = Object.assign({}, record.params);
                const key = build_remote_path_1.buildRemotePath(record, uploadedFile, uploadPath);
                await provider.upload(uploadedFile, key, context);
                const params = Object.assign(Object.assign(Object.assign(Object.assign({ [properties.key]: key }, properties.bucket && { [properties.bucket]: provider.bucket }), properties.size && { [properties.size]: (_a = uploadedFile.size) === null || _a === void 0 ? void 0 : _a.toString() }), properties.mimeType && { [properties.mimeType]: uploadedFile.type }), properties.filename && { [properties.filename]: uploadedFile.name });
                await record.update(params);
                const oldKey = oldRecordParams[properties.key] && oldRecordParams[properties.key];
                const oldBucket = (properties.bucket && oldRecordParams[properties.bucket]) || provider.bucket;
                if (oldKey && oldBucket && (oldKey !== key || oldBucket !== provider.bucket)) {
                    await provider.delete(oldKey, oldBucket, context);
                }
                return Object.assign(Object.assign({}, response), { record: record.toJSON(context.currentAdmin) });
            }
            // someone wants to remove one file
            if (!multiple && files === null) {
                const bucket = (properties.bucket && record.get(properties.bucket)) || provider.bucket;
                const key = record.get(properties.key);
                // and file exists
                if (key && bucket) {
                    const params = Object.assign(Object.assign(Object.assign(Object.assign({ [properties.key]: null }, properties.bucket && { [properties.bucket]: null }), properties.size && { [properties.size]: null }), properties.mimeType && { [properties.mimeType]: null }), properties.filename && { [properties.filename]: null });
                    await record.update(params);
                    await provider.delete(key, bucket, context);
                    return Object.assign(Object.assign({}, response), { record: record.toJSON(context.currentAdmin) });
                }
            }
        }
        return response;
    };
    return updateRecord;
};
