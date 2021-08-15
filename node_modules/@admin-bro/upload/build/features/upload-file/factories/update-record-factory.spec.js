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
const chai_1 = require("chai");
const update_record_factory_1 = require("./update-record-factory");
const stub_provider_1 = __importDefault(require("../spec/stub-provider"));
const constants_1 = require("../constants");
describe('updateRecordFactory', () => {
    const request = { method: 'post' };
    let response;
    let actionContext;
    let provider;
    let recordStub;
    let uploadOptions;
    let updateRecord;
    const resolvedS3Path = 'resolvedS3Path';
    const expectedKey = '1/some-name.pdf';
    const File = {
        name: 'some-name.pdf',
        path: 'path/some-name.pdf',
        size: 111,
        type: 'txt',
    };
    beforeEach(() => {
        provider = stub_provider_1.default(resolvedS3Path);
        response = { record: { params: {
                    name: 'some value',
                } } };
        uploadOptions = {
            properties: {
                key: 's3Key',
                filePath: 'resolvedPath',
                file: 'file',
                filesToDelete: 'fileToDelete',
            },
            provider: {
                aws: { bucket: 'any' },
            }
        };
        recordStub = sinon_1.createStubInstance(admin_bro_1.BaseRecord, {
            id: sinon_1.default.stub().returns('1'),
            isValid: sinon_1.default.stub().returns(true),
            update: sinon_1.default.stub().returnsThis(),
        });
        recordStub.params = {};
    });
    afterEach(() => {
        sinon_1.default.restore();
        sinon_1.default.reset();
    });
    it('does nothing when request is get', async () => {
        updateRecord = update_record_factory_1.updateRecordFactory(uploadOptions, provider);
        const ret = await updateRecord(response, { method: 'get', record: recordStub }, {});
        chai_1.expect(ret).to.deep.eq(response);
    });
    context('property.file is set in the context to single file', () => {
        beforeEach(() => {
            uploadOptions.properties.file = 'uploadedFile';
            uploadOptions.properties.bucket = 'bucketProp';
            uploadOptions.properties.size = 'sizeProp';
            uploadOptions.properties.mimeType = 'mimeTypeProp';
            uploadOptions.properties.filename = 'filenameProp';
            File.name = expectedKey;
            actionContext = {
                record: recordStub,
                [constants_1.CONTEXT_NAMESPACE]: {
                    [uploadOptions.properties.file]: [File],
                },
            };
            updateRecord = update_record_factory_1.updateRecordFactory(uploadOptions, provider);
        });
        it('uploads file with adapter', async () => {
            await updateRecord(response, request, actionContext);
            chai_1.expect(provider.upload).to.have.been.calledWith(File);
        });
        it('updates all fields in the record', async () => {
            await updateRecord(response, request, actionContext);
            chai_1.expect(recordStub.update).to.have.been.calledWith(sinon_1.default.match({
                [uploadOptions.properties.key]: expectedKey,
                [uploadOptions.properties.bucket]: provider.bucket,
                [uploadOptions.properties.size]: File.size.toString(),
                [uploadOptions.properties.mimeType]: File.type,
                [uploadOptions.properties.filename]: File.name,
            }));
        });
        it('does not delete any old file if there were not file before', async () => {
            await updateRecord(response, request, actionContext);
            chai_1.expect(provider.delete).not.to.have.been.called;
        });
        it('removes old file when there was file before', async () => {
            const oldKey = 'some-old-key.txt';
            const oldBucket = 'oldBucket';
            recordStub.params[uploadOptions.properties.key] = oldKey;
            recordStub.params[uploadOptions.properties.bucket] = oldBucket;
            await updateRecord(response, request, actionContext);
            chai_1.expect(provider.delete).to.have.been.calledWith(oldKey, oldBucket);
        });
        it('does not remove old file when it had the same key', async () => {
            recordStub.params[uploadOptions.properties.key] = expectedKey;
            await updateRecord(response, request, actionContext);
            chai_1.expect(provider.delete).not.to.have.been.called;
        });
        it('removes old file when property.file is set to null', async () => {
            const storedBucket = 'bucketProp';
            recordStub.get.onCall(0).returns(storedBucket);
            recordStub.get.onCall(1).returns(expectedKey);
            actionContext[constants_1.CONTEXT_NAMESPACE][uploadOptions.properties.file] = null;
            await updateRecord(response, request, actionContext);
            chai_1.expect(provider.upload).not.to.have.been.called;
            chai_1.expect(provider.delete).to.have.been.calledWith(expectedKey, storedBucket);
            chai_1.expect(recordStub.update).to.have.been.calledWith(sinon_1.default.match({
                [uploadOptions.properties.key]: null,
                [uploadOptions.properties.bucket]: null,
                [uploadOptions.properties.size]: null,
                [uploadOptions.properties.mimeType]: null,
                [uploadOptions.properties.filename]: null,
            }));
        });
    });
    context('property.file is set in the context to multiple files', () => {
        const Files = [
            Object.assign(Object.assign({}, File), { name: 'file1.png' }),
            Object.assign(Object.assign({}, File), { name: 'file2.png' }),
            Object.assign(Object.assign({}, File), { name: 'file3.png' }),
        ];
        beforeEach(() => {
            uploadOptions.multiple = true;
            uploadOptions.properties.file = 'media.file';
            uploadOptions.properties.bucket = 'media.bucket';
            uploadOptions.properties.size = 'media.size';
            uploadOptions.properties.mimeType = 'media.mimeType';
            uploadOptions.properties.filename = 'media.filename';
            actionContext = {
                [constants_1.CONTEXT_NAMESPACE]: {
                    [uploadOptions.properties.file]: Files,
                },
                record: recordStub,
            };
            updateRecord = update_record_factory_1.updateRecordFactory(uploadOptions, provider);
        });
        it('uploads multiple files with adapter', async () => {
            await updateRecord(response, request, actionContext);
            chai_1.expect(provider.upload).to.have.callCount(3);
        });
        it('updates all fields in the record', async () => {
            await updateRecord(response, request, actionContext);
            const values = (index) => ({
                [`${uploadOptions.properties.key}.${index}`]: `${recordStub.id()}/${Files[index].name}`,
                [`${uploadOptions.properties.bucket}.${index}`]: provider.bucket,
                [`${uploadOptions.properties.size}.${index}`]: Files[index].size,
                [`${uploadOptions.properties.mimeType}.${index}`]: Files[index].type,
                [`${uploadOptions.properties.filename}.${index}`]: Files[index].name,
            });
            chai_1.expect(recordStub.update).to.have.been.calledWith(sinon_1.default.match(Object.assign(Object.assign(Object.assign({}, values(0)), values(1)), values(2))));
        });
    });
    context('filesToDelete are set in the context to multiple files', () => {
        const fileIndexesToDelete = ['0', '2'];
        const oldParams = {
            'media.key.0': 'key0',
            'media.key.1': 'key1',
            'media.key.2': 'key2',
            'media.bucket.0': 'bucket0',
            'media.bucket.1': 'bucket1',
            'media.bucket.2': 'bucket2',
            'media.type.0': 'mime0',
            'media.type.1': 'mime1',
            'media.type.2': 'mime2',
        };
        beforeEach(() => {
            uploadOptions.multiple = true;
            uploadOptions.properties = {
                file: 'media.file',
                key: 'media.key',
                bucket: 'media.bucket',
                mimeType: 'media.type',
                filesToDelete: 'media.fileToDelete',
                filePath: 'media.filePath',
            };
            actionContext = {
                [constants_1.CONTEXT_NAMESPACE]: {
                    [uploadOptions.properties.filesToDelete]: fileIndexesToDelete,
                },
                record: new admin_bro_1.BaseRecord(oldParams, {}),
            };
            sinon_1.default.stub(admin_bro_1.BaseRecord.prototype, 'update');
            updateRecord = update_record_factory_1.updateRecordFactory(uploadOptions, provider);
        });
        it('removes files from the database', async () => {
            await updateRecord(response, request, actionContext);
            chai_1.expect(admin_bro_1.BaseRecord.prototype.update).to.have.been.calledWith({
                'media.key.0': 'key1',
                'media.bucket.0': 'bucket1',
                'media.type.0': 'mime1',
            });
        });
        it('removes files from the adapter store', async () => {
            await updateRecord(response, request, actionContext);
            chai_1.expect(provider.delete).to.have.callCount(2);
            chai_1.expect(provider.delete).to.have.been.calledWith('key0', 'bucket0');
            chai_1.expect(provider.delete).to.have.been.calledWith('key2', 'bucket2');
        });
    });
});
