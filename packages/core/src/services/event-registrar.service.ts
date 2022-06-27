import { Injectable } from '../decorators';
import { EventCallback } from '../types';
import { isNativeEvent } from '../utils';

@Injectable()
export class EventRegistrar {
  private _eventCallbacks: Map<string, EventCallback> = new Map<
    string,
    EventCallback
  >();

  /**
   * This declares a net event to be called over the network with {@link EventEmitter~EmitNet}.
   *
   * @example
   * `this.eventRegistrar.OnNet('eventName', () => {
   *      console.log('eventTriggered over network');
   * });`
   *
   * @see {@link EventEmitter~EmitNet} to emit a networked event
   * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/onNet-server/}
   * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/onNet-client/}
   *
   * @param eventName eventName to register the callback
   * @param callback callback that will be called when the event is triggered
   */
  onNet(eventName: string, callback: EventCallback): void {
    if (isNativeEvent(eventName)) {
      onNet(eventName, callback);
    } else {
      onNet(`Magnetarise:${eventName}`, callback);
    }
  }

  /**
   * This declares an event to be called with {@link EventEmitter~Emit}.
   *
   * @example
   * `this.eventRegistrar.On('eventName', () => {
   *      console.log('eventTriggered locally');
   * });`
   *
   * @see {@link EventEmitter~Emit} to Emit a local event
   * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/on-server/}
   * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/on-client/}
   *
   * @param eventName eventName to register the callback
   * @param callback callback that will be called when the event is triggered
   */
  on(eventName: string, callback: EventCallback): void {
    if (isNativeEvent(eventName)) {
      on(eventName, callback);
    } else {
      on(`Magnetarise:${eventName}`, callback);
    }
  }
}
