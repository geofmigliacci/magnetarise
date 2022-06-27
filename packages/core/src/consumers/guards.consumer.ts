import { InjectionToken } from 'tsyringe';
import { MagnetariseContainer } from '../container';
import { ExecutionContext } from '../contexts';
import { CanActivate } from '../interfaces/decorators';

export class GuardsConsumer {
  static guardsFn(
    guardsMetadata: InjectionToken[]
  ): (executionContext: ExecutionContext) => Promise<boolean> {
    return async (executionContext: ExecutionContext): Promise<boolean> => {
      for (const guard of guardsMetadata) {
        const concreteGuard =
          MagnetariseContainer.container.resolve<CanActivate>(guard);
        if (
          !(await GuardsConsumer.pickResult(
            concreteGuard.canActivate(executionContext)
          ))
        ) {
          return false;
        }
      }
      return true;
    };
  }

  static async pickResult(
    result: boolean | Promise<boolean>
  ): Promise<boolean> {
    return result;
  }
}
