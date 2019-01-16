import chalk from 'chalk';
import * as glob from 'glob';
import { readFileSync } from 'fs';

const SRC_DIR = __dirname + '/../../';
console.log(SRC_DIR);

const findEndpointFiles = () => {
  const controllers = glob.sync(SRC_DIR + '**/*.controller.ts');
  const resolvers = glob.sync(SRC_DIR + '**/*.resolver.ts');

  return [...controllers, ...resolvers];
};

// Find guard declared globally on the class
const findGlobalGuards = (contents: string): string[] => {
  const lines: string[] = contents.split('\n');
  // Find all decorators declared before we hit the line declaring the class
  const classDecorators = [];
  for (const line of lines) {
    if (line.trim().startsWith('@')) {
      classDecorators.push(line.trim());
    }

    if (line.includes(' class ')) {
      break;
    }
  }

  return classDecorators;
};

// Find all the methods in the class that have decorators
const findMethodDecorators = (
  contents: string
): Array<{ name: string; decorators: string[] }> => {
  let inClass = false;
  let inMethod = false;
  const lines = contents.split('\n');

  const results = [];
  let methodName = '';
  let methodDecorators: string[] = [];
  let lastLineWasDecorator = true;

  let i = 1;
  for (const line of lines) {
    if (line.match(/^export class .*? {/)) {
      inClass = true;
      lastLineWasDecorator = false;
      continue;
    }

    // Poorly coded, but working
    if (inClass) {
      if (line.trim() === '}') {
        inMethod = false;
        lastLineWasDecorator = false;
      } else if (line.trim().startsWith('@')) {
        methodDecorators.push(line.trim());
        lastLineWasDecorator = true;
      } else if (lastLineWasDecorator && !inMethod) {
        inMethod = true;
        methodName = line
          .split('(')[0]
          .replace('async', '')
          .trim();
        results.push({ name: methodName, decorators: methodDecorators });

        methodDecorators = [];
        methodName = '';
        lastLineWasDecorator = false;
      } else {
        lastLineWasDecorator = false;
      }
    }
    i += 1;
  }

  return results;
};

// Go through each .controller or .resolver file and identify what
// protections are enabled one each class or individual endpoint
(async () => {
  const endpointFiles = findEndpointFiles();

  for (const endpointFile of endpointFiles) {
    console.log();
    console.log('-------------------------------------------------------');
    console.log('File: ' + chalk.cyan(endpointFile));
    const contents = readFileSync(endpointFile, 'utf-8');

    // Get class decorators
    const classDecorators = findGlobalGuards(contents);
    for (const decorator of classDecorators) {
      if (
        decorator.includes('@Controller') ||
        decorator.includes('@Resolver')
      ) {
        // Class type
        console.log(chalk.green(decorator));
      } else if (decorator.includes('@UseGuards')) {
        // Guards for the whole class
        const [_, guardsStr] = decorator.match(/^.*\((.+?)\)/);
        console.log('Class Guards: ', chalk.magenta(guardsStr));
      } else {
        console.log(
          chalk.yellow('WARNING, unsure of what decorator is: ' + decorator)
        );
      }
    }

    // Get method decorators
    const methodDecorators = findMethodDecorators(contents);
    for (const method of methodDecorators) {
      console.log(method.name);
    }
  }

  process.exit(0);
})();
