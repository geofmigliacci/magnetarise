export interface AfterControllerInit {
  afterControllerInit(): Promise<void> | void;
}
