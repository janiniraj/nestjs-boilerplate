import * as fs from 'fs';

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
import { EmmLogger } from 'src/logger/logger';
import { ${uppercaseName} } from './${name}.entity';

@Injectable()
export class ${uppercaseName}Service {
  private readonly logger = new EmmLogger(${uppercaseName}Service.name);

  constructor(
    @InjectRepository(${uppercaseName})
    private readonly userRepository: Repository<${uppercaseName}>
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
import { EmmLogger } from 'src/logger/logger';
import { GqlAuthGuard } from 'src/auth/guards/graphqlAuth.guard';
import { GqlRolesGuard } from 'src/role/guards/graphqlRoles.guard';

@Resolver('User')
@UseGuards(GqlAuthGuard, GqlRolesGuard)
export class ${uppercaseName}Resolver {
  private readonly logger = new EmmLogger(${uppercaseName}Resolver.name);

  constructor(private readonly ${name}Service: ${uppercaseName}Service) {}
}`;
  fs.writeFileSync(dir + '/' + name + '.resolver.ts', resolver);

  // Module
  const module = `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${uppercaseName} } from './${name}.entity';
import { ${uppercaseName}Service } from './${name}.service';
import { ${uppercaseName}Resolver } from './${name}.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([${uppercaseName}])],
  controllers: [],
  providers: [${uppercaseName}Service, ${uppercaseName}Resolver],
  exports: [${uppercaseName}Service]
})
export class ${uppercaseName}Module {}`;
  fs.writeFileSync(dir + '/' + name + '.module.ts', module);
})();
