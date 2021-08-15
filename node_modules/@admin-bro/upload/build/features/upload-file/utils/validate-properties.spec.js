"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const validate_properties_1 = require("./validate-properties");
describe('hasDuplicatedProperties', () => {
    it('does not throw an all properties have different values', () => {
        chai_1.expect(validate_properties_1.hasDuplicatedProperties({
            key: 'sameValue',
            file: 'otherValue',
        })).to.be.false;
    });
    it('throws an error when 2 properties have the same values', () => {
        const duplicates = validate_properties_1.hasDuplicatedProperties({
            key: 'sameValue',
            file: 'sameValue',
        });
        chai_1.expect(duplicates).not.to.be.false;
    });
});
describe('validatePropertiesGlobally', () => {
    it('shows errors for a second invocation', () => {
        const context = [
            { properties: { key: 'sameValue', file: 'otherValue' } },
            { properties: { key: 'sameValue', file: 'otherValue' } },
        ];
        const duplicates = validate_properties_1.validatePropertiesGlobally(context);
        chai_1.expect(duplicates).to.have.lengthOf(2);
    });
});
