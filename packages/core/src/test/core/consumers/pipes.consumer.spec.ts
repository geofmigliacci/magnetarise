import "reflect-metadata";
import { InjectionToken } from "tsyringe";
import { PipesConsumer } from "../../../../src/consumers";
import { ExecutionContext } from "../../../../src/contexts";
import { PipeTransform } from "../../../../src/interfaces";

describe('PipesConsumer', () => {
    class MultiplyByTwo implements PipeTransform {
        transform(context: ExecutionContext, value: any) {
            return value * 2;
        }
    }

    class MultiplyByTen implements PipeTransform {
        transform(context: ExecutionContext, value: any) {
            return value * 10;
        }
    }

    class PromiseZero implements PipeTransform {
        transform(context: ExecutionContext, value: any) {
            return new Promise((resolve) => {
                resolve(0);
            });
        }
    }

    it('should create a new pipesFn', async () => {
        const pipesMetadata = new Map<number, InjectionToken[]>([
            [0, [MultiplyByTwo, MultiplyByTwo]],
        ]) ;
        
        const pipesFn = PipesConsumer.pipesFn(pipesMetadata);
        expect(pipesFn).toBeDefined();
    });

    it('should return 4 after pipes', async () => {
        const pipesMetadata = new Map<number, InjectionToken[]>([
            [2, [MultiplyByTwo, MultiplyByTwo]],
        ]) ;
        
        const executionContext = new ExecutionContext(
            [
                'eventName',
                1,
                1,
            ]
        );
        const pipesFn = PipesConsumer.pipesFn(pipesMetadata);
        expect((await pipesFn(executionContext)).getArgByIndex(2)).toEqual(4);
    });

    it('should return 20 after pipes', async () => {
        const pipesMetadata = new Map<number, InjectionToken[]>([
            [2, [MultiplyByTwo, MultiplyByTen]],
        ]) ;
        
        const executionContext = new ExecutionContext(
            [
                'eventName',
                1,
                1,
            ]
        );
        const pipesFn = PipesConsumer.pipesFn(pipesMetadata);
        expect((await pipesFn(executionContext)).getArgByIndex(2)).toEqual(20);
    });

    it('should return 0 after pipes with a Promise', async () => {
        const pipesMetadata = new Map<number, InjectionToken[]>([
            [2, [MultiplyByTwo, MultiplyByTen, PromiseZero]],
        ]) ;
        
        const executionContext = new ExecutionContext(
            [
                'eventName',
                1,
                1,
            ]
        );
        const pipesFn = PipesConsumer.pipesFn(pipesMetadata);
        expect((await pipesFn(executionContext)).getArgByIndex(2)).toEqual(0);
    });

    it('should pickResult from Promise', async () => {
        const result = await PipesConsumer.pickResult(new Promise((resolve) => {
            resolve(42);
        }));
        expect(result).toEqual(42);
    });

    it('should pickResult from simple type', async () => {
        const result = await PipesConsumer.pickResult(42);
        expect(result).toEqual(42);
    });
});