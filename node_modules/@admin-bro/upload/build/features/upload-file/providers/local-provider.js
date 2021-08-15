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
exports.LocalProvider = void 0;
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
const base_provider_1 = require("./base-provider");
class LocalProvider extends base_provider_1.BaseProvider {
    constructor(options) {
        super(options.bucket);
        if (!fs_1.existsSync(options.bucket)) {
            throw new Error(constants_1.ERROR_MESSAGES.NO_DIRECTORY(options.bucket));
        }
    }
    async upload(file, key) {
        const filePath = this.path(key);
        await fs_1.default.promises.mkdir(path_1.default.dirname(filePath), { recursive: true });
        await fs_1.default.promises.rename(file.path, filePath);
    }
    async delete(key, bucket) {
        await fs_1.default.promises.unlink(this.path(key, bucket));
    }
    // eslint-disable-next-line class-methods-use-this
    path(key, bucket) {
        return `/${path_1.default.join(bucket || this.bucket, key)}`;
    }
}
exports.LocalProvider = LocalProvider;
