import { InterceptorsConsumer } from "../consumers";
import { Injectable } from "../decorators";
import { EventCallback } from "../types";
import { isNativeEvent } from "../utils";

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
     * 
     * @see {@link EventRegistrar~OnNet} to register an net event
     * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emitNet-server/}
     * @see {@link https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emitNet-client/}
     * 
     * @param eventName eventName to be triggered
     * @param args args that will be passed to the registered callback if there is one
     */
    async emitNet(eventName: string, ...args: any[]): Promise<void> {
        if (isNativeEvent(eventName)) {
            emitNet(eventName, ...args);
        } else {
            if (InterceptorsConsumer.interceptOut) {
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
        if (isNativeEvent(eventName)) {
            emit(eventName, ...args);
        } else {
            if (InterceptorsConsumer.interceptOut) {
                args = await InterceptorsConsumer.interceptOut(...args);
            }
            emit(`Magnetarise:${eventName}`, ...args);
        }
    }
}