import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as geoip from 'geoip-lite';

import { Repository } from 'typeorm';
import { EmmLogger } from 'src/logger/EmmLogger';
import { LoginRecord } from './loginRecord.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LoginRecordService {
  private readonly logger = new EmmLogger(LoginRecordService.name);

  constructor(
    @InjectRepository(LoginRecord)
    private readonly loginRecordRepository: Repository<LoginRecord>,
    private readonly userService: UserService
  ) {}

  async create(ip: string, userId: number) {
    this.logger.log(`User ip for login: ${ip}`);

    const locationInfo = geoip.lookup(ip);
    if (!locationInfo) {
      this.logger.warn('Could not find location info for user IP');
      return;
    }
    const { country, region, city } = locationInfo;
    const [lat, long] = locationInfo.ll;

    const newRecord = this.loginRecordRepository.create({
      ip,
      country,
      region,
      city,
      lat,
      long,
      userId
    });

    return await this.loginRecordRepository.save(newRecord);
  }

  async findAll(options: Partial<LoginRecord>) {
    return await this.loginRecordRepository.find(options);
  }
}
