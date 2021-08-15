"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_bro_1 = __importStar(require("admin-bro"));
const constants_1 = require("./constants");
const get_provider_1 = require("./utils/get-provider");
const update_record_factory_1 = require("./factories/update-record-factory");
const fill_record_with_path_1 = require("./utils/fill-record-with-path");
const delete_file_factory_1 = require("./factories/delete-file-factory");
const delete_files_factory_1 = require("./factories/delete-files-factory");
const strip_payload_factory_1 = require("./factories/strip-payload-factory");
const DEFAULT_FILE_PROPERTY = 'file';
const DEFAULT_FILE_PATH_PROPERTY = 'filePath';
const DEFAULT_FILES_TO_DELETE_PROPERTY = 'filesToDelete';
const uploadFileFeature = (config) => {
    var _a, _b, _c;
    const { provider: providerOptions, validation, multiple } = config;
    const configWithDefault = Object.assign(Object.assign({}, config), { properties: Object.assign(Object.assign({}, config.properties), { file: ((_a = config.properties) === null || _a === void 0 ? void 0 : _a.file) || DEFAULT_FILE_PROPERTY, filePath: ((_b = config.properties) === null || _b === void 0 ? void 0 : _b.filePath) || DEFAULT_FILE_PATH_PROPERTY, filesToDelete: ((_c = config.properties) === null || _c === void 0 ? void 0 : _c.filesToDelete) || DEFAULT_FILES_TO_DELETE_PROPERTY }) });
    const { properties } = configWithDefault;
    const { provider, name: providerName } = get_provider_1.getProvider(providerOptions);
    if (!properties.key) {
        throw new Error(constants_1.ERROR_MESSAGES.NO_KEY_PROPERTY);
    }
    const stripFileFromPayload = strip_payload_factory_1.stripPayloadFactory(configWithDefault);
    const updateRecord = update_record_factory_1.updateRecordFactory(configWithDefault, provider);
    const deleteFile = delete_file_factory_1.deleteFileFactory(configWithDefault, provider);
    const deleteFiles = delete_files_factory_1.deleteFilesFactory(configWithDefault, provider);
    const fillPath = async (response, request, context) => {
        const { record } = response;
        return Object.assign(Object.assign({}, response), { record: await fill_record_with_path_1.fillRecordWithPath(record, context, configWithDefault, provider) });
    };
    const fillPaths = async (response, request, context) => {
        const { records } = response;
        return Object.assign(Object.assign({}, response), { records: await Promise.all(records.map((record) => (fill_record_with_path_1.fillRecordWithPath(record, context, configWithDefault, provider)))) });
    };
    const custom = {
        fileProperty: properties.file,
        filePathProperty: properties.filePath,
        filesToDeleteProperty: properties.filesToDelete,
        provider: providerName,
        keyProperty: properties.key,
        bucketProperty: properties.bucket,
        mimeTypeProperty: properties.mimeType,
        // bucket property can be empty so default bucket has to be passed
        defaultBucket: provider.bucket,
        mimeTypes: validation === null || validation === void 0 ? void 0 : validation.mimeTypes,
        maxSize: validation === null || validation === void 0 ? void 0 : validation.maxSize,
        multiple: !!multiple,
    };
    const uploadFeature = admin_bro_1.buildFeature({
        properties: {
            [properties.file]: {
                custom,
                isVisible: { show: true, edit: true, list: true, filter: false },
                components: {
                    edit: admin_bro_1.default.bundle('../../../src/features/upload-file/components/edit'),
                    list: admin_bro_1.default.bundle('../../../src/features/upload-file/components/list'),
                    show: admin_bro_1.default.bundle('../../../src/features/upload-file/components/show'),
                },
            },
        },
        actions: {
            show: {
                after: fillPath,
            },
            new: {
                before: stripFileFromPayload,
                after: [updateRecord, fillPath]
            },
            edit: {
                before: [stripFileFromPayload],
                after: [updateRecord, fillPath],
            },
            delete: {
                after: deleteFile,
            },
            list: {
                after: fillPaths,
            },
            bulkDelete: {
                after: deleteFiles,
            },
        },
    });
    return uploadFeature;
};
exports.default = uploadFileFeature;
