import { Magnetarise } from "@magnetarise/core/src/decorators";
import { CatsController } from "./controllers";
import { CatsService } from "./services";

@Magnetarise({
  controllers: [CatsController],
  providers: [CatsService],
})
export class App {}
