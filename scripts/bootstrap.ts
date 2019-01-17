import * as fs from 'fs';
import { formatWithOptions } from 'util';

(() => {
  const name: string = process.argv[2];
  const uppercaseName = name.charAt(0).toUpperCase() + name.slice(1);

  console.log(`Bootstrapping ${name}/${uppercaseName}`);

  // Folder first
  const dir = __dirname + '/../src/' + name;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Entity
  const entity = `
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ${uppercaseName} {
  @PrimaryGeneratedColumn()
  id: number;
}`;
  fs.writeFileSync(dir + '/' + name + '.entity.ts', entity);

  // Service
  const service = `
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BackendLogger } from 'src/logger/BackendLogger';
import { ${uppercaseName} } from './${name}.entity';

@Injectable()
export class ${uppercaseName}Service {
  private readonly logger = new BackendLogger(${uppercaseName}Service.name);

  constructor(
    @InjectRepository(${uppercaseName})
    private readonly ${name}Repository: Repository<${uppercaseName}>
  ) {}
}`;

  fs.writeFileSync(dir + '/' + name + '.service.ts', service);

  // GraphQL
  const graphql = `
type ${uppercaseName} {
}`;
  fs.writeFileSync(dir + '/' + name + '.graphql', graphql);

  // Resolver
  const resolver = `
import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ${uppercaseName}Service } from './${name}.service';
import { BackendLogger } from 'src/logger/BackendLogger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';

@Resolver('${uppercaseName}')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class ${uppercaseName}Resolver {
  private readonly logger = new BackendLogger(${uppercaseName}Resolver.name);

  constructor(private readonly ${name}Service: ${uppercaseName}Service) {}
}`;
  fs.writeFileSync(dir + '/' + name + '.resolver.ts', resolver);

  // Controller

  const controller = `
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
import { ${uppercaseName}Service } from './${name}.service';
import { RolesGuard } from 'src/role/guards/roles.guard';
import { roles } from 'src/common/constants';
import { Roles } from 'src/role/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@Controller('${name}')
@UseGuards(RolesGuard)
export class ${uppercaseName}Controller {
  private readonly logger = new BackendLogger(${uppercaseName}Controller.name);

  constructor(private readonly ${name}Service: ${uppercaseName}Service) {}
}`;
  fs.writeFileSync(dir + '/' + name + '.controller.ts', controller);

  // Module
  const module = `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${uppercaseName} } from './${name}.entity';
import { ${uppercaseName}Service } from './${name}.service';
import { ${uppercaseName}Resolver } from './${name}.resolver';
import { ${uppercaseName}Controller } from './${name}.controller';

@Module({
  imports: [TypeOrmModule.forFeature([${uppercaseName}])],
  controllers: [${uppercaseName}Controller],
  providers: [${uppercaseName}Service, ${uppercaseName}Resolver],
  exports: [${uppercaseName}Service]
})
export class ${uppercaseName}Module {}`;
  fs.writeFileSync(dir + '/' + name + '.module.ts', module);

  // Spec file
  const spec = `
import { Test } from '@nestjs/testing';
import { ${uppercaseName}Service } from './${name}.service';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('${uppercaseName}Service', () => {
  let ${name}Service: ${uppercaseName}Service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature(${uppercaseName})],
      providers: [${uppercaseName}Service]
    }).compile();

    ${name}Service = module.get<${uppercaseName}Service>(${uppercaseName}Service);
  });

  describe('test', () => {
    it('should do something', async () => {
      expect(something)
    });
  });
});
  `;
  fs.writeFileSync(dir + '/' + name + '.service.spec.ts', spec);
})();
