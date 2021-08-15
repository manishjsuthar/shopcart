"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const constants_1 = require("../constants");
const gcp_provider_1 = require("../providers/gcp-provider");
const aws_provider_1 = require("../providers/aws-provider");
/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
const get_provider_1 = require("./get-provider");
const providers_1 = require("../providers");
class MyProvider extends providers_1.BaseProvider {
    constructor() { super('bucketName'); }
    async upload() { return true; }
    async delete() { return true; }
    async path() { return '/fle-url'; }
}
describe('getProvider', () => {
    const bucket = 'bucket';
    const region = 'east-1';
    it('returns options if options are type of BaseProvider', () => {
        const provider = new MyProvider();
        const getProviderResponse = get_provider_1.getProvider(provider);
        chai_1.expect(getProviderResponse.name).to.equals('base');
        chai_1.expect(getProviderResponse.provider).to.equals(provider);
    });
    it('returns AWS provider when options have aws', () => {
        const getProviderResponse = get_provider_1.getProvider({ aws: { bucket, region } });
        chai_1.expect(getProviderResponse.name).to.equals('aws');
        chai_1.expect(getProviderResponse.provider).to.be.instanceOf(aws_provider_1.AWSProvider);
    });
    it('returns GCP provider when options have gcp', () => {
        const getProviderResponse = get_provider_1.getProvider({ gcp: { bucket } });
        chai_1.expect(getProviderResponse.name).to.equals('gcp');
        chai_1.expect(getProviderResponse.provider).to.be.instanceOf(gcp_provider_1.GCPProvider);
    });
    it('throws error when user gave no providers', () => {
        chai_1.expect(() => {
            get_provider_1.getProvider({});
        }).to.throw(constants_1.ERROR_MESSAGES.WRONG_PROVIDER_OPTIONS);
    });
    it('throws error when user gave too many providers', () => {
        chai_1.expect(() => {
            get_provider_1.getProvider({ gcp: { bucket }, aws: { bucket, region } });
        }).to.throw(constants_1.ERROR_MESSAGES.WRONG_PROVIDER_OPTIONS);
    });
});
