import { CatsController } from "./controllers";
import { Magnetarise } from "@magnetarise/core/src/decorators";

@Magnetarise({
  controllers: [CatsController],
})
export class App {}
