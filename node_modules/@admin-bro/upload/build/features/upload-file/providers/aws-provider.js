"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSProvider = void 0;
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("../constants");
const base_provider_1 = require("./base-provider");
class AWSProvider extends base_provider_1.BaseProvider {
    constructor(options) {
        var _a;
        super(options.bucket);
        let AWS_S3;
        try {
            // eslint-disable-next-line
            const AWS = require('aws-sdk');
            AWS_S3 = AWS.S3;
        }
        catch (error) {
            throw new Error(constants_1.ERROR_MESSAGES.NO_AWS_SDK);
        }
        this.expires = (_a = options.expires) !== null && _a !== void 0 ? _a : constants_1.DAY_IN_MINUTES;
        this.s3 = new AWS_S3(options);
    }
    async upload(file, key) {
        const uploadOptions = { partSize: 5 * 1024 * 1024, queueSize: 10 };
        const tmpFile = fs_1.default.createReadStream(file.path);
        const params = {
            Bucket: this.bucket,
            Key: key,
            Body: tmpFile,
        };
        if (!this.expires) {
            params.ACL = 'public-read';
        }
        return this.s3.upload(params, uploadOptions).promise();
    }
    async delete(key, bucket) {
        return this.s3.deleteObject({ Key: key, Bucket: bucket }).promise();
    }
    async path(key, bucket) {
        if (this.expires) {
            return this.s3.getSignedUrl('getObject', {
                Key: key,
                Bucket: bucket,
                Expires: this.expires,
            });
        }
        // https://bucket.s3.amazonaws.com/key
        return `https://${bucket}.s3.amazonaws.com/${key}`;
    }
}
exports.AWSProvider = AWSProvider;
