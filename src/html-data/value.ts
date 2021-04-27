import { MarkupDescription } from './markup-description';
import { Reference } from './reference';

/**
 * An attribute value.
 */

export interface Value {
  /**
   * Name of attribute value.
   */
  name: string;
  /**
   * Description of attribute value shown in completion and hover.
   */
  description?: string | MarkupDescription;
  /**
   * A list of references for the attribute value shown in completion and hover.
   */
  references?: Reference[];
}
