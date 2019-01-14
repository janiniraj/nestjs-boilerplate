import { Controller, UseGuards } from '@nestjs/common';

import { BackendLogger } from 'src/logger/BackendLogger';
import { EmailerService } from './emailer.service';
import { RolesGuard } from 'src/role/guards/roles.guard';

@Controller('emailer')
@UseGuards(RolesGuard)
export class EmailerController {
  private readonly logger = new BackendLogger(EmailerController.name);

  constructor(private readonly emailerService: EmailerService) {}
}
