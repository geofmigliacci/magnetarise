import { Injectable } from '@nestjs/common';

@Injectable()
export class EventEmitter {
  private _events = new Map<string, Function[]>();
  private _netEvents = new Map<string, Function[]>();

  removeAllEvents(): void {
    this.removeEvents();
    this.removeNetEvents();
  }

  removeEvents(): void {
    for (const [eventName, callbacks] of this._events) {
      for (const callback of callbacks) {
        removeEventListener(eventName, callback);
      }
    }
    this._events.clear();
  }

  removeNetEvents(): void {
    for (const [eventName, callbacks] of this._netEvents) {
      for (const callback of callbacks) {
        removeEventListener(eventName, callback);
      }
    }
    this._netEvents.clear();
  }

  removeNetEvent(eventName: string): void {
    if (!this._netEvents.has(eventName)) {
      return;
    }

    for (const callback of this._netEvents.get(eventName)) {
      removeEventListener(eventName, callback);
    }
    this._netEvents.delete(eventName);
  }

  removeEvent(eventName: string): void {
    if (!this._events.has(eventName)) {
      return;
    }

    for (const callback of this._events.get(eventName)) {
      removeEventListener(eventName, callback);
    }
    this._events.delete(eventName);
  }

  on(eventName: string, callback: Function) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, []);
    }
    const currentCallbacks = this._events.get(eventName);
    on(eventName, callback);
    this._events.set(eventName, [...currentCallbacks, callback]);
  }

  onNet(eventName: string, callback: Function) {
    if (!this._netEvents.has(eventName)) {
      this._netEvents.set(eventName, []);
    }
    const currentCallbacks = this._netEvents.get(eventName);
    onNet(eventName, callback);
    this._netEvents.set(eventName, [...currentCallbacks, callback]);
  }
}
