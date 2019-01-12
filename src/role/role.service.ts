import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dtos/createRole.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const newRole = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(newRole);
  }

  async findAll(options: Partial<Role>) {
    return await this.roleRepository.find(options);
  }
}
