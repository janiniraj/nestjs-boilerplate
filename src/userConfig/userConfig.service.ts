import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConfig } from './userConfig.entity';
import { CreateUserConfigDto } from './dtos/createUserConfig.dto';

@Injectable()
export class UserConfigService {
  constructor(
    @InjectRepository(UserConfig)
    private readonly userConfigRepo: Repository<UserConfig>
  ) {}

  async createUserConfig(createUserConfigDto: CreateUserConfigDto) {
    const newUserConfig = await this.userConfigRepo.create(createUserConfigDto);
    return await this.userConfigRepo.save(newUserConfig);
  }

  async findAll(options: Partial<UserConfig>): Promise<UserConfig[]> {
    return await this.userConfigRepo.find(options);
  }
}
