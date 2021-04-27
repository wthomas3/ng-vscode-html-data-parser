import * as ts from 'typescript';
import { SimpleTagDescriptionFormatter } from './simple-tag-description-formatter';

describe('SimpleTagDescriptionFormatter', () => {
  it('should be empty', () => {
    const jsDoc = ts.factory.createJSDocComment('');

    const comment = SimpleTagDescriptionFormatter(jsDoc);

    expect(comment).toBe('');
  });

  it('should be the comment', () => {
    const jsDoc = ts.factory.createJSDocComment('Testing');

    const comment = SimpleTagDescriptionFormatter(jsDoc);

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

    const comment = SimpleTagDescriptionFormatter(jsDoc);

    expect(comment).toBe('_@param_ `testing` — This is the comment.');
  });
  
  it('should format the param tag with no comment', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocParameterTag(
        ts.factory.createIdentifier('param'), 
        ts.factory.createIdentifier('testing'), 
        false)
    ]);

    const comment = SimpleTagDescriptionFormatter(jsDoc);

    expect(comment).toBe('_@param_ `testing` —');
  });
  
  it('should format the see tag', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocSeeTag(
        ts.factory.createIdentifier('see'),
        ts.factory.createJSDocNameReference(ts.factory.createIdentifier('')),
        'This is the comment.')
    ]);

    const comment = SimpleTagDescriptionFormatter(jsDoc);

    expect(comment).toBe('_@see_ — This is the comment.');
  });
  
  it('should format the see tag with no comment', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocSeeTag(
        ts.factory.createIdentifier('see'),
        ts.factory.createJSDocNameReference(ts.factory.createIdentifier('')))
    ]);

    const comment = SimpleTagDescriptionFormatter(jsDoc);

    expect(comment).toBe('_@see_ —');
  });
  
  it('should format the default tag', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocDeprecatedTag(
        ts.factory.createIdentifier('deprecated'),
        'This is the comment.')
    ]);

    const comment = SimpleTagDescriptionFormatter(jsDoc);

    expect(comment).toBe('_@deprecated_ This is the comment.');
  });
  
  it('should format the default tag with no comment', () => {
    const jsDoc = ts.factory.createJSDocComment('', [
      ts.factory.createJSDocDeprecatedTag(ts.factory.createIdentifier('deprecated'))
    ]);

    const comment = SimpleTagDescriptionFormatter(jsDoc);

    expect(comment).toBe('_@deprecated_');
  });
});