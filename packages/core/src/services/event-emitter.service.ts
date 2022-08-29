import { InterceptorsConsumer } from '../consumers';
import { Injectable } from '../decorators';
import { MagnetariseApplication } from '../magnetarise-application';
import { EventCallback } from '../types';
import { isInteger, isNativeEvent, isServer } from '../utils';

@Injectable()
export class EventEmitter {
  private _eventCallbacks = new Map<string, EventCallback>();

  /**
   * This trigger a net event over the network registered with {@link EventRegistrar~OnNet}.
   *
   * @example
   * `this.eventEmitter.EmitNet('eventName');`
   * `this.eventEmitter.EmitNet('eventName', 'first argument');`
   * `this.eventEmitter.EmitNet('eventName', 'first argument', 2, 'third argument');`
   * `this.eventEmitter.EmitNet('eventName', 2, 'third argument');` 2 is the source if used server-side
   *
   * @see {@link EventRegistrar~OnNet} to register an net event
   * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emitNet-server/}
   * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emitNet-client/}
   *
   * @param eventName eventName to be triggered
   * @param args args that will be passed to the registered callback if there is one
   */
  async emitNet(eventName: string, ...args: any[]): Promise<void> {
    if(isNativeEvent(eventName)) {
      throw new Error('The event name cannot be a native event');
    }

    if (!args?.length) {
      args = [];
    }

    if (isServer()) {
      if (!args?.length) {
        emitNet(`Magnetarise:${eventName}`, -1);
        return;
      }

      let target = args[0];
      if (!isInteger(target)) {
        throw new Error('The first argument of emitNet must be an integer on the server');
      }

      args = args.slice(1);

      if (MagnetariseApplication.hasInterceptors()) {
        args = await InterceptorsConsumer.interceptOut(...args);
      }

      emitNet(`Magnetarise:${eventName}`, target, ...args);
    } else {
      if (!args?.length) {
        emitNet(`Magnetarise:${eventName}`);
      }

      if (MagnetariseApplication.hasInterceptors()) {
        args = await InterceptorsConsumer.interceptOut(...args);
      }

      emitNet(`Magnetarise:${eventName}`, ...args);
    }
  }

  /**
   * This trigger an event registered with {@link EventRegistrar~On}.
   *
   * @example
   * `this.eventEmitter.Emit('eventName');`
   * `this.eventEmitter.Emit('eventName', 'first argument');`
   * `this.eventEmitter.Emit('eventName', 'first argument', 2, 'third argument');`
   *
   * @see {@link EventRegistrar~On} to register an event
   * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emit-server/}
   * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emit-client/}
   *
   * @param eventName eventName to be triggered
   * @param args args that will be passed to the registered callback if there is one
   */
  async emit(eventName: string, ...args: any[]): Promise<void> {
    if (InterceptorsConsumer.interceptOut) {
      args = await InterceptorsConsumer.interceptOut(...args);
    }
    emit(`Magnetarise:${eventName}`, ...args);
  }
}
