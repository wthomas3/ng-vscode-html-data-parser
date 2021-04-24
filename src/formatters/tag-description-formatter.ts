import * as ts from 'typescript';

/**
 * A callback type used when the description for an element is being created.
 * 
 * @param jsDoc The parsed JSDoc for the component.
 * @returns The formatted tag description.
 */
export type TagDescriptionFormatter = (jsDoc: ts.JSDoc) => string;
