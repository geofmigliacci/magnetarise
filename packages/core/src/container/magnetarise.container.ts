import { container, DependencyContainer, InjectionToken } from "tsyringe";

export class MagnetariseContainer {
    static container: DependencyContainer = container;
    
    static interceptors: Set<InjectionToken> = new Set([]);
    static controllers: Set<InjectionToken> = new Set([]);
    static providers: Set<InjectionToken> = new Set([]);
}