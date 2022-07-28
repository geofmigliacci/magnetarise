import { EventEmitter } from './event-emitter.service';

describe('EventEmitter', () => {
  describe('server', () => {
    const globals: any = global;
    let eventEmitter: EventEmitter;

    beforeAll(() => {
      globals.IsDuplicityVersion = jest.fn(() => true);
      globals.emitNet = jest.fn((eventName: string, ...args: any[]) => {});
      globals.emit = jest.fn((eventName: string, ...args: any[]) => {});
    });

    beforeEach(() => {
      eventEmitter = new EventEmitter();
    });

    describe('emit', () => {
      it('should emit eventName', () => {
        const spy = jest.spyOn(globals, 'emit');
        eventEmitter.emit('eventName', 1, 2, 3);
        expect(spy).toHaveBeenCalledWith('Magnetarise:eventName', 1, 2, 3);
      });
    });

    describe('emitNet', () => {
      it('should emitNet eventName', () => {
        const spy = jest.spyOn(globals, 'emit');
        eventEmitter.emitNet('eventName', 1, 2, 3);
        expect(spy).toHaveBeenCalledWith('Magnetarise:eventName', 1, 2, 3);
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });
  });

  describe('client', () => {
    const globals: any = global;
    let eventEmitter: EventEmitter;

    beforeAll(() => {
      globals.IsDuplicityVersion = jest.fn(() => false);
      globals.emitNet = jest.fn((eventName: string, ...args: any[]) => {});
      globals.emit = jest.fn((eventName: string, ...args: any[]) => {});
    });

    beforeEach(() => {
      eventEmitter = new EventEmitter();
    });

    describe('emit', () => {
      it('should emit eventName', () => {
        const spy = jest.spyOn(globals, 'emit');
        eventEmitter.emit('eventName', 1, 2, 3);
        expect(spy).toHaveBeenCalledWith('Magnetarise:eventName', 1, 2, 3);
      });
    });

    describe('emitNet', () => {
      it('should emitNet eventName', () => {
        const spy = jest.spyOn(globals, 'emit');
        eventEmitter.emitNet('eventName', 1, 2, 3);
        expect(spy).toHaveBeenCalledWith('Magnetarise:eventName', 1, 2, 3);
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });
  });
});

