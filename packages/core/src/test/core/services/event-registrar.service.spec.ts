import "reflect-metadata";
import { EventRegistrar } from "packages/core/src/services";

describe('Reflector', () => {
    const globals: any = global;
    let eventRegistrar: EventRegistrar;

    beforeAll(() => {
        globals.on = jest.fn((eventName: string, listener: Function) => { });
        globals.onNet = jest.fn((eventName: string, listener: Function) => { });
    })

    beforeEach(() => {
        eventRegistrar = new EventRegistrar();
    });

    describe('on', () => {
        it('should register eventName', () => {
            const spy = jest.spyOn(globals, 'on');
            const listener = (eventName: string, source: number, argument: number) => { };
            eventRegistrar.on('eventName', listener);
            expect(spy).toHaveBeenCalledWith('Magnetarise:eventName', listener);
        });

        it('should register onResourceStop', () => {
            const spy = jest.spyOn(globals, 'on');
            const listener = (eventName: string, source: number, argument: number) => { };
            eventRegistrar.on('onResourceStop', listener);
            expect(spy).toHaveBeenCalledWith('onResourceStop', listener);
        });
    });

    describe('onNet', () => {
        it('should register eventName', () => {
            const spy = jest.spyOn(globals, 'onNet');
            const listener = (eventName: string, source: number, argument: number) => { };
            eventRegistrar.onNet('eventName', listener);
            expect(spy).toHaveBeenCalledWith('Magnetarise:eventName', listener);
        });

        it('should register onResourceStop', () => {
            const spy = jest.spyOn(globals, 'onNet');
            const listener = (eventName: string, source: number, argument: number) => { };
            eventRegistrar.onNet('onResourceStop', listener);
            expect(spy).toHaveBeenCalledWith('onResourceStop', listener);
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});