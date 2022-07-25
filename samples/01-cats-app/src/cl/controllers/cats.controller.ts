import {
  Controller,
  NetEvent,
  RegisterCommand,
  Tick,
} from "@magnetarise/core/src/decorators";
import { EventEmitter } from "@magnetarise/core/src/services";

import { Cat } from "src/sh/interfaces";

@Controller()
export class CatsController {
  constructor(
    private readonly eventEmitter: EventEmitter
  ) {

  }

  @RegisterCommand("cats", false)
  private async catsCommand(
    _commandName: string,
    _source: number
  ): Promise<void> {
    this.eventEmitter.emitNet("cats.findAll");
  }

  @NetEvent("cats.findAll")
  private async catsFindAll(
    _commandName: string,
    _source: number,
    cats: Cat[]
  ): Promise<void> {
    console.log(cats);
  }

  @RegisterCommand("findcats", false)
  private async findCatsCommand(
    _commandName: string,
    _source: number,
    name: string
  ): Promise<void> {
    if(!name) {
      console.log("No name provided for find cats command...");
      return;
    }
    this.eventEmitter.emitNet("cats.findByName", name);
  }

  @NetEvent("cats.findByName")
  private async catsFindByName(
    _commandName: string,
    _source: number,
    cats: Cat[]
  ): Promise<void> {
    if(!cats?.length) {
      console.log("No cats found with the given name...");
      return;
    }
    console.log("Cats found :");
    console.log(cats);
  }
}
