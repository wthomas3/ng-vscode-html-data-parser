export interface Attribute{
  name: string;
  description: string;
}

export interface Tag {
  name: string;
  description: string;
  attributes: Attribute[];
}

export interface HtmlData {
  version: '1.1';
  tags: Tag[];
  // "globalAttributes": [];
  // "valueSets": [];
}
