"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const base_provider_1 = require("../providers/base-provider");
const stubProvider = (resolvedS3Path) => {
    const resolvedPath = resolvedS3Path || '/someS3Path.png';
    class StubProvider extends base_provider_1.BaseProvider {
        constructor() {
            super(...arguments);
            this.path = sinon_1.default.stub().resolves(resolvedPath);
            this.upload = sinon_1.default.stub().resolves(resolvedPath);
            this.delete = sinon_1.default.stub().resolves(resolvedPath);
        }
    }
    return new StubProvider('bucketName');
};
exports.default = stubProvider;
