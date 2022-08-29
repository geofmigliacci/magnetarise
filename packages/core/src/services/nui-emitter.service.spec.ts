import { NuiEmitter } from "./nui-emitter.service";

describe('NuiEmitter', () => {
  const globals: any = global;
  let nuiEmitter: NuiEmitter;

  beforeAll(() => {
    globals.SendNuiMessage = jest.fn((data: unknown) => { });
  });

  beforeEach(() => {
    nuiEmitter = new NuiEmitter();
  });

  describe('emit', () => {
    it('should emit eventName', () => {
      const spy = jest.spyOn(globals, 'SendNuiMessage');
      nuiEmitter.emit({
        object: 'myobject'
      });
      expect(spy).toHaveBeenCalledWith(JSON.stringify(
        {
          object: 'myobject'
        }
      ));
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
