import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  ContextIdFactory,
  DiscoveryService,
  MetadataScanner,
  ModuleRef,
} from '@nestjs/core';
import { Injector } from '@nestjs/core/injector/injector';
import {
  ContextId,
  InstanceWrapper,
} from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';

import { EventEmitter } from '../event-emitter';
import { EventsMetadataAccessor } from '../events-metadata.accessor';
import { OnEventOptions } from '../interfaces';

@Injectable()
export class EventSubscribersLoader
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly injector = new Injector();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly eventEmitter: EventEmitter,
    private readonly metadataAccessor: EventsMetadataAccessor,
    private readonly metadataScanner: MetadataScanner,
    private readonly moduleRef: ModuleRef,
  ) {}

  onApplicationBootstrap() {
    this.loadEventListeners();
  }

  onApplicationShutdown() {
    this.eventEmitter.removeAllEvents();
  }

  loadEventListeners() {
    const controllers = this.discoveryService.getControllers();
    [...controllers]
      .filter((wrapper) => wrapper.instance && !wrapper.isAlias)
      .forEach((wrapper: InstanceWrapper) => {
        const { instance } = wrapper;
        const prototype = Object.getPrototypeOf(instance) || {};
        const isRequestScoped = !wrapper.isDependencyTreeStatic();
        this.metadataScanner.scanFromPrototype(
          instance,
          prototype,
          (methodKey: string) =>
            this.subscribeToEventIfListener(
              instance,
              methodKey,
              isRequestScoped,
              wrapper.host,
            ),
        );
      });
  }

  private subscribeToEventIfListener(
    instance: Record<string, any>,
    methodKey: string,
    isRequestScoped: boolean,
    moduleRef: Module,
  ) {
    const eventListenerMetadata = this.metadataAccessor.getEventHandlerMetadata(
      instance[methodKey],
    );
    if (!eventListenerMetadata) {
      return;
    }

    const { event, options } = eventListenerMetadata;
    const listenerMethod = this.getRegisterListenerMethodBasedOn(options);

    if (isRequestScoped) {
      this.registerRequestScopedListener({
        event,
        eventListenerInstance: instance,
        listenerMethod,
        listenerMethodKey: methodKey,
        moduleRef,
      });
    } else {
      listenerMethod(event, (...args: unknown[]) =>
        instance[methodKey].call(instance, ...args),
      );
    }
  }

  private getRegisterListenerMethodBasedOn(_options?: OnEventOptions) {
    return this.eventEmitter.on;
  }

  private registerRequestScopedListener(eventListenerContext: {
    listenerMethod: (eventName: string, callback: Function) => void;
    event: string;
    eventListenerInstance: Record<string, any>;
    moduleRef: Module;
    listenerMethodKey: string;
    options?: OnEventOptions;
  }) {
    const {
      listenerMethod,
      event,
      eventListenerInstance,
      moduleRef,
      listenerMethodKey,
      options,
    } = eventListenerContext;

    listenerMethod(event, async (...args: unknown[]) => {
      const contextId = ContextIdFactory.create();

      this.registerEventPayloadByContextId(args, contextId);

      const contextInstance = await this.injector.loadPerContext(
        eventListenerInstance,
        moduleRef,
        moduleRef.providers,
        contextId,
      );
      return contextInstance[listenerMethodKey].call(contextInstance, ...args);
    });
  }

  private registerEventPayloadByContextId(
    eventPayload: unknown[],
    contextId: ContextId,
  ) {
    /*
      **Required explanation for the ternary below**

      We need the conditional below because an event can be emitted with a variable amount of arguments.
      For instance, we can do `this.eventEmitter.emit('event', 'payload1', 'payload2', ..., 'payloadN');` 
      
      All payload arguments are internally stored as an array. So, imagine we emitted an event as follows:

      `this.eventEmitter.emit('event', 'payload');
      
      if we registered the original `eventPayload`, when we try to inject it in a listener, it'll be retrieved as [`payload`].
      However, whoever is using this library would certainly expect the event payload to be a single string 'payload', not an array,
      since this is what we emitted above.
    */

    const payloadObjectOrArray =
      eventPayload.length > 1 ? eventPayload : eventPayload[0];

    this.moduleRef.registerRequestByContextId(payloadObjectOrArray, contextId);
  }
}
