import { EVENTS_METADATA } from './contants';
import { extendArrayMetadata } from '../utils';

export function Event(eventName: string): MethodDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    extendArrayMetadata(EVENTS_METADATA, [eventName], descriptor.value);
    return descriptor;
  };
}
