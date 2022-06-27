import {
    isConstructor,
    isEmpty,
    isFunction,
    isNil,
    isNumber,
    isObject,
    isPlainObject,
    isString,
    isSymbol,
    isUndefined,
} from '../../../../src/utils';

function Foo(a) {
    this.a = 1;
}

describe('Shared utils', () => {
    describe('isUndefined', () => {
        it('should return true when obj is undefined', () => {
            expect(isUndefined(undefined)).toBeTruthy();
        });
        it('should return false when object is not undefined', () => {
            expect(isUndefined({})).toBeFalsy();
        });
    });

    describe('isFunction', () => {
        it('should return true when obj is function', () => {
            expect(isFunction(() => ({}))).toBeTruthy();
        });
        it('should return false when object is not function', () => {
            expect(isFunction(null)).toBeFalsy();
            expect(isFunction(undefined)).toBeFalsy();
        });
    });

    describe('isObject', () => {
        it('should return true when obj is object', () => {
            expect(isObject({})).toBeTruthy();
        });
        it('should return false when object is not object', () => {
            expect(isObject(3)).toBeFalsy();
            expect(isObject(null)).toBeFalsy();
            expect(isObject(undefined)).toBeFalsy();
        });
    });

    describe('isPlainObject', () => {
        it('should return true when obj is plain object', () => {
            expect(isPlainObject({})).toBeTruthy();
            expect(isPlainObject({ prop: true })).toBeTruthy();
            expect(
                isPlainObject({
                    constructor: Foo,
                }),
            ).toBeTruthy();
            expect(isPlainObject(Object.create(null))).toBeTruthy();
        });
        it('should return false when object is not object', () => {
            expect(isPlainObject(3)).toBeFalsy();
            expect(isPlainObject(null)).toBeFalsy();
            expect(isPlainObject(undefined)).toBeFalsy();
            expect(isPlainObject([1, 2, 3])).toBeFalsy();
            expect(isPlainObject(new Date())).toBeFalsy();
            expect(isPlainObject(new Foo(1))).toBeFalsy();
        });
    });

    describe('isString', () => {
        it('should return true when val is a string', () => {
            expect(isString('true')).toBeTruthy();
        });
        it('should return false when val is not a string', () => {
            expect(isString(new String('fine'))).toBeFalsy();
            expect(isString(false)).toBeFalsy();
            expect(isString(null)).toBeFalsy();
            expect(isString(undefined)).toBeFalsy();
        });
    });

    describe('isSymbol', () => {
        it('should return true when val is a Symbol', () => {
            expect(isSymbol(Symbol())).toBeTruthy();
        });
        it('should return false when val is not a symbol', () => {
            expect(isSymbol('Symbol()')).toBeFalsy();
            expect(isSymbol(false)).toBeFalsy();
            expect(isSymbol(null)).toBeFalsy();
            expect(isSymbol(undefined)).toBeFalsy();
        });
    });

    describe('isNumber', () => {
        it('should return true when val is a number or NaN', () => {
            expect(isNumber(1)).toBeTruthy();
            expect(isNumber(1.23)).toBeTruthy(); // with decimals
            expect(isNumber(123e-5)).toBeTruthy(); // scientific (exponent) notation
            expect(isNumber(0o1)).toBeTruthy(); // octal notation
            expect(isNumber(0b1)).toBeTruthy(); // binary notation
            expect(isNumber(0x1)).toBeTruthy(); // hexadecimal notation
            expect(isNumber(NaN)).toBeTruthy();
        });
        it('should return false when val is not a number', () => {
            // expect(isNumber(1n)).toBeFalsy(); // big int (available on ES2020)
            expect(isNumber('1')).toBeFalsy(); // string
            expect(isNumber(undefined)).toBeFalsy(); // nullish
            expect(isNumber(null)).toBeFalsy(); // nullish
        });
    });

    describe('isConstructor', () => {
        it('should return true when string is equal to constructor', () => {
            expect(isConstructor('constructor')).toBeTruthy();
        });
        it('should return false when string is not equal to constructor', () => {
            expect(isConstructor('nope')).toBeFalsy();
        });
    });

    describe('isNil', () => {
        it('should return true when obj is undefined or null', () => {
            expect(isNil(undefined)).toBeTruthy();
            expect(isNil(null)).toBeTruthy();
        });
        it('should return false when object is not undefined and null', () => {
            expect(isNil('3')).toBeFalsy();
        });
    });

    describe('isEmpty', () => {
        it('should return true when array is empty or not exists', () => {
            expect(isEmpty([])).toBeTruthy();
            expect(isEmpty(null)).toBeTruthy();
            expect(isEmpty(undefined)).toBeTruthy();
        });
        it('should return false when array is not empty', () => {
            expect(isEmpty([1, 2])).toBeFalsy();
        });
    });
});