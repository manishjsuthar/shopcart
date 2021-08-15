"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNamespaceFromContext = exports.stripPayloadFactory = void 0;
/* eslint-disable no-underscore-dangle */
const admin_bro_1 = require("admin-bro");
const constants_1 = require("../constants");
const validate_properties_1 = require("../utils/validate-properties");
exports.stripPayloadFactory = (uploadOptionsWithDefault) => {
    const stripFileFromPayload = async (request, context) => {
        const { properties } = uploadOptionsWithDefault;
        if (request === null || request === void 0 ? void 0 : request.payload) {
            let data = context[constants_1.CONTEXT_NAMESPACE] || {};
            data = Object.assign(Object.assign({}, data), { [properties.file]: admin_bro_1.flat.get(request.payload, properties.file), [properties.filesToDelete]: admin_bro_1.flat.get(request.payload, properties.filesToDelete), __invocations: [
                    ...(data.__invocations || []),
                    { properties },
                ] });
            context[constants_1.CONTEXT_NAMESPACE] = data;
            let filteredPayload = admin_bro_1.flat.filterOutParams(request.payload, properties.file);
            filteredPayload = admin_bro_1.flat.filterOutParams(filteredPayload, properties.filesToDelete);
            filteredPayload = admin_bro_1.flat.filterOutParams(filteredPayload, properties.filePath);
            const duplicatedOccurrences = validate_properties_1.validatePropertiesGlobally(data.__invocations);
            if (duplicatedOccurrences) {
                throw new Error(constants_1.ERROR_MESSAGES.DUPLICATED_KEYS(duplicatedOccurrences));
            }
            return Object.assign(Object.assign({}, request), { payload: filteredPayload });
        }
        return request;
    };
    return stripFileFromPayload;
};
exports.getNamespaceFromContext = (context) => {
    const namespace = (context || {})[constants_1.CONTEXT_NAMESPACE];
    return namespace || {};
};
