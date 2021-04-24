import * as ts from 'typescript';

import { AttributeDescriptionFormatter } from './attribute-description-formatter';
import { Attribute, Tag } from './html-data';
import { TagDescriptionFormatter } from './tag-description-formatter';

// todo: should we support @ignore to not add documentation?

// todo: what type actually holds jsDoc?
interface JsDocNode {
  jsDoc?: ts.JSDoc[];
}

const SimpleAttributeDescriptionFormatter: AttributeDescriptionFormatter = (jsDoc: ts.JSDoc) => {
  return jsDoc.comment ?? '';
};

const SimpleTagDescriptionFormatter: TagDescriptionFormatter = (jsDoc: ts.JSDoc) => {
  return jsDoc.comment ?? '';
};

export class TagExtractor {
  private readonly sourceFile!: ts.SourceFile;
  public tagFormatter: TagDescriptionFormatter = SimpleTagDescriptionFormatter;
  public attributeFormatter: AttributeDescriptionFormatter = SimpleAttributeDescriptionFormatter;

  public constructor(code: string) {
    this.sourceFile = ts.createSourceFile('x.ts', code, ts.ScriptTarget.Latest);
  }

  public extractTag(): Tag | undefined {
    const classDeclaration = this.findFirstNode(this.sourceFile, ts.SyntaxKind.ClassDeclaration);
    if (!classDeclaration) { return undefined; }

    return this.extractTagFromNode(classDeclaration as ts.ClassDeclaration);
  }

  // todo: this gets duplicate components
  public extractTags(): Tag[] {
    const tags: Tag[] = [];
    const components = this.findNodes(this.sourceFile, ts.SyntaxKind.ClassDeclaration);
    components.forEach(c => {
      const tag = this.extractTagFromNode(c as ts.ClassDeclaration);
      if (tag) {
        tags.push(tag);
      }
    });
    return tags;
  }

  private extractTagFromNode(component: ts.ClassDeclaration): Tag | undefined {
    const componentSelector = this.getComponentSelector(component);
    if (!componentSelector) { return; }

    const jsDoc = this.getJsDoc(component);
    const classComment = jsDoc ? this.tagFormatter(jsDoc) : '';

    return {
      name: componentSelector,
      description: classComment,
      attributes: this.getAttributes(component)
    };
  }

  private findFirstNode(node: ts.Node, kind: ts.SyntaxKind): ts.Node | undefined {
    if (node.kind === kind) {
      return node;
    }

    let matchingNode: ts.Node | undefined;
    node.forEachChild(child => {
      if (matchingNode) {
        return;
      }

      if (child.kind === kind) {
        matchingNode = child;
      } else {
        matchingNode = this.findFirstNode(child, kind);
      }
    });
    return matchingNode;
  }

  private findNodes(node: ts.Node, kind: ts.SyntaxKind): ts.Node[] {
    const nodes: ts.Node[] = [];
    if (node.kind === kind) {
      nodes.push(node);
    }

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

    const selectorProperty = decoratorArguments.properties.filter((p: any) => p.name.escapedText === 'selector')?.[0] as (ts.PropertyAssignment | undefined);
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
