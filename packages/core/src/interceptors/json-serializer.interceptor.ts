import { Injectable } from '../decorators';
import { Intercept } from '../interfaces/decorators';

@Injectable()
export class JsonSerializer implements Intercept {
  private isDate = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

  in(...args: any[]): any[] {
    for (let i = 0; i < args.length; i++) {
      args[i] = JSON.parse(args[i], (key: any, value: any) => {
        // Try to revive dates
        if (typeof value == 'string' && this.isDate.exec(value)) {
          return new Date(value);
        }
        return value;
      });
    }
    return args;
  }

  out(...args: any[]): any[] {
    for (let i = 0; i < args.length; i++) {
      args[i] = JSON.stringify(args[i]);
    }
    return args;
  }
}
