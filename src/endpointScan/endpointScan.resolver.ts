
import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { EndpointScanService } from './endpointScan.service';
import { BackendLogger } from 'src/logger/BackendLogger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';

@Resolver('EndpointScan')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class EndpointScanResolver {
  private readonly logger = new BackendLogger(EndpointScanResolver.name);

  constructor(private readonly endpointScanService: EndpointScanService) {}
}