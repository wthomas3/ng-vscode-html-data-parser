import { Attribute } from './attribute';

/**
 * Custom HTML tag.
 */
export interface Tag {
  /**
   * Name of tag.
   */
  name: string;
  /**
   * Description of tag shown in completion and hover.
   */
  description?: string;
  /**
   * A list of possible attributes for the tag.
   */
  attributes?: Attribute[];
}
