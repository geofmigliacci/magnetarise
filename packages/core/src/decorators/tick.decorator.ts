import { TICKS_METADATA } from './contants';
import { setMetadata } from '../utils';

export function Tick(): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    setMetadata(TICKS_METADATA, true, descriptor.value);
    return descriptor;
  };
}
