import * as ts from 'typescript';
import { AttributeDescriptionFormatter } from './attribute-description-formatter';

/**
 * Creates an attribute description that simply matches the comment and tags stored in the attribute's JSDoc.
 * 
 * @param jsDoc The parsed JSDoc for the attribute.
 * @returns The formatted attribute description.
 */
export const SimpleAttributeDescriptionFormatter: AttributeDescriptionFormatter = (jsDoc: ts.JSDoc, input: boolean, output: boolean) => {  
  const MDASH = '—';
  let comment = jsDoc?.comment ?? '';
  if (jsDoc.tags) {
    for (const tag of jsDoc.tags) {
      switch (tag.tagName.text) {
      case 'param': {
        // todo: which type of jsDoc actually has the name property?
        const paramName = (tag as unknown as { name: ts.Identifier }).name.text;
        comment += `\n\n_@param_ \`${paramName}\` ${MDASH} ${tag.comment ?? ''}`; 
        break;
      }
      case 'see':
        comment += `\n\n_@see_ ${MDASH} ${tag.comment ?? ''}`;
        break;
      default:
        comment += `\n\n_@${tag.tagName.text}_ ${tag.comment ?? ''}`;
        break;
      }
    }
  }
  if (input) {
    comment += '\n\n_@Input_';
  }
  if (output) {
    comment += '\n\n_@Output_';
  }
  return comment.trim();
};