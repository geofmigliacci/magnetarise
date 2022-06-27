import { GUARDS_METADATA } from './contants';
import { extendArrayMetadata } from '../utils';
import { CanActivate } from '../interfaces/decorators';

export function UseGuards(
  ...guards: (CanActivate | Function)[]
): MethodDecorator & ClassDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor) {
      extendArrayMetadata(GUARDS_METADATA, guards, descriptor.value);
      return descriptor;
    }
    extendArrayMetadata(GUARDS_METADATA, guards, target);
    return target;
  };
}
