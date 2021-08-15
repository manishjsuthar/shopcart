"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = void 0;
const local_provider_1 = require("../providers/local-provider");
const gcp_provider_1 = require("../providers/gcp-provider");
const aws_provider_1 = require("../providers/aws-provider");
const constants_1 = require("../constants");
exports.getProvider = (options) => {
    if (!options) {
        throw new Error(constants_1.ERROR_MESSAGES.NO_PROVIDER);
    }
    // when someone passes its own implementation as options
    if (options.name === 'BaseProvider') {
        return {
            name: 'base',
            provider: options,
        };
    }
    const givenProviders = Object.keys(options);
    if (givenProviders.length !== 1) {
        throw new Error(constants_1.ERROR_MESSAGES.WRONG_PROVIDER_OPTIONS);
    }
    const providerName = givenProviders[0];
    const providerOptions = options[providerName];
    const providerMap = {
        aws: () => new aws_provider_1.AWSProvider(providerOptions),
        gcp: () => new gcp_provider_1.GCPProvider(providerOptions),
        local: () => new local_provider_1.LocalProvider(providerOptions),
        base: () => providerOptions,
    };
    const provider = providerMap[providerName]();
    if (!provider) {
        throw new Error(constants_1.ERROR_MESSAGES.NO_PROVIDER);
    }
    return {
        provider,
        name: providerName,
    };
};
