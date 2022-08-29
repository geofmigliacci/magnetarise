import { Injectable } from '../decorators';

@Injectable()
export class NuiEmitter {
  /**
   * Send a NUI message, use an object that will be stringified
   * 
   * @param data An object to be stringified
   */
  emit(data: unknown): void {
    SendNuiMessage(JSON.stringify(data));
  }
}
