export interface OnApplicationBootstrap {
  onApplicationBootstrap(): Promise<void> | void;
}
