#!/usr/bin/env node
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

import { Config, loadConfig } from './internal/config';
import { HtmlData } from './src/html-data';
import { TagExtractor } from './src/tag-extractor';

const config: Config = loadConfig();
const extractor = new TagExtractor();
const htmlData: HtmlData = {
  version: 1.1,
  globalAttributes: [],
  tags: []
};

const filePattern = path.isAbsolute(config.files) ? config.files : path.join(process.cwd(), config.files);
glob.sync(filePattern).forEach(file => {
  const source = fs.readFileSync(file, 'utf-8');
  const extractData = extractor.extract(source);
  extractData.tags.forEach(tag => htmlData.tags?.push(tag));
  extractData.globalAttributes.forEach(attr => htmlData.globalAttributes?.push(attr));
});

const htmlDataJson = JSON.stringify(htmlData, undefined, 2);
const outputPath = path.isAbsolute(config.dest) ? config.dest : path.join(process.cwd(), config.dest);
try {
  fs.writeFileSync(outputPath, htmlDataJson);
} catch (ex) {
  console.error(`Could not write to output file ${config.dest}.`);
  process.exit(1);
}
