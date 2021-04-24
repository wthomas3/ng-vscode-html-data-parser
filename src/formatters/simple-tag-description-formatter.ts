import ts from 'typescript';
import { TagDescriptionFormatter } from './tag-description-formatter';

/**
 * Creates a tag description that simply matches the entire comment stored in the component's JSDoc.
 * 
 * @param jsDoc The parsed JSDoc for the component.
 * @returns The formatted tag description.
 */
export const SimpleTagDescriptionFormatter: TagDescriptionFormatter = (jsDoc: ts.JSDoc) => {
  return jsDoc.comment ?? '';
};
