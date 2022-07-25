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
  private catsFindAll(): void {
    this.eventEmitter.emitNet("cats.findAll", this.catsService.findAll());
  }


  @NetEvent("cats.findByName")
  private async catsFindByName(
    _eventName: string,
    _source: number,
    name: string
  ): Promise<void> {
    if (!name) {
      return;
    }
    this.eventEmitter.emitNet("cats.findByName", await this.catsService.findByName(
      name
    ));
  }
}
