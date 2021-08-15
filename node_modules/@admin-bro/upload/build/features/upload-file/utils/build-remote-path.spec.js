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
Object.defineProperty(exports, "__esModule", { value: true });
const admin_bro_1 = require("admin-bro");
const chai_1 = require("chai");
const sinon_1 = __importStar(require("sinon"));
const build_remote_path_1 = require("./build-remote-path");
describe('buildPath', () => {
    let recordStub;
    const recordId = '1';
    const File = {
        name: 'some-name.pdf',
        path: '/some-path.pdf',
        size: 111,
        type: 'txt',
    };
    after(() => {
        sinon_1.default.restore();
    });
    before(() => {
        recordStub = sinon_1.createStubInstance(admin_bro_1.BaseRecord, {
            id: sinon_1.default.stub().returns(recordId),
            isValid: sinon_1.default.stub().returns(true),
            update: sinon_1.default.stub().returnsThis(),
        });
        recordStub.params = {};
    });
    it('returns default path when no custom function is given', () => {
        chai_1.expect(build_remote_path_1.buildRemotePath(recordStub, File)).to.equal(`${recordId}/${File.name}`);
    });
    it('returns default custom path when function is given', () => {
        const newPath = '1/1/filename';
        const fnStub = sinon_1.default.stub().returns(newPath);
        const path = build_remote_path_1.buildRemotePath(recordStub, File, fnStub);
        chai_1.expect(path).to.equal(newPath);
        chai_1.expect(fnStub).to.have.been.calledWith(recordStub, File.name);
    });
});
