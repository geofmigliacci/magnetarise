import { injectable } from "tsyringe";
import { MagnetariseContainer } from "../container";

export function Controller(): ClassDecorator {
    return (
        target: any
    ) => {
        injectable()(target);
        MagnetariseContainer.container.registerSingleton(target);
        MagnetariseContainer.controllers.add(target);
        return target;
    };
}