import { ExecutionContext } from '../../contexts/execution-context.interface';

export interface PipeTransform<T = any, R = any> {
  transform(context: ExecutionContext, value: T): R | Promise<R>;
}
