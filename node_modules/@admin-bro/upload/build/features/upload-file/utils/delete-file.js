"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = void 0;
exports.deleteFile = async (options, provider, context, record) => {
    const { properties, multiple } = options;
    const key = record === null || record === void 0 ? void 0 : record.get(properties.key);
    if (record && key && !multiple) {
        const storedBucket = properties.bucket && record.get(properties.bucket);
        await provider.delete(key, storedBucket || provider.bucket, context);
    }
    else if (record && multiple && key && key.length) {
        const storedBuckets = properties.bucket ? record.get(properties.bucket) : [];
        await Promise.all(key.map(async (singleKey, index) => (provider.delete(singleKey, storedBuckets[index] || provider.bucket, context))));
    }
};
