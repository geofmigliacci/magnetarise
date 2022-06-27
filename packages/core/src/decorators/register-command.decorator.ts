import { REGISTERS_COMMANDS_METADATA } from "./contants";
import { extendArrayMetadata } from "../utils";
import { RegisterCommandMetadata } from "../interfaces/decorators";

export function RegisterCommand(
    commandName: string,
    restricted: boolean = false
): MethodDecorator {
    return (
        target: any,
        key?: string | symbol,
        descriptor?: TypedPropertyDescriptor<any>,
    ) => {
        const registerCommandsMetadata: RegisterCommandMetadata = {
            commandName,
            restricted
        };
        extendArrayMetadata(REGISTERS_COMMANDS_METADATA, [
            registerCommandsMetadata
        ], descriptor.value);
        return descriptor;
    };
}
