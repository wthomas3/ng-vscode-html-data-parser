import * as ts from 'typescript';

export type AttributeDescriptionFormatter = (jsDoc: ts.JSDoc, input: boolean, output: boolean) => string;
