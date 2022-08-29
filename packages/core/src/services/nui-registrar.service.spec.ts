import { NuiReturnCallback } from '../types';
import { NuiRegistrar } from './nui-registrar.service';

describe('NuiRegistrar', () => {
  const globals: any = global;
  let nuiRegistrar: NuiRegistrar;

  beforeAll(() => {
    globals.on = jest.fn((eventName: string, listener: Function) => {});
    globals.RegisterNuiCallbackType = jest.fn((callbackType: string) => {});
  });

  beforeEach(() => {
    nuiRegistrar = new NuiRegistrar();
  });

  describe('on', () => {
    it('should register eventName', () => {
      const spyOn = jest.spyOn(globals, 'on');
      const spyRegisterNuiCallbackType = jest.spyOn(globals, 'RegisterNuiCallbackType');
      const listener = (data: unknown, nuiCallback: NuiReturnCallback) => {
        nuiCallback({
          response: 200
        });
      };
      nuiRegistrar.on('eventName', listener);
      expect(spyRegisterNuiCallbackType).toHaveBeenCalledWith('eventName');
      expect(spyOn).toHaveBeenCalledWith('__cfx_nui:eventName', listener);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
