
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { BackendLogger } from 'src/logger/BackendLogger';
import { EndpointScanService } from './endpointScan.service';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { roles } from 'src/common/constants';
import { Roles } from 'src/role/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@Controller('endpointScan')
@UseGuards(RolesGuard)
export class EndpointScanController {
  private readonly logger = new BackendLogger(EndpointScanController.name);

  constructor(private readonly endpointScanService: EndpointScanService) {}
}