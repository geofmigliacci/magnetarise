import "reflect-metadata";
import { EventEmitter } from "../../../../src/services";

describe('Reflector', () => {
    const globals: any = global;
    let eventEmitter: EventEmitter;

    beforeAll(() => {
        globals.emitNet = jest.fn((eventName: string, ...args: any[]) => { });
        globals.emit = jest.fn((eventName: string, ...args: any[]) => { });
    })

    beforeEach(() => {
        eventEmitter = new EventEmitter();
    });

    describe('on', () => {
        it('should register eventName', () => {
            const spy = jest.spyOn(globals, 'emit');
            eventEmitter.emit('eventName', 1, 2, 3);
            expect(spy).toHaveBeenCalledWith('Magnetarise:eventName', 1, 2, 3);
        });

        it('should register onResourceStop', () => {
            const spy = jest.spyOn(globals, 'emit');
            eventEmitter.emit('onResourceStop', 1, 2, 3);
            expect(spy).toHaveBeenCalledWith('onResourceStop', 1, 2, 3);
        });
    });

    describe('onNet', () => {
        it('should register eventName', () => {
            const spy = jest.spyOn(globals, 'emit');
            eventEmitter.emitNet('eventName', 1, 2, 3);
            expect(spy).toHaveBeenCalledWith('Magnetarise:eventName', 1, 2, 3);
        });

        it('should register onResourceStop', () => {
            const spy = jest.spyOn(globals, 'emit');
            eventEmitter.emitNet('onResourceStop', 1, 2, 3);
            expect(spy).toHaveBeenCalledWith('onResourceStop', 1, 2, 3);
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});