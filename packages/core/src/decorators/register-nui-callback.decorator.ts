import { REGISTERS_NUI_CALLBACK_METADATA } from './contants';
import { extendArrayMetadata } from '../utils';

export function RegisterNuiCallBack(callbackName: string): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    extendArrayMetadata(REGISTERS_NUI_CALLBACK_METADATA, [callbackName], descriptor.value);
    return descriptor;
  };
}
