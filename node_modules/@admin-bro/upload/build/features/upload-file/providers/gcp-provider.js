"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCPProvider = void 0;
const base_provider_1 = require("./base-provider");
const constants_1 = require("../constants");
class GCPProvider extends base_provider_1.BaseProvider {
    constructor(options) {
        super(options.bucket);
        let GCPStorage;
        try {
            // eslint-disable-next-line
            GCPStorage = require('@google-cloud/storage').Storage;
        }
        catch (error) {
            throw new Error('You have to install "@google-cloud/storage" in order to run this plugin with GCP');
        }
        // // this check is needed because option expires can be `0`
        this.expires = typeof options.expires === 'undefined'
            ? constants_1.DAY_IN_MINUTES
            : options.expires;
        this.storage = new GCPStorage();
    }
    async upload(file, key) {
        return this.storage.bucket(this.bucket).upload(file.path, {
            gzip: true,
            destination: key,
            predefinedAcl: this.expires === 0 ? 'publicRead' : 'private',
        });
    }
    async delete(key, bucket) {
        const gcpBucket = this.storage.bucket(bucket);
        const file = gcpBucket.file(key);
        return file.delete();
    }
    async path(key, bucket) {
        const gcpBucket = this.storage.bucket(bucket);
        const file = gcpBucket.file(key);
        if (this.expires) {
            const files = await file.getSignedUrl({
                action: 'read',
                expires: new Date().valueOf() + this.expires * 1000,
            });
            return files[0];
        }
        // https://cloud.google.com/storage/docs/access-public-data#api-link
        return `https://storage.googleapis.com/${bucket}/${key}`;
    }
}
exports.GCPProvider = GCPProvider;
