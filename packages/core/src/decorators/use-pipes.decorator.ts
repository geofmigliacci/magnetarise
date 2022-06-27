import { PIPES_METADATA } from "./contants";
import { extendMapMetadata } from "../utils";
import { PipeTransform } from "../interfaces/decorators";

export function UsePipes(
    ...pipes: (PipeTransform | Function)[]
): ParameterDecorator {
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
        extendMapMetadata(PIPES_METADATA, parameterIndex, pipes, target[propertyKey]);
        return target;
    };
}