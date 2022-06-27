export interface BeforeControllerInit {
  beforeControllerInit(): Promise<void> | void;
}
