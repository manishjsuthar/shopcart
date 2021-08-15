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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const sinon_1 = __importDefault(require("sinon"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
const upload_file_feature_1 = __importDefault(require("./upload-file.feature"));
const stub_provider_1 = __importDefault(require("./spec/stub-provider"));
chai_1.default.use(sinon_chai_1.default);
describe('uploadFileFeature', () => {
    let provider;
    let properties;
    const resolvedS3Path = 'resolvedS3Path';
    beforeEach(() => {
        provider = stub_provider_1.default(resolvedS3Path);
        properties = {
            key: 's3Key',
            filePath: 'resolvedPath',
            file: 'filePath',
        };
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    describe('constructor', () => {
        it('throws an error when provider was not been given', () => {
            chai_1.expect(() => upload_file_feature_1.default({})).to.throw('You have to specify provider in options');
        });
        it('throws an error when provider was not been given', () => {
            const options = { provider, properties: {} };
            chai_1.expect(() => upload_file_feature_1.default(options)).to.throw('You have to define `key` property in options');
        });
    });
    describe('show#after hook - #fillPath', () => {
        const key = 'someKeyValue';
        const getAfterHook = (options) => {
            var _a, _b, _c;
            const feature = upload_file_feature_1.default(options)({});
            return (_c = (_b = (_a = feature.actions) === null || _a === void 0 ? void 0 : _a.show) === null || _b === void 0 ? void 0 : _b.after) === null || _c === void 0 ? void 0 : _c[0];
        };
        it('fills record with the path', async () => {
            const response = { record: { params: {
                        [properties.key]: key,
                    } } };
            const fillPath = getAfterHook({ provider, properties });
            const ret = await fillPath(response, {}, {});
            chai_1.expect(provider.path).to.have.been.calledWith(key, provider.bucket);
            chai_1.expect(ret.record.params[properties.filePath]).to.equal(resolvedS3Path);
        });
        it('gets bucket from the record when it is present', async () => {
            const bucket = 'some-other-bucket';
            properties.bucket = 'storedBucketProperty';
            const response = { record: { params: {
                        [properties.key]: key,
                        [properties.bucket]: bucket,
                    } } };
            const fillPath = getAfterHook({ provider, properties });
            await fillPath(response, {}, {});
            chai_1.expect(provider.path).to.have.been.calledWith(key, bucket);
        });
        it('does nothing when path is not present', async () => {
            const response = { record: { params: {
                        name: 'some value',
                    } } };
            const fillPath = getAfterHook({ provider, properties });
            const ret = await fillPath(response, {}, {});
            chai_1.expect(ret).to.deep.eq(response);
            chai_1.expect(provider.path).to.not.have.been.called;
        });
    });
});
