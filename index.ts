import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

import { Config, loadConfig } from './src/internal/config';
import { HtmlData } from './src/html-data';
import { TagExtractor } from './src/tag-extractor';

const config: Config = loadConfig();

const extractor = new TagExtractor();
// todo: provide this as an external JavaScript file
extractor.tagFormatter = (jsDoc) => {
  let comment = jsDoc?.comment ?? '';
  if (jsDoc.tags) {
    for (const tag of jsDoc.tags) {
      switch (tag.tagName.text) {
      case 'example':
        comment += `\n\n#### Example \n\n${tag.comment}`;
      }
    }
  }
  return comment;
};

const htmlData: HtmlData = {
  version: 1.1,
  tags: []
};

const files = glob.sync(path.join(__dirname, '../') + '/' + config.files);
files.forEach(file => {
  const source = fs.readFileSync(file, 'utf-8');
  // todo: use extractTags
  const tag = extractor.extractTag(source);
  if (tag) {
    htmlData.tags?.push(tag);
  }
});

const htmlDataJson = JSON.stringify(htmlData, undefined, 2);
try {
  fs.writeFileSync(config.dest, htmlDataJson);
} catch (ex) {
  console.error(`Could not write to output file ${config.dest}.`);
  process.exit(1);
}
