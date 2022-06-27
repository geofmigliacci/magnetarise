import 'reflect-metadata';
import { ExecutionContext } from '../../src/contexts';
import { UseGuards } from '../../src/decorators';
import { GUARDS_METADATA } from '../../src/decorators/contants';
import { CanActivate } from '../../src/interfaces';
import { MetadataScanner } from '../../src/metadata-scanner';

describe('MetadataScanner', () => {
    describe('scanFromPrototype', () => {
        class IsTest implements CanActivate {
            canActivate(context: ExecutionContext): boolean | Promise<boolean> {
                return true;
            }
        }
        
        @UseGuards(IsTest)
        class IsAuthOnly {
            public testParent() { }
        }

        @UseGuards(IsTest, IsTest)
        class IsAuthTwice {
            public testParent() { }
        }

        @UseGuards(IsTest)
        class IsAuthOnMethod {
            @UseGuards(IsTest)
            public testParent() { }
        }

        class Parent {
            constructor() { }
            public testParent() { }
            public testParent2() { }
            get propParent() {
                return '';
            }
            set valParent(value) { }
        }

        class Test extends Parent {
            constructor() {
                super();
            }
            get prop() {
                return '';
            }
            set val(value) { }
            public test() { }
            public test2() { }
        }

        it('should return only methods', () => {
            const methods = MetadataScanner.getMethodNames(
                Test.prototype,
            );
            expect(methods).toEqual(['test', 'test2', 'testParent', 'testParent2']);
        });

        it('should return one IsAuth decorator', () => {
            const metadata = MetadataScanner.getClassMetadata(
                GUARDS_METADATA,
                IsAuthOnly
            );
            expect(metadata).toEqual([ IsTest ]);
        });

        it('should return two IsAuth decorator', () => {
            const metadata = MetadataScanner.getClassMetadata(
                GUARDS_METADATA,
                IsAuthTwice
            );
            expect(metadata).toEqual([ IsTest, IsTest ]);
        });

        it('should return IsAuth decorator on methods', () => {
            const metadata = MetadataScanner.getMethodMetadata(
                GUARDS_METADATA,
                IsAuthOnMethod.prototype,
                'testParent'
            );
            expect(metadata).toEqual([ IsTest ]);
        });
    });
});