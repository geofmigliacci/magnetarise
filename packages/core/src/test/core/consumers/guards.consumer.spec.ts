import "reflect-metadata";
import { GuardsConsumer } from "../../../../src/consumers";
import { ExecutionContext } from "../../../../src/contexts";
import { CanActivate } from "../../../../src/interfaces";

describe('GuardsConsumer', () => {
    class IsTrue implements CanActivate {
        canActivate(context: ExecutionContext): boolean | Promise<boolean> {
            return true;
        }
    }

    class IsFalse implements CanActivate {
        canActivate(context: ExecutionContext): boolean | Promise<boolean> {
            return false;
        }
    }

    it('should create a new guardsFn', async () => {
        const guardsFn = GuardsConsumer.guardsFn([IsTrue]);
        expect(guardsFn).toBeDefined();
    });

    it('should return true', async () => {
        const executionContext = new ExecutionContext(
            [
                'eventName',
                1,
                'argument 1'
            ]
        );
        const guardsFn = GuardsConsumer.guardsFn([IsTrue]);
        expect(await guardsFn(executionContext)).toBeTruthy();
    });

    it('should return false', async () => {
        const executionContext = new ExecutionContext(
            [
                'eventName',
                1,
                'argument 1'
            ]
        );
        const guardsFn = GuardsConsumer.guardsFn([IsFalse]);
        expect(await guardsFn(executionContext)).toBeFalsy();
    });

    it('should return false', async () => {
        const executionContext = new ExecutionContext(
            [
                'eventName',
                1,
                'argument 1'
            ]
        );
        const guardsFn = GuardsConsumer.guardsFn([IsTrue, IsFalse]);
        expect(await guardsFn(executionContext)).toBeFalsy();
    });

    it('should pickResult from Promise', async () => {
        const result = await GuardsConsumer.pickResult(new Promise((resolve) => {
            resolve(true);
        }));
        expect(result).toEqual(true);
    });

    it('should pickResult from simple type', async () => {
        const result = await GuardsConsumer.pickResult(true);
        expect(result).toEqual(true);
    });
});