import "reflect-metadata";
import { ExecutionContext } from "../src/contexts";
import { Controller, Event, Injectable, Magnetarise, NetEvent, RegisterCommand, SetMetadata, Tick, UseGuards, UsePipes } from "../src/decorators";
import { CanActivate, PipeTransform } from "../src/interfaces";
import { Reflector } from "../src/services";
import { BeforeControllerInit, AfterControllerInit, OnApplicationBootstrap } from "../src/hooks";
import { MagnetariseApplication } from "../src/magnetarise-application";

describe('MagnetariseApplication', () => {
    class IsTrue implements CanActivate {
        canActivate(context: ExecutionContext): boolean | Promise<boolean> {
            return true;
        }
    }

    @Injectable()
    class MultiplyPipe implements PipeTransform<number, number> {
        constructor(
            private reflector: Reflector
        ) {

        }

        transform(context: ExecutionContext, value: number): number {
            const multiplyBy: number = this.reflector.get<number>('multiply-by', context.getHandler());
            return value * multiplyBy;
        }
    }


    @UseGuards(IsTrue)
    @Controller()
    class UserController implements BeforeControllerInit, AfterControllerInit, OnApplicationBootstrap {
        @UseGuards(IsTrue)
        @NetEvent('otherEvent')
        @SetMetadata('multiply-by', 2)
        async eventGuarded(
            eventName: string,
            source: number,
            @UsePipes(MultiplyPipe, MultiplyPipe) @UsePipes(MultiplyPipe) arg1: number
        ): Promise<void> {
            console.log(arg1);
        }

        @Event('event')
        async event(
            eventName: string,
            source: number,
            @UsePipes(MultiplyPipe, MultiplyPipe) arg1: number
        ): Promise<void> {
            console.log(arg1);
        }

        @RegisterCommand('commandName', false)
        async commandName(): Promise<void> {

        }

        @RegisterCommand('newCommand', true)
        async newCommand(): Promise<void> {

        }

        @Tick()
        async OnTick(): Promise<void> {
            console.log("OnTick called");
        }

        afterControllerInit(): void {
            console.log("afterControllerInit");
        }

        beforeControllerInit(): void {
            console.log("beforeControllerInit");
        }

        onApplicationBootstrap(): void {
            console.log("onApplicationBootstrap");
        }
    }

    @Magnetarise({
        controllers: [
            UserController
        ],
        providers: [
            MultiplyPipe
        ],
    })
    class App {

    }


    describe('MagnetariseApplication', () => {
        it('should create a new application', async () => {
            MagnetariseApplication.create(App).then(async (magnetarise) => {
                expect(magnetarise).toBeDefined();
            });
        });
    });
});