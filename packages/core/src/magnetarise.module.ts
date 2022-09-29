import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { EventEmitter } from 'stream';

import { EventsMetadataAccessor } from './events-metadata.accessor';
import { EventEmitterModuleOptions } from './interfaces';
import { EventSubscribersLoader } from './loaders';

@Module({})
export class MagnetariseModule {
  static forRoot(options?: EventEmitterModuleOptions): DynamicModule {
    return {
      global: options?.global ?? true,
      module: MagnetariseModule,
      imports: [DiscoveryModule],
      providers: [EventSubscribersLoader, EventsMetadataAccessor, EventEmitter],
      exports: [EventEmitter],
    };
  }
}
