import * as ts from 'typescript';
import { TagDescriptionFormatter } from './tag-description-formatter';

/**
 * Creates a tag description that simply matches the comment and tags stored in the component's JSDoc.
 * 
 * @param jsDoc The parsed JSDoc for the component.
 * @returns The formatted tag description.
 */
export const SimpleTagDescriptionFormatter: TagDescriptionFormatter = (jsDoc: ts.JSDoc) => {  
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
  return comment.trim();
};
