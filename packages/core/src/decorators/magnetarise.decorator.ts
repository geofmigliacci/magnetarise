import { MAGNETARISE_METADATA } from './contants';
import { setMetadata } from '../utils';
import { MagnetariseConfiguration } from '../interfaces/decorators';

export function Magnetarise(
  magnetarise: MagnetariseConfiguration
): ClassDecorator {
  return (target: any): void => {
    setMetadata(MAGNETARISE_METADATA, magnetarise, target);
  };
}
