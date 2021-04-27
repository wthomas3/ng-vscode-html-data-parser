import { MarkupDescription } from './markup-description';
import { Reference } from './reference';
import { Value } from './value';

/**
 * Possible attribute for the tag.
 */
export interface Attribute {
  /**
   * Name of attribute.
   */
  name: string;
  /**
   * Description of attribute shown in completion and hover.
   */
  description?: string | MarkupDescription;
  /**
   * Name of the matching attribute value set
   */
  valueSet?: string;
  /**
   * A list of possible values for the attribute.
   */
  values?: Value[];
  /**
   * A list of references for the attribute shown in completion and hover.
   */
  references?: Reference[];
}