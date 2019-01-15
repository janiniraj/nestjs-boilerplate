import { Injectable, Controller } from '@nestjs/common';
import { ModuleMetadata, ExecutionContext } from '@nestjs/common/interfaces';
import { AppModule } from './app.module';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';

@Injectable()
export class AppService {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner
  ) {}

  getEndpointInfo() {
    const components = [...this.modulesContainer.values()].map(
      (module) => module.components
    );

    components.map((component: any) => {
      console.log('======================================================');
      console.log(component);

      [...component.values()].map(({ compName, instance, metatype }) => {
        console.log('Comp name:', compName);
        const prototype = Object.getPrototypeOf(instance);
        this.metadataScanner.scanFromPrototype(instance, prototype, (name) => {
          const callback = prototype[name];
          const metadataKeys = Reflect.getMetadataKeys(callback);
          if (metadataKeys.length > 0) {
            console.log('----------------------------------------------------');
            console.log(metatype);
            console.log(name);
            console.log(metadataKeys);
            console.log(Reflect.getMetadata('roles', callback));
          }
        });
      });
    });
  }

  protected extractMetadata(instance, prototype, methodName: string) {
    const callback = prototype[methodName];
    const metadata = Reflect.getMetadata('roles', callback);

    return {
      methodName,
      metadata
    };
  }

  // protected filterCommands(instance, metatype: any) {
  //   const prototype = Object.getPrototypeOf(instance);
  //   const components = this.metadataScanner.scanFromPrototype(
  //     instance,
  //     prototype,
  //     (name) => this.extractMetadata(instance, prototype, name)
  //   );

  //   components.map((component) => {});

  // return components
  //   .filter((command) => !!command.metadata)
  //   .map<CommandModule>((command) => {
  //     const exec = instance[command.methodName].bind(instance);
  //     const builder = (yargs: Argv) => {
  //       return this.generateCommandBuilder(command.metadata.params, yargs);
  //     }; // EOF builder

  //     const handler = async (argv: any) => {
  //       const params = this.generateCommandHandlerParams(
  //         command.metadata.params,
  //         argv
  //       );

  //       this.commandService.run();
  //       const code = await exec(...params);
  //       this.commandService.exit(code || 0);
  //     };

  //     return {
  //       ...command.metadata.option,
  //       builder,
  //       handler
  //     };
  //   });
  // }
}
