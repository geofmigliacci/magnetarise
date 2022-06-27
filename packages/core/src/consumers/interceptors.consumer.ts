import iterate from 'iterare';
import { InjectionToken } from 'tsyringe';
import { MagnetariseContainer } from '../container';
import { Intercept } from '../interfaces/decorators';

export class InterceptorsConsumer {
  static interceptIn: (...args: any[]) => Promise<any[]>;
  static interceptOut: (...args: any[]) => Promise<any[]>;

  static generate(): void {
    const interceptors = iterate(MagnetariseContainer.interceptors).toArray();
    InterceptorsConsumer.interceptIn = InterceptorsConsumer.inFn(
      interceptors.slice().reverse()
    );
    InterceptorsConsumer.interceptOut =
      InterceptorsConsumer.outFn(interceptors);
  }

  static inFn(
    interceptors: InjectionToken[]
  ): (...args: any[]) => Promise<any[]> {
    return async (...args: any[]): Promise<any[]> => {
      for (const interceptor of interceptors) {
        const concreteInterceptor: Intercept =
          MagnetariseContainer.container.resolve(interceptor);
        args = await InterceptorsConsumer.pickResult(
          concreteInterceptor.in(...args)
        );
      }
      return args;
    };
  }

  static outFn(
    interceptors: InjectionToken[]
  ): (...args: any[]) => Promise<any[]> {
    return async (...args: any[]): Promise<any[]> => {
      for (const interceptor of interceptors) {
        const concreteInterceptor: Intercept =
          MagnetariseContainer.container.resolve(interceptor);
        args = await InterceptorsConsumer.pickResult(
          concreteInterceptor.out(...args)
        );
      }
      return args;
    };
  }

  static async pickResult(result: any[] | Promise<any[]>): Promise<any[]> {
    return result;
  }
}
