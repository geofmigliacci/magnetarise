import {
  Controller, NetEvent,
} from "@magnetarise/core/src/decorators";
import { EventEmitter } from "@magnetarise/core/src/services";
import { CatsService } from "../services";

import { OnApplicationBootstrap } from "@magnetarise/core/src/hooks";

@Controller()
export class CatsController implements OnApplicationBootstrap {
  constructor(
    private readonly eventEmitter: EventEmitter,
    private readonly catsService: CatsService,
  ) {

  }

  onApplicationBootstrap(): void {
    console.log("Cats application bootstrapped!");
    console.log("Here you can load datas into an array or database...");
  }

  @NetEvent("cats.findAll")
  private catsFindAll(
    _eventName: string,
    source: number,
  ): void {
    console.log("I receive a cats.findAll event...");

    this.eventEmitter.emitNet("cats.findAll", source, this.catsService.findAll());
  }


  @NetEvent("cats.findByName")
  private async catsFindByName(
    _eventName: string,
    source: number,
    name: string
  ): Promise<void> {
    console.log("Searching a cat with the name : " + name);

    if (!name?.length) {
      return;
    }
    
    this.eventEmitter.emitNet("cats.findByName", source, await this.catsService.findByName(
      name
    ));
  }
}
