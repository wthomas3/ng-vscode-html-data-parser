import { Attribute } from './attribute';
import { Tag } from './tag';
import { Value } from './value';

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
  /**
   * Custom HTML global attributes.
   */
  globalAttributes?: Attribute[];
  /**
   * A set of attribute value. When an attribute refers to an attribute set, its value completion will use valuse from that set.
   */
  valueSets?: Value[];
}
