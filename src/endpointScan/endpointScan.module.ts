import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EndpointScan } from './endpointScan.entity';
import { EndpointScanService } from './endpointScan.service';
import { EndpointScanResolver } from './endpointScan.resolver';
import { EndpointScanController } from './endpointScan.controller';
import { BackendLogger } from 'src/logger/BackendLogger';

@Module({
  imports: [TypeOrmModule.forFeature([EndpointScan])],
  controllers: [EndpointScanController],
  providers: [EndpointScanService, EndpointScanResolver],
  exports: [EndpointScanService]
})
export class EndpointScanModule {
  private readonly logger = new BackendLogger(EndpointScanModule.name);

  constructor(private readonly endpointScanServer: EndpointScanService) {}

  onModuleInit() {
    this.logger.log('On module init called!');
    this.endpointScanServer.scan();
  }
}
