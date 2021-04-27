import { TagExtractor } from './tag-extractor';

describe('TagExtractor', () => {
  let tagExtractor: TagExtractor;

  beforeEach(() => {
    tagExtractor = new TagExtractor();
  });
  
  describe('extract', () => {
    it('should not extract tags when there are no classes', () => {
      const code = `
        export type Testing = 'value1' | 'value2';
      `;

      const extract = tagExtractor.extract(code);

      expect(extract.tags.length).toBe(0);
    });

    it('should not extract tags when there are no component or directive', () => {
      const code = `
        export class TestClass {
          public property1: string = 'Testing';

          public method1(): void {
            console.log('testing');
          }
        }
      `;

      const extract = tagExtractor.extract(code);

      expect(extract.tags.length).toBe(0);
    });

    it('should not extract tags when there are no component arguments', () => {
      const code = `
        import { Component } from '@angular/core';

        @Component()
        export class TestElementComponent { }
      `;

      const extract = tagExtractor.extract(code);

      expect(extract.tags.length).toBe(0);
    });

    it('should not extract tags when there are no component selectors', () => {
      const code = `
        import { Component } from '@angular/core';

        @Component({ template: 'Hello world!' })
        export class TestElementComponent { }
      `;

      const extract = tagExtractor.extract(code);

      expect(extract.tags.length).toBe(0);
    });

    it('should have a tag with a description', () => {
      const code = `
        import { Component } from '@angular/core';

        /**
         * Test element description.
         */
        @Component({ selector: 'test-element' })
        export class TestElementComponent { }
      `;

      const extract = tagExtractor.extract(code);

      expect(extract.tags.length).toBe(1);
      expect(extract.tags[0].description).toBe('Test element description.');
    });

    describe('Components', () => {
      it('should extract a tag with no description and no attributes', () => {
        const code = `
          import { Component } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent { }
        `;

        const extract = tagExtractor.extract(code);

        expect(extract.tags.length).toBe(1);
        expect(extract.tags[0].name).toEqual('test-element');
        expect(extract.tags[0].description).toBe('');
        expect(extract.tags[0].attributes).toBeTruthy();
        expect(extract.tags[0].attributes?.length).toBe(0);
      });
    });

    describe('Directives', () => {
      it('should extract a tag with no description and no attributes', () => {
        const code = `
          import { Directive } from '@angular/core';

          @Directive({ selector: 'test-element' })
          export class TestElementDirective { }
        `;

        const extract = tagExtractor.extract(code);

        expect(extract.tags.length).toBe(1);
        expect(extract.tags[0].name).toEqual('test-element');
        expect(extract.tags[0].description).toBe('');
        expect(extract.tags[0].attributes).toBeTruthy();
        expect(extract.tags[0].attributes?.length).toBe(0);
      });

      it('should extract tags from multiple selectors', () => {
        const code = `
          import { Directive } from '@angular/core';

          @Directive({ selector: 'test-element, input[test]' })
          export class TestElementDirective { }
        `;

        const extract = tagExtractor.extract(code);

        expect(extract.tags.length).toBe(2);
        expect(extract.tags[0]?.name).toEqual('test-element');
        expect(extract.tags[1]?.name).toEqual('input');
      });
    });

    describe('Attributes', () => {
      it('should have an input attribute', () => {
        const code = `
          import { Component, Input } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent {
            @Input() testAttribute = '';
          }
        `;

        const extract = tagExtractor.extract(code);

        expect(extract.tags[0].attributes?.length).toBe(1);
        expect(extract.tags[0].attributes?.[0]?.name).toBe('testAttribute');
      });

      it('should have an ouput attribute', () => {
        const code = `
          import { Component, EventEmitter, Output } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent {
            @Output() tested = new EventEmitter();
          }
        `;

        const extract = tagExtractor.extract(code);

        expect(extract.tags[0].attributes?.length).toBe(1);
        expect(extract.tags[0].attributes?.[0]?.name).toBe('tested');
      });
      

      it('should not have non-input or non-output attributes', () => {
        const code = `
          import { Component } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent {
            testAttribute = '';
          }
        `;

        const extract = tagExtractor.extract(code);

        expect(extract.tags[0].attributes?.length).toBe(0);
      });
      
      it('should have a description', () => {
        const code = `
          import { Component, Input } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent {
            /**
             * Test attribute description.
             */
            @Input() testAttribute = '';
          }
        `;

        tagExtractor.attributeFormatter = (jsDoc) => {
          return jsDoc.comment ?? '';
        };
        const extract = tagExtractor.extract(code);

        expect(extract.tags[0].attributes?.[0]?.description).toBe('Test attribute description.');
      });

      it('should extract tags when selectors have element attributes', () => {
        const code = `
          import { Directive } from '@angular/core';

          /**
           * Test attribute description.
           */
          @Directive({ selector: 'input[test]' })
          export class TestElementDirective { }
        `;

        tagExtractor.attributeFormatter = (jsDoc) => {
          return jsDoc.comment ?? '';
        };
        const extract = tagExtractor.extract(code);

        expect(extract.tags.length).toBe(1);
        expect(extract.tags[0].name).toBe('input');
        expect(extract.tags[0].attributes?.length).toBe(1);
        expect(extract.tags[0].attributes?.[0].name).toBe('test');
        expect(extract.tags[0].attributes?.[0].description).toBe('Test attribute description.');
      });
    
      it('should extract global attributes when selectors have global attributes', () => {
        const code = `
          import { Directive } from '@angular/core';
  
          /**
           * Test attribute description.
           */
          @Directive({ selector: '[test]' })
          export class TestElementDirective { }
        `;
  
        tagExtractor.attributeFormatter = (jsDoc) => {
          return jsDoc.comment ?? '';
        };
        const extract = tagExtractor.extract(code);
  
        expect(extract.globalAttributes.length).toBe(1);
        expect(extract.globalAttributes[0].name).toBe('test');
        expect(extract.globalAttributes[0].description).toBe('Test attribute description.');
      });
    });
  });
});