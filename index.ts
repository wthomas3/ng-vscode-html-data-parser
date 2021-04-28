#!/usr/bin/env node
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

import { Config, loadConfigAsync } from './internal/config';
import { HtmlData } from './src/html-data';
import { TagExtractor } from './src/tag-extractor';

// todo: move this into a class and call it using proper async flow
loadConfigAsync().then((config: Config) => {
  const extractor = new TagExtractor();
  if (config.attributeFormatter) {
    extractor.attributeFormatter = config.attributeFormatter;
  }
  if (config.tagFormatter) {
    extractor.tagFormatter = config.tagFormatter;
  }

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
  const outputPath = path.isAbsolute(config.destination) ? config.destination : path.join(process.cwd(), config.destination);
  try {
    fs.writeFileSync(outputPath, htmlDataJson);
  } catch (ex) {
    console.error(`Could not write to output file ${config.destination}.`);
    process.exit(1);
  }  
});
