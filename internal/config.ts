import * as fs from 'fs';
import * as path from 'path';
import { AttributeDescriptionFormatter, TagDescriptionFormatter } from '../src/formatters';

const DEFAULT_CONFIG_JSON_FILE = '.ng-html-data.json';
const DEFAULT_CONFIG_JS_FILE = '.ng-html-data.js';

const DEFAULT_CONFIG: Config = {
  destination: 'custom.html-data.json',
  files: '**/!(*.spec).ts'
};

interface JsConfg {
  attributeFormatter?: AttributeDescriptionFormatter;
  destination?: string | (() => string);
  files?: string | (() => string);
  tagFormatter?: TagDescriptionFormatter;
}

export type Config = {
  attributeFormatter?: AttributeDescriptionFormatter;
  destination: string;
  files: string;
  tagFormatter?: TagDescriptionFormatter;
};

export const loadConfigAsync = async (): Promise<Config> => {
  const configFileJson = readJsonConfig();
  const configFileJs = await readJsConfigAsync();
  const configArgs = readConfigArgs();
  return {
    ...DEFAULT_CONFIG,
    ...configFileJson,
    ...configFileJs,
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
      case '--destination':
        config.destination = args[++i];
        break;
      case '--f':
      case '--files':
        config.files = args[++i];
        break;
      }
    }
    return config;
  } catch (ex) {
    console.error(`Could not read command line argument: ${ex}`);
    process.exit(1);
  }
};

const readJsConfigAsync = async () => {
  const config: Partial<Config> = {};

  try {
    const configFilePath = path.join(process.cwd(), DEFAULT_CONFIG_JS_FILE);
    if (!fs.existsSync(configFilePath)) {
      return config;
    }

    const configJsModule = await import(configFilePath);
    const configJs: JsConfg = configJsModule();
    if (!configJs) {
      return config;
    }

    if (configJs.files) {
      if (typeof (configJs.files) === 'string') {
        config.files = configJs.files;
      } else if (typeof (configJs.files) === 'function') {
        config.files = configJs.files();
      } else {
        throw new Error('files should be a string or function that returns a string.');
      }
    }
     
    if (configJs.destination) {
      if (typeof(configJs.destination) === 'string') {
        config.destination = configJs.destination;
      } else if (typeof(configJs.destination) === 'function') {
        config.destination = configJs.destination();
      } else {
        throw new Error('destination should be a string or function that returns a string.');
      }
    }
    
    if (configJs.attributeFormatter) {
      if (typeof(configJs.attributeFormatter) === 'function') {
        config.attributeFormatter = configJs.attributeFormatter;
      } else {
        throw new Error('attributeFormatter should be a function that returns a string.');
      }
    }
    
    if (configJs.tagFormatter) {
      if (typeof(configJs.tagFormatter) === 'function') {
        config.tagFormatter = configJs.tagFormatter;
      } else {
        throw new Error('tagFormatter should be a function that returns a string.');
      }
    }
    
    return config;
  } catch (ex) {
    console.error(`Could not load configuration file: ${ex}`);
    process.exit(1);
  }
};

const readJsonConfig = () => {
  const config: Partial<Config> = {};

  try {
    const configFilePath = path.join(process.cwd(), DEFAULT_CONFIG_JSON_FILE);
    if (!fs.existsSync(configFilePath)) {
      return config;
    }

    const configFile = fs.readFileSync(configFilePath, 'utf-8');
    const configJson = JSON.parse(configFile);

    if (configJson.destination) {
      config.destination = configJson.destination;
    }
    if (configJson.files) {
      config.files = configJson.files;
    }
    return config;
  } catch (ex) {
    console.error(`Could not load configuration file: ${ex}`);
    process.exit(1);
  }
};
