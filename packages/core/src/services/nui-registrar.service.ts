import { Injectable } from '../decorators';
import { NuiCallback } from '../types';

@Injectable()
export class NuiRegistrar {
  /**
   * Register an NUI callback
   * 
   * @param eventName eventName to be registered
   * @param nuiCallback callback that will be called when the event is triggered
   */
  on(eventName: string, nuiCallback: NuiCallback): void {
    RegisterNuiCallbackType(eventName);
    on(`__cfx_nui:${eventName}`, nuiCallback);
  }
}
