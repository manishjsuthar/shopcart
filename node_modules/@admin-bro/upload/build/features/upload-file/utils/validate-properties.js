"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePropertiesGlobally = exports.hasDuplicatedProperties = void 0;
const invocationPrefix = (index) => (`__invocation__${index}__`);
/**
 * Checks if values for properties given by the user are different
 *
 * @private
 */
exports.hasDuplicatedProperties = (properties) => {
    // counting how many occurrences of given value are in the keys.
    const mappedFields = Object.keys(properties).reduce((memo, key) => {
        const realKey = key.replace(new RegExp(invocationPrefix('\\d+')), '');
        const keys = memo[properties[key]] ? [...memo[properties[key]].keys, realKey] : [realKey];
        const property = properties[key] ? {
            [properties[key]]: {
                keys,
                value: properties[key],
            }
        } : {};
        return Object.assign(Object.assign({}, memo), property);
    }, {});
    const duplicated = Object.values(mappedFields).filter((value) => value.keys.length > 1);
    if (duplicated.length) {
        return duplicated;
    }
    return false;
};
/**
 * Checks if all properties have uniq names
 */
exports.validatePropertiesGlobally = (globalContext) => {
    // eslint-disable-next-line no-param-reassign
    globalContext = globalContext || [];
    const allInvocationProperties = globalContext.reduce((memo, invocation, index) => (Object.assign(Object.assign({}, (memo)), Object.keys(invocation.properties).reduce((props, key) => (Object.assign(Object.assign({}, props), { [`${invocationPrefix(index)}${key}`]: invocation.properties[key] })), {}))), {});
    return exports.hasDuplicatedProperties(allInvocationProperties);
};
