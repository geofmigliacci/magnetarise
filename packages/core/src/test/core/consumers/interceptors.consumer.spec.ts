import "reflect-metadata";
import { MagnetariseContainer } from "../../../../src/container";
import { InterceptorsConsumer } from "../../../../src/consumers";
import { Intercept } from "../../../../src/interfaces";

describe('InterceptorsConsumer', () => {
    class MultiplyByTwo implements Intercept {
        in?(...args: any[]): any[] {
            args[0] *= 2;
            return args;
        }

        out?(...args: any[]): any[] {
            args[0] *= 2;
            return args;
        }
    }

    class RemoveOne implements Intercept {
        in?(...args: any[]): any[] {
            args[0] -= 1;
            return args;
        }

        out?(...args: any[]): any[] {
            args[0] -= 1;
            return args;
        }
    }

    beforeAll(() => {
        MagnetariseContainer.interceptors.add(
            MultiplyByTwo,
        );
        MagnetariseContainer.interceptors.add(
            RemoveOne
        );
    });

    describe('inFn', () => {
        it('should create a new inFn', async () => {
            const interceptors = [
                MultiplyByTwo
            ];
    
            const inFn = InterceptorsConsumer.inFn(interceptors);
            expect(inFn).toBeDefined();
        });
    
        it('should returns 4', async () => {
            const interceptors = [
                MultiplyByTwo
            ];
    
            const inFn = InterceptorsConsumer.inFn(interceptors);
            expect(await inFn(2)).toEqual([4]);
        });
    
        it('should returns 8', async () => {
            const interceptors = [
                MultiplyByTwo,
                MultiplyByTwo,
            ];
    
            const inFn = InterceptorsConsumer.inFn(interceptors);
            expect(await inFn(2)).toEqual([8]);
        });
    });

    describe('outFn', () => {
        it('should create a new outFn', async () => {
            const interceptors = [
                MultiplyByTwo
            ];
    
            const outFn = InterceptorsConsumer.outFn(interceptors);
            expect(outFn).toBeDefined();
        });

        it('should returns 4', async () => {
            const interceptors = [
                MultiplyByTwo,
            ];
    
            const outFn = InterceptorsConsumer.outFn(interceptors);
            expect(await outFn(2)).toEqual([4]);
        });
    
        it('should returns 8', async () => {
            const interceptors = [
                MultiplyByTwo,
                MultiplyByTwo,
            ];
    
            const outFn = InterceptorsConsumer.outFn(interceptors);
            expect(await outFn(2)).toEqual([8]);
        });
    });
    
    it('should pickResult from Promise', async () => {
        const result = await InterceptorsConsumer.pickResult(new Promise((resolve) => {
            resolve([42]);
        }));
        expect(result).toEqual([42]);
    });

    it('should pickResult from simple type', async () => {
        const result = await InterceptorsConsumer.pickResult([42]);
        expect(result).toEqual([42]);
    });

    it('should create generate interceptors', async () => {
        const inFnSpy = jest.spyOn(InterceptorsConsumer, 'inFn');
        const outFnSpy = jest.spyOn(InterceptorsConsumer, 'outFn');
        InterceptorsConsumer.generate();
        expect(inFnSpy).toHaveBeenCalledWith([
            RemoveOne,
            MultiplyByTwo,
        ]);

        expect(outFnSpy).toHaveBeenCalledWith([
            MultiplyByTwo,
            RemoveOne,
        ]);
        expect(InterceptorsConsumer.interceptIn).toBeDefined();
        expect(InterceptorsConsumer.interceptOut).toBeDefined();
    });
});