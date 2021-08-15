"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const constants_1 = require("../constants");
const strip_payload_factory_1 = require("./strip-payload-factory");
describe('stripPayloadFactory', () => {
    let actionContext = {};
    let uploadOptions;
    let stripPayload;
    beforeEach(() => {
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
    });
    context('standard upload payload', () => {
        let payload;
        let newRequest;
        beforeEach(async () => {
            actionContext = {};
            payload = {
                [uploadOptions.properties.filePath]: 'somePath',
                [uploadOptions.properties.file]: 'someFile',
                [uploadOptions.properties.filesToDelete]: 'someFile',
            };
            stripPayload = strip_payload_factory_1.stripPayloadFactory(uploadOptions);
            newRequest = await stripPayload({ payload, method: 'post' }, actionContext);
        });
        it('removes file, fileToDelete and filePath from the payload', () => {
            chai_1.expect(newRequest.payload).not.to.have.keys(uploadOptions.properties.filePath, uploadOptions.properties.file, uploadOptions.properties.filesToDelete);
        });
        it('moves file and fileToDelete to the context', () => {
            chai_1.expect(actionContext[constants_1.CONTEXT_NAMESPACE]).to.contains.keys({
                [uploadOptions.properties.file]: payload[uploadOptions.properties.file],
                [uploadOptions.properties.filesToDelete]: payload[uploadOptions.properties.filesToDelete],
            });
        });
        it('throws error when user wants to use the same properties twice', async () => {
            try {
                await stripPayload({ payload, method: 'post' }, actionContext);
            }
            catch (error) {
                chai_1.expect(error).not.to.be.undefined;
                return undefined;
            }
            throw new Error();
        });
        it('fills context with invocations for each run', async () => {
            uploadOptions = Object.assign(Object.assign({}, uploadOptions), { properties: {
                    key: 's3Key2',
                    filePath: 'resolvedPath2',
                    file: 'file2',
                    filesToDelete: 'fileToDelete2',
                } });
            stripPayload = strip_payload_factory_1.stripPayloadFactory(uploadOptions);
            await stripPayload({ payload, method: 'post' }, actionContext);
            chai_1.expect(actionContext[constants_1.CONTEXT_NAMESPACE].__invocations).to.have.lengthOf(2);
        });
    });
});
