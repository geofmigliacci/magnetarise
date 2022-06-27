import { InjectionToken } from "tsyringe";
import { MagnetariseContainer } from "../container";
import { ExecutionContext } from "../contexts";
import { PipeTransform } from "../interfaces/decorators";

export class PipesConsumer {
    static pipesFn(pipesMetadata: Map<number, InjectionToken[]>): (executionContext: ExecutionContext) => Promise<ExecutionContext> {
        return async (executionContext: ExecutionContext): Promise<ExecutionContext> => {
            const args = executionContext.getArgs();
            for (const [index, values] of pipesMetadata) {
                for (const pipe of values) {
                    const concretePipe = MagnetariseContainer.container.resolve<PipeTransform>(pipe);
                    args[index] = await this.pickResult(
                        concretePipe.transform(executionContext, executionContext.getArgByIndex(index))
                    );
                }
            }
            return new ExecutionContext(
                args,
                executionContext.getClass(),
                executionContext.getHandler()
            );
        };
    }

    static async pickResult<T>( 
        result: T | Promise<T>,
    ): Promise<T> {
        return result;
    }
}