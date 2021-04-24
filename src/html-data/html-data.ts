import { Tag } from './tag';

/**
 * Format for loading Custom Data in VS Code's HTML support.
 */
export interface HtmlData {
  /**
   * The custom data version.
   */
  version: 1.1;
  /**
   * Custom HTML tags.
   */
  tags?: Tag[];
  // todo: support global attributes (e.g.: non-element based attribute directives)
  // "globalAttributes": [];
  // todo: support value sets (e.g.: enum or union types)
  // "valueSets": [];
}
