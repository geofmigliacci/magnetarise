import { NET_EVENTS_METADATA } from "./contants";
import { extendArrayMetadata } from "../utils";

export function NetEvent(
    eventName: string
): MethodDecorator {
    return (
        target: any,
        key?: string | symbol,
        descriptor?: TypedPropertyDescriptor<any>,
    ) => {
        extendArrayMetadata(NET_EVENTS_METADATA, [eventName], descriptor.value);
        return descriptor;
    };
}
