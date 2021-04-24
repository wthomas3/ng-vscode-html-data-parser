import * as ts from 'typescript';

/**
 * A callback type used when the description for an element's attribute is being created.
 * 
 * @param jsDoc The parsed JSDoc for the attribute.
 * @param input Whether or not the attribute has the `@Input` annotation.
 * @param output Whether or not the attribute has the `@Output` annotation.
 * @returns The formatted attribute description.
 */
export type AttributeDescriptionFormatter = (jsDoc: ts.JSDoc, input: boolean, output: boolean) => string;
