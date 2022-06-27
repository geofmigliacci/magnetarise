import { isEmpty, isObject } from '../utils';
import { Injectable } from '../decorators';
import { Type } from '../types';

@Injectable()
export class Reflector {
  /**
   * Retrieve metadata for a specified key for a specified target.
   *
   * @example
   * `const roles = this.reflector.get<string[]>('roles', context.getHandler());`
   *
   * @param metadataKey lookup key for metadata to retrieve
   * @param target context (decorated object) to retrieve metadata from
   */
  get<TResult = any, TKey = any>(
    metadataKey: TKey,
    target: Type<any> | Function
  ): TResult {
    return Reflect.getMetadata(metadataKey, target) as TResult;
  }

  /**
   * Retrieve metadata for a specified key for a specified set of targets.
   *
   * @param metadataKey lookup key for metadata to retrieve
   * @param targets context (decorated objects) to retrieve metadata from
   */
  getAll<TResult extends any[] = any[], TKey = any>(
    metadataKey: TKey,
    targets: (Type<any> | Function)[]
  ): TResult {
    return (targets || []).map((target) =>
      Reflect.getMetadata(metadataKey, target)
    ) as TResult;
  }

  /**
   * Retrieve metadata for a specified key for a specified set of targets and merge results.
   *
   * @param metadataKey lookup key for metadata to retrieve
   * @param targets context (decorated objects) to retrieve metadata from
   */
  getAllAndMerge<TResult extends any[] = any[], TKey = any>(
    metadataKey: TKey,
    targets: (Type<any> | Function)[]
  ): TResult {
    const metadataCollection = this.getAll<TResult, TKey>(
      metadataKey,
      targets
    ).filter((item) => item !== undefined);

    if (isEmpty(metadataCollection)) {
      return metadataCollection as TResult;
    }
    return metadataCollection.reduce((a, b) => {
      if (Array.isArray(a)) {
        return a.concat(b);
      }
      if (isObject(a) && isObject(b)) {
        return {
          ...a,
          ...b,
        };
      }
      return [a, b];
    });
  }

  /**
   * Retrieve metadata for a specified key for a specified set of targets and return a first not undefined value.
   *
   * @param metadataKey lookup key for metadata to retrieve
   * @param targets context (decorated objects) to retrieve metadata from
   */
  getAllAndOverride<TResult = any, TKey = any>(
    metadataKey: TKey,
    targets: (Type<any> | Function)[]
  ): TResult {
    const metadataCollection = this.getAll(metadataKey, targets).filter(
      (item) => item !== undefined
    );
    return metadataCollection[0];
  }
}
