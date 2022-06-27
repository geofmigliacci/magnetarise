import { injectable } from "tsyringe";
import { MagnetariseContainer } from "../container";

export function Injectable(): ClassDecorator {
    return (
        target: any
    ) => {
        injectable()(target);
        MagnetariseContainer.container.registerSingleton(target);
        MagnetariseContainer.providers.add(target);
        return target;
    };
}