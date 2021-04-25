#!/usr/bin/env node
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

import { Config, loadConfig } from './src/internal/config';
import { HtmlData } from './src/html-data';
import { TagExtractor } from './src/tag-extractor';

const config: Config = loadConfig();
const extractor = new TagExtractor();
const htmlData: HtmlData = {
  version: 1.1,
  tags: []
};

const filePattern = path.isAbsolute(config.files) ? config.files : path.join(__dirname, config.files);
glob.sync(filePattern).forEach(file => {
  const source = fs.readFileSync(file, 'utf-8');
  // todo: use extractTags
  const tag = extractor.extractTag(source);
  if (tag) {
    htmlData.tags?.push(tag);
  }
});

const htmlDataJson = JSON.stringify(htmlData, undefined, 2);
const outputPath = path.isAbsolute(config.dest) ? config.dest : path.join(__dirname, config.dest);
try {
  fs.writeFileSync(outputPath, htmlDataJson);
} catch (ex) {
  console.error(`Could not write to output file ${config.dest}.`);
  process.exit(1);
}
