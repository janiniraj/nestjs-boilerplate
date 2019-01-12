import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { EmmLogger } from 'src/logger/logger';
import { LoginRecord } from './loginRecord.entity';

@Injectable()
export class LoginRecordService {
  private readonly logger = new EmmLogger(LoginRecordService.name);

  constructor(
    @InjectRepository(LoginRecord)
    private readonly loginRecordRepository: Repository<LoginRecord>
  ) {}

  async findAll(options: Partial<LoginRecord>) {
    return await this.loginRecordRepository.find(options);
  }
}
