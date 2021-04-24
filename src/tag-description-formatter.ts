import * as ts from 'typescript';

export type TagDescriptionFormatter = (jsDoc: ts.JSDoc) => string;
