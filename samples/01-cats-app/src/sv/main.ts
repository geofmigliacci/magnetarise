import "reflect-metadata";
import { App } from "./app";
import { MagnetariseApplication } from "@magnetarise/core";
import { JsonSerializer } from "@magnetarise/core/src/interceptors";

MagnetariseApplication.create(App).then(async (magnetarise) => {
  await magnetarise.intercept(JsonSerializer);
  await magnetarise.start();
});
