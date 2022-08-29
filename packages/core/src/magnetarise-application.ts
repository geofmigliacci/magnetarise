import { MagnetariseContainer } from './container';
import {
  EVENTS_METADATA,
  GUARDS_METADATA,
  NET_EVENTS_METADATA,
  PIPES_METADATA,
  REGISTERS_COMMANDS_METADATA,
  REGISTERS_NUI_CALLBACK_METADATA,
  TICKS_METADATA,
} from './decorators/contants';
import { RegisterCommandMetadata } from './interfaces/decorators';
import { EventRegistrar, NuiRegistrar } from './services';
import { ExecutionContext } from './contexts';
import {
  GuardsConsumer,
  InterceptorsConsumer,
  PipesConsumer,
} from './consumers';
import { Controller, Interceptor, Type } from './types';
import { MetadataScanner } from './metadata-scanner';
import { InjectionToken } from 'tsyringe';
import { isFunction, isNativeEvent } from './utils';
import iterate from 'iterare';

export class MagnetariseApplication {
  private static instance: MagnetariseApplication;

  private constructor() { }

  /**
   * Create an instance of MagnetariseApplication
   *
   * @returns {MagnetariseApplication}
   */
  public static create(bootstrap: Type): Promise<MagnetariseApplication> {
    if (!MagnetariseApplication.instance) {
      MagnetariseApplication.instance = new MagnetariseApplication();
    }

    return Promise.resolve(MagnetariseApplication.instance);
  }

  /**
   * Add a global interceptor to the application
   *
   * @param interceptor An interceptor to be added to the application
   * @returns void
   */
  async intercept(interceptor: Interceptor): Promise<void> {
    MagnetariseContainer.interceptors.add(interceptor);

    return Promise.resolve();
  }

  async start(): Promise<void> {
    InterceptorsConsumer.generate();

    for (const controllerToken of iterate(MagnetariseContainer.controllers)) {
      const controller =
        MagnetariseContainer.container.resolve(controllerToken);

      if (isFunction(controller.beforeControllerInit)) {
        await controller.beforeControllerInit();
      }

      await this.generateController(controller);

      if (isFunction(controller.afterControllerInit)) {
        await controller.afterControllerInit();
      }
    }

    for (const controllerToken of iterate(MagnetariseContainer.controllers)) {
      const controller =
        MagnetariseContainer.container.resolve(controllerToken);
      if (isFunction(controller.onApplicationBootstrap)) {
        controller.onApplicationBootstrap();
      }
    }
  }

  private async generateController(controller: Controller) {
    const eventRegistrar =
      MagnetariseContainer.container.resolve(EventRegistrar);
    const nuiRegistrar =
      MagnetariseContainer.container.resolve(NuiRegistrar);

    for (const methodName of MetadataScanner.getMethodNames(controller)) {
      const classMetadata = MetadataScanner.getClassMetadata<InjectionToken[]>(
        GUARDS_METADATA,
        controller
      );
      const guardsMetadata = MetadataScanner.getMethodMetadata<
        InjectionToken[]
      >(GUARDS_METADATA, controller, methodName);
      const guardFn = GuardsConsumer.guardsFn([
        ...(classMetadata || []),
        ...(guardsMetadata || []),
      ]);

      const pipesMetada = MetadataScanner.getMethodMetadata<
        Map<number, InjectionToken[]>
      >(PIPES_METADATA, controller, methodName);
      const pipeFn = PipesConsumer.pipesFn(pipesMetada);

      const netEventsMetadata = MetadataScanner.getMethodMetadata<string[]>(
        NET_EVENTS_METADATA,
        controller,
        methodName
      );
      if (netEventsMetadata) {
        for (const eventName of netEventsMetadata) {
          eventRegistrar.onNet(eventName, async (...args: any[]) => {
            if (!isNativeEvent(eventName) && InterceptorsConsumer.interceptIn) {
              args = await InterceptorsConsumer.interceptIn(...args);
            }

            let executionContext = new ExecutionContext(
              [eventName, source || -1, ...args],
              controller,
              controller[methodName]
            );

            if (guardsMetadata && !(await guardFn(executionContext))) {
              return;
            }

            if (pipesMetada) {
              executionContext = await pipeFn(executionContext);
            }

            await controller[methodName](...executionContext.getArgs());
          });
        }
      }

      const eventNames = MetadataScanner.getMethodMetadata<string[]>(
        EVENTS_METADATA,
        controller,
        methodName
      );
      if (eventNames) {
        for (const eventName of eventNames) {
          eventRegistrar.on(eventName, async (...args: any[]) => {
            if (!isNativeEvent(eventName) && InterceptorsConsumer.interceptIn) {
              args = await InterceptorsConsumer.interceptIn(...args);
            }

            let executionContext = new ExecutionContext(
              [eventName, source || -1, ...args],
              controller,
              controller[methodName]
            );

            if (guardsMetadata && !(await guardFn(executionContext))) {
              return;
            }

            if (pipesMetada) {
              executionContext = await pipeFn(executionContext);
            }

            await controller[methodName](...executionContext.getArgs());
          });
        }
      }

      const nuiCallbacks = MetadataScanner.getMethodMetadata<string[]>(
        REGISTERS_NUI_CALLBACK_METADATA,
        controller,
        methodName
      );
      if (nuiCallbacks) {
        for (const nuiCallback of nuiCallbacks) {
          nuiRegistrar.on(nuiCallback, controller[methodName].bind(controller));
        }
      }

      const registerCommandsMetadata = MetadataScanner.getMethodMetadata<
        RegisterCommandMetadata[]
      >(REGISTERS_COMMANDS_METADATA, controller, methodName);
      if (registerCommandsMetadata) {
        for (const registerCommandMetadata of registerCommandsMetadata) {
          RegisterCommand(
            registerCommandMetadata.commandName,
            async (source: number, ...args: any[]) => {
              let executionContext = new ExecutionContext(
                [registerCommandMetadata.commandName, source || -1, ...args],
                controller,
                controller[methodName]
              );

              if (guardsMetadata && !(await guardFn(executionContext))) {
                return;
              }

              if (pipesMetada) {
                executionContext = await pipeFn(executionContext);
              }

              controller[methodName](...executionContext.getArgs());
            },
            registerCommandMetadata.restricted
          );
        }
      }

      const ticksMetadata = MetadataScanner.getMethodMetadata<string[]>(
        TICKS_METADATA,
        controller,
        methodName
      );
      if (ticksMetadata) {
        setTick(controller[methodName].bind(controller));
      }
    }
  }

  static hasInterceptIn(): boolean {
    return !!InterceptorsConsumer.interceptIn;
  }

  static hasInterceptOut(): boolean {
    return !!InterceptorsConsumer.interceptIn;
  }

  static hasInterceptors(): boolean {
    return MagnetariseApplication.hasInterceptIn() || MagnetariseApplication.hasInterceptOut();
  }
}
