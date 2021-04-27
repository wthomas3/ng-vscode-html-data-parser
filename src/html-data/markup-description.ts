/**
 * Description of attribute value shown in completion and hover.
 */
export interface MarkupDescription {
  /**
   * Whether `value` should be rendered as plaintext or markdown.
   */
  kind: 'plaintext' | 'markdown';
  /**
   * Description shown in completion and hover.
   */
  value: string;
}
