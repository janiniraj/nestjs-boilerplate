import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BackendLogger } from 'src/logger/BackendLogger';
import { EndpointScan } from './endpointScan.entity';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';

@Injectable()
export class EndpointScanService {
  private readonly logger = new BackendLogger(EndpointScanService.name);

  constructor(
    @InjectRepository(EndpointScan)
    private readonly modulesContainer: ModulesContainer
  ) {}

  scan() {
    this.logger.silly('Scanning for endpoints...');
    const components = [...this.modulesContainer.values()].map(
      (module) => module.components
    );

    this.logger.silly(`Component: ${JSON.stringify(components)}`);
  }
}
