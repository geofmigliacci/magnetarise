import 'reflect-metadata';

export function extendArrayMetadata<T extends Array<unknown>>(
  key: string,
  metadata: T,
  target: Function
) {
  const previousValue = Reflect.getMetadata(key, target) || [];
  const value = [...previousValue, ...metadata];
  Reflect.defineMetadata(key, value, target);
}

export function extendMapMetadata<K, V extends Array<unknown>>(
  key: string,
  mapKey: K,
  metadata: V,
  target: Function
) {
  const previousValue: Map<K, V> =
    Reflect.getMetadata(key, target) || new Map<K, V>();
  if (!previousValue.has(mapKey)) {
    const value = previousValue.set(mapKey, metadata);
    Reflect.defineMetadata(key, value, target);
  } else {
    const previousValues = previousValue.get(mapKey);
    const value = previousValue.set(mapKey, [
      ...previousValues,
      ...metadata,
    ] as V);
    Reflect.defineMetadata(key, value, target);
  }
}

export function setMetadata<T>(key: string, metadata: T, target: Object) {
  Reflect.defineMetadata(key, metadata, target);
}
