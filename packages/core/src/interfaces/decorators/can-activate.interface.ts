import { ExecutionContext } from "../../contexts/execution-context.interface";

export interface CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean>;
}