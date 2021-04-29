import * as ts from 'typescript';

import { Attribute, Tag } from './html-data';
import {
  AttributeDescriptionFormatter, SimpleAttributeDescriptionFormatter, 
  SimpleTagDescriptionFormatter, TagDescriptionFormatter
} from './formatters';

// todo: should we support @ignore to not add documentation?
// todo: add a class parser that we can query without fear of missing parts and that makes this class super simple
// todo: rename to `Extractor` since this doesn't only extract tags now

// disclaimer: there are a fair number of assumptions here that the Angular project this runs against is able to build and run and follows best practices.

/**
 * A type that contains HTML data extracted from a component or directive class.
 */
export type ExtractData = {
  tags: Tag[];
  globalAttributes: Attribute[];
};

// todo: what type actually holds jsDoc?
interface JsDocNode { jsDoc?: ts.JSDoc[]; }

/**
 * A utility class to extract custom HTML-data tags from components and directives found within an Angular TypeScript file.
 */
export class TagExtractor {
  /**
   * Gets or sets the formatter used when creating a component's description for a tag.
   */
  public tagFormatter: TagDescriptionFormatter = SimpleTagDescriptionFormatter;
  /**
   * Gets or sets the formatter used when creating a component attribute's description.
   */
  public attributeFormatter: AttributeDescriptionFormatter = SimpleAttributeDescriptionFormatter;
  
  /**
   * Attempts to extract a custom HTML-data from all components and directives found in the supplied TypeScript code.
   * 
   * @param code The Angular TypeScript source code.
   * @returns A set of custom HTML-data created from components in the code file.
   */
  public extract(code: string): ExtractData {
    const sourceFile = ts.createSourceFile('x.ts', code, ts.ScriptTarget.Latest);

    const exportData: ExtractData = {
      tags: [],
      globalAttributes: []
    };
    const components = this.findNodes(sourceFile, ts.SyntaxKind.ClassDeclaration);
    components.forEach(c => {
      const data = this.extractHtmlDataFromNode(c as ts.ClassDeclaration);
      data.tags.forEach(tag => exportData.tags.push(tag));
      data.globalAttributes.forEach(attr => exportData.globalAttributes.push(attr));
    });
    return exportData;
  }

  private extractHtmlDataFromNode(component: ts.ClassDeclaration): ExtractData {
    const data: ExtractData = {
      tags: [],
      globalAttributes: []
    };

    const componentSelector = this.getComponentSelector(component);
    if (!componentSelector) { return data; }

    const jsDoc = this.getJsDoc(component);
    const description = jsDoc ? this.tagFormatter(jsDoc) : '';
    const attributes = this.getAttributes(component);

    componentSelector
      .split(',')
      .map(s => s.trim())
      .forEach(selector => {
        if (!selector.includes('[')) { // element name. e.g.: "test-element"
          data.tags.push({
            name: selector,
            description: description,
            attributes: attributes
          });
        } else if (selector.indexOf('[') !== 0) { // element attribute. e.g.: "test-element[required]"
          const tagName = selector.substr(0, selector.indexOf('['));
          const attributeName = selector.substring(selector.indexOf('[') + 1, selector.indexOf(']'));
          data.tags.push({
            name: tagName,
            attributes: [{
              name: attributeName,
              description: description
            }]
          });
        } else { // global attribute. e.g.: "[test-attribute]"          
          const attributeName = selector.substring(selector.indexOf('[') + 1, selector.indexOf(']'));
          data.globalAttributes.push({
            name: attributeName,
            description: description
          });
        }
      });

    return data;
  }

  private findNodes(node: ts.Node, kind: ts.SyntaxKind): ts.Node[] {
    const nodes: ts.Node[] = [];
    node.forEachChild(child => {
      if (child.kind === kind) {
        nodes.push(child);
      }
      this.findNodes(child, kind).forEach(n => nodes.push(n));
    });
    return nodes;
  }

  private getAttributes(classDeclaration: ts.ClassDeclaration): Attribute[] {
    return classDeclaration.members
      .map(m => ({
        member: m,
        input: m.decorators?.some(d => this.getExpressionEscapedText(d.expression) === 'Input') ?? false,
        output: m.decorators?.some(d => this.getExpressionEscapedText(d.expression) === 'Output') ?? false
      }))
      .filter(m => m.input || m.output)
      .map(m => {
        const jsDoc = this.getJsDoc(m.member);
        const comment = jsDoc ? this.attributeFormatter(jsDoc, m.input, m.output) : '';
        return {
          name: (m.member.name as ts.Identifier)?.escapedText.toString() ?? '',
          description: comment
        };
      })
      .filter(m => m.name);
  }

  private getComponentSelector(classDeclaration: ts.ClassDeclaration): string | undefined {
    const componentDecorator = classDeclaration.decorators
      ?.filter(d =>
        this.getExpressionEscapedText(d.expression) === 'Component' ||
        this.getExpressionEscapedText(d.expression) === 'Directive'
      )?.[0];
    if (!componentDecorator) { return undefined; }

    const decoratorArguments = (componentDecorator.expression as any).arguments?.[0]; // ts.ObjectLiteral | undefined
    if (!decoratorArguments) { return undefined; }

    const properties = decoratorArguments.expresson?.properties ?? decoratorArguments.properties ?? [];
    const selectorProperty = properties?.filter((p: any) => p.name.escapedText === 'selector')?.[0] as (ts.PropertyAssignment | undefined);
    if (selectorProperty) {
      return (selectorProperty.initializer as ts.StringLiteral).text;
    }
    return undefined;
  }

  private getExpressionEscapedText(node: ts.Node): string {
    return ((node as ts.CallExpression)?.expression as ts.Identifier)?.escapedText.toString() ?? '';
  }

  private getJsDoc(node: ts.Node): ts.JSDoc | undefined { return (node as JsDocNode).jsDoc?.[0]; }
}
