import * as fs from 'fs';
import * as path from 'path';

export type Config = {
  dest: string;
  files: string;
  // formatter: 'simple';
};

const DEFAULT_CONFIG: Config = {
  dest: 'custom-html-data.json',
  files: '**/*.ts',
  // formatter: 'simple'
};

export const loadConfig = (): Config => {
  const configFileJson = readConfigFile();
  const configArgs = readConfigArgs();
  return {
    ...DEFAULT_CONFIG,
    ...configFileJson,
    ...configArgs
  };
};

const readConfigArgs = () => {
  const config: Partial<Config> = {};

  try {
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
      case '--d':
      case '--dest':
        config['dest'] = args[++i];
        break;
      case '--f':
      case '--files':
        config['files'] = args[++i];
        break;
      // case '--formatter':
      //   (config['formatter'] as string) = args[++i];
      //   validateValue((config['formatter'] as string), 'simple');
      //   break;
      }
    }
    return config;
  } catch (ex) {
    console.error(`Could not read command line argument: ${ex}`);
    process.exit(1);
  }
};

const readConfigFile = () => {
  const config: Partial<Config> = {};

  try {
    const configFilePath = path.join(process.cwd(), '.ng-html-data.json');
    if (!fs.existsSync(configFilePath)) {
      return config;
    }

    const configFile = fs.readFileSync(configFilePath, 'utf-8');
    const configJson = JSON.parse(configFile);

    if (configJson.dest) {
      config['dest'] = configJson.dest;
    }
    if (configJson.files) {
      config['files'] = configJson.files;
    }
    // if (configJson.formatter) {
    //   config['formatter'] = configJson.formatter;
    //   validateValue((config['formatter'] as string), 'simple');
    // }
    return config;
  } catch (ex) {
    console.error(`Could not load configuration file: ${ex}`);
    process.exit(1);
  }
};

// const validateValue = (actualValue: string, ...potentialValues: string[]): void => {
//   for (const potential of potentialValues) {
//     if (potential === actualValue) {
//       return;
//     }
//   }
//   throw new Error(`Unexpected value ${actualValue}. Available values: ${potentialValues}`);
// };