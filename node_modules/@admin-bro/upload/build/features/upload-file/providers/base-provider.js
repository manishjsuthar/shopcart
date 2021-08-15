"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = void 0;
const constants_1 = require("../constants");
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable class-methods-use-this */
/**
 * @load ./base-provider.doc.md
 * @memberof module:@admin-bro/upload
 * @alias BaseProvider
 * @hide
 * @private
 */
class BaseProvider {
    /**
     * @param { string } bucket     place where files should be stored
     */
    constructor(bucket) {
        this.name = 'BaseProvider';
        this.bucket = bucket;
    }
    /**
     * Uploads file to given bucket
     *
     * @param {UploadedFile} file uploaded by AdminBro file
     * @param {string} key file path
     * @param {ActionContext} context
     * @abstract
     */
    async upload(file, key, context) {
        throw new Error(constants_1.ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED('BaseProvider#upload'));
    }
    /**
     * Deletes given file
     *
     * @param {string} key file path
     * @param {string} bucket where file should be uploaded
     * @param {ActionContext} context
     * @abstract
     */
    async delete(key, bucket, context) {
        throw new Error(constants_1.ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED('BaseProvider#delete'));
    }
    /**
     * Returns path for the file from where it can be downloaded. It is dynamic in case of
     * time based paths: i.e. link valid in the next 24h
     *
     * @param {string} key file path
     * @param {string} bucket where file should be put
     * @param {ActionContext} context
     * @async
     * @abstract
     */
    path(key, bucket, context) {
        throw new Error(constants_1.ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED('BaseProvider#path'));
    }
}
exports.BaseProvider = BaseProvider;
