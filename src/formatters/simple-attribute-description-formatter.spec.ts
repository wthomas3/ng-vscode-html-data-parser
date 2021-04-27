import * as ts from 'typescript';
import { SimpleAttributeDescriptionFormatter } from './simple-attribute-description-formatter';

describe('SimpleAttributeDescriptionFormatter', () => {
  it('should be empty', () => {
    const jsDoc = ts.factory.createJSDocComment('');

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, false, false);

    expect(comment).toBe('');
  });
  
  it('should be @Input', () => {
    const jsDoc = ts.factory.createJSDocComment('');

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, true, false);

    expect(comment).toBe('_@Input_');
  });
  
  it('should be @Output', () => {
    const jsDoc = ts.factory.createJSDocComment('');

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, false, true);

    expect(comment).toBe('_@Output_');
  });
  
  it('should be @Input and @Output', () => {
    const jsDoc = ts.factory.createJSDocComment('');

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, true, true);

    expect(comment).toBe('_@Input_\n\n_@Output_');
  });

  it('should be the comment', () => {
    const jsDoc = ts.factory.createJSDocComment('Testing');

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, false, false);

    expect(comment).toBe('Testing');
  });
  
  it('should format the param tag', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocParameterTag(
        ts.factory.createIdentifier('param'), 
        ts.factory.createIdentifier('testing'), 
        false, undefined, undefined, 
        'This is the comment.')
    ]);

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, false, false);

    expect(comment).toBe('_@param_ `testing` — This is the comment.');
  });
  
  it('should format the param tag with no comment', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocParameterTag(
        ts.factory.createIdentifier('param'), 
        ts.factory.createIdentifier('testing'), 
        false)
    ]);

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, false, false);

    expect(comment).toBe('_@param_ `testing` —');
  });
  
  it('should format the see tag', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocSeeTag(
        ts.factory.createIdentifier('see'),
        ts.factory.createJSDocNameReference(ts.factory.createIdentifier('')),
        'This is the comment.')
    ]);

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, false, false);

    expect(comment).toBe('_@see_ — This is the comment.');
  });
  
  it('should format the see tag with no comment', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocSeeTag(
        ts.factory.createIdentifier('see'),
        ts.factory.createJSDocNameReference(ts.factory.createIdentifier('')))
    ]);

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, false, false);

    expect(comment).toBe('_@see_ —');
  });
  
  it('should format the default tag', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocDeprecatedTag(
        ts.factory.createIdentifier('deprecated'),
        'This is the comment.')
    ]);

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, false, false);

    expect(comment).toBe('_@deprecated_ This is the comment.');
  });
  
  it('should format the default tag with no comment', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocDeprecatedTag(ts.factory.createIdentifier('deprecated'))
    ]);

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, false, false);

    expect(comment).toBe('_@deprecated_');
  });
  
  it('should format the default tag with @Input and @Output', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocDeprecatedTag(
        ts.factory.createIdentifier('deprecated'),
        'This is the comment.')
    ]);

    const comment = SimpleAttributeDescriptionFormatter(jsDoc, true, true);

    expect(comment).toBe('_@deprecated_ This is the comment.\n\n_@Input_\n\n_@Output_');
  });
});