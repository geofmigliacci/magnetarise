import { Type } from '../types/type.interface';

export class ExecutionContext {
  constructor(
    private readonly args: unknown[],
    private readonly constructorRef: Type<any> = null,
    private readonly handler: Function = null
  ) {}

  getEventName(): string {
    return this.getArgByIndex<string>(0);
  }

  getSource(): number {
    return this.getArgByIndex<number>(1);
  }

  getClass<T = any>(): Type<T> {
    return this.constructorRef;
  }

  getHandler(): Function {
    return this.handler;
  }

  getArgs<T extends Array<any> = any[]>(): T {
    return this.args as T;
  }

  getArgByIndex<T = any>(index: number): T {
    return this.args[index] as T;
  }
}
