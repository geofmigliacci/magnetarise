import { Intercept } from "../interfaces";

export interface Interceptor<T = Intercept> extends Function {
    new(...args: any[]): T;
}
