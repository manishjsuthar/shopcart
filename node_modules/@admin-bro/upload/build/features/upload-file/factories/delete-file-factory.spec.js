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
const admin_bro_1 = require("admin-bro");
const sinon_1 = __importStar(require("sinon"));
const chai_1 = __importStar(require("chai"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
const delete_file_factory_1 = require("./delete-file-factory");
const stub_provider_1 = __importDefault(require("../spec/stub-provider"));
chai_1.default.use(sinon_chai_1.default);
describe('deleteFileFactory', () => {
    const response = {};
    const request = {};
    const context = {};
    let provider;
    let record;
    let uploadOptions;
    before(() => {
        provider = stub_provider_1.default();
        uploadOptions = {
            properties: {
                key: 's3Key',
                filePath: 'resolvedPath',
                file: 'file',
                bucket: 'bucket',
                filesToDelete: 'fileToDelete',
            },
            provider: {
                aws: { bucket: 'any' },
            }
        };
        record = sinon_1.createStubInstance(admin_bro_1.BaseRecord, {
            id: sinon_1.default.stub().returns('1'),
            isValid: sinon_1.default.stub().returns(true),
            update: sinon_1.default.stub().returnsThis(),
            get: sinon_1.default.stub(),
        });
        context.record = record;
    });
    afterEach(() => {
        sinon_1.default.reset();
    });
    it('does nothing when file has not been uploaded', () => {
        const deleteFile = delete_file_factory_1.deleteFileFactory(uploadOptions, provider);
        deleteFile(response, request, context);
        chai_1.expect(provider.delete).not.to.have.been.called;
    });
    it('deletes file when one was uploaded with the bucket from the db', () => {
        const [path, bucket] = ['file-to-delete-path', 'file-to-delete-bucket'];
        record.get.onCall(0).returns(path);
        record.get.onCall(1).returns(bucket);
        const deleteFile = delete_file_factory_1.deleteFileFactory(uploadOptions, provider);
        deleteFile(response, request, context);
        chai_1.expect(provider.delete).to.have.been.calledWith(path, bucket);
    });
    it('deletes file when one was uploaded with the bucket from provider', () => {
        const [path, bucketFromProvider] = ['file-to-delete-path', undefined];
        record.get.onCall(0).returns(path);
        record.get.onCall(1).returns(bucketFromProvider);
        const deleteFile = delete_file_factory_1.deleteFileFactory(uploadOptions, provider);
        deleteFile(response, request, context);
        chai_1.expect(provider.delete).to.have.been.calledWith(path, provider.bucket);
    });
    it('deletes multiple files when `multiple` option has been selected', () => {
        uploadOptions.multiple = true;
        const paths = ['path1', 'path2'];
        const buckets = ['bucket1'];
        record.get.onCall(0).returns(paths);
        record.get.onCall(1).returns(buckets);
        const deleteFile = delete_file_factory_1.deleteFileFactory(uploadOptions, provider);
        deleteFile(response, request, context);
        chai_1.expect(provider.delete).to.have.callCount(2);
        chai_1.expect(provider.delete).to.have.been.calledWith(paths[0], buckets[0]);
        chai_1.expect(provider.delete).to.have.been.calledWith(paths[1], provider.bucket);
    });
});
