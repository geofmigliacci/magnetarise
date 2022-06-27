export interface Controller<T = any> extends Function {
  new (...args: any[]): T;
}
