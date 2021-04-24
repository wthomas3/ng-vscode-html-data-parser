import ts from 'typescript';
import { AttributeDescriptionFormatter } from './attribute-description-formatter';

/**
 * Creates an attribute description that simply matches the entire comment stored in the attribute's JSDoc.
 * 
 * @param jsDoc The parsed JSDoc for the attribute.
 * @returns The formatted attribute description.
 */
export const SimpleAttributeDescriptionFormatter: AttributeDescriptionFormatter = (jsDoc: ts.JSDoc) => {
  return jsDoc.comment ?? '';
};