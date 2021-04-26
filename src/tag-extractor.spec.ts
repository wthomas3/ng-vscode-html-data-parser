import { TagExtractor } from './tag-extractor';

describe('TagExtractor', () => {
  let tagExtractor: TagExtractor;

  beforeEach(() => {
    tagExtractor = new TagExtractor();
  });

  describe('extractTag', () => {
    it('should be undefined when there is no class', () => {
      const code = `
        export type Testing = 'value1' | 'value2';
      `;

      const tag = tagExtractor.extractTag(code);

      expect(tag).toBeFalsy();
    });

    it('should be undefined when there is no component or directive', () => {
      const code = `
        export class TestClass {
          public property1: string = 'Testing';

          public method1(): void {
            console.log('testing');
          }
        }
      `;

      const tag = tagExtractor.extractTag(code);

      expect(tag).toBeFalsy();
    });

    it('should be undefined when there is no component arguments', () => {
      const code = `
        import { Component } from '@angular/core';

        @Component()
        export class TestElementComponent { }
      `;

      const tag = tagExtractor.extractTag(code);

      expect(tag).toBeFalsy();
    });

    it('should be undefined when there is no component selector', () => {
      const code = `
        import { Component } from '@angular/core';

        @Component({ template: 'Hello world!' })
        export class TestElementComponent { }
      `;

      const tag = tagExtractor.extractTag(code);

      expect(tag).toBeFalsy();
    });

    it('should have a description', () => {
      const code = `
        import { Component } from '@angular/core';

        /**
         * Test element description.
         */
        @Component({ selector: 'test-element' })
        export class TestElementComponent { }
      `;

      const tag = tagExtractor.extractTag(code);

      expect(tag?.description).toBe('Test element description.');
    });

    describe('Components', () => {
      it('should extract a tag with no description and no attributes', () => {
        const code = `
          import { Component } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent { }
        `;

        const tag = tagExtractor.extractTag(code);

        expect(tag).toBeTruthy();
        expect(tag?.name).toEqual('test-element');
        expect(tag?.description).toBe('');
        expect(tag?.attributes).toBeTruthy();
        expect(tag?.attributes?.length).toBe(0);
      });
    });

    describe('Directives', () => {
      // todo: this will need to be removed when we support attribute selectors
      it('should be undefined when selector doesn\'t have an element tag', () => {
        const code = `
          import { Directive } from '@angular/core';

          @Directive({ selector: 'input[test]' })
          export class TestElementDirective { }
        `;

        const tag = tagExtractor.extractTag(code);

        expect(tag).toBeFalsy();
      });

      it('should extract a tag with no description and no attributes', () => {
        const code = `
          import { Directive } from '@angular/core';

          @Directive({ selector: 'test-element' })
          export class TestElementDirective { }
        `;

        const tag = tagExtractor.extractTag(code);

        expect(tag).toBeTruthy();
        expect(tag?.name).toEqual('test-element');
        expect(tag?.description).toBe('');
        expect(tag?.attributes).toBeTruthy();
        expect(tag?.attributes?.length).toBe(0);
      });

      it('should extract a tag from multiple selectors', () => {
        const code = `
          import { Directive } from '@angular/core';

          @Directive({ selector: 'test-element, input[test]' })
          export class TestElementDirective { }
        `;

        const tag = tagExtractor.extractTag(code);

        expect(tag).toBeTruthy();
        expect(tag?.name).toEqual('test-element');
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

        const tag = tagExtractor.extractTag(code);

        expect(tag?.attributes?.length).toBe(1);
        expect(tag?.attributes?.[0]?.name).toBe('testAttribute');
      });

      it('should have an ouput attribute', () => {
        const code = `
          import { Component, EventEmitter, Output } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent {
            @Output() tested = new EventEmitter();
          }
        `;

        const tag = tagExtractor.extractTag(code);

        expect(tag?.attributes?.length).toBe(1);
        expect(tag?.attributes?.[0]?.name).toBe('tested');
      });
      

      it('should not have non-input or non-output attributes', () => {
        const code = `
          import { Component } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent {
            testAttribute = '';
          }
        `;

        const tag = tagExtractor.extractTag(code);

        expect(tag?.attributes?.length).toBe(0);
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
        const tag = tagExtractor.extractTag(code);

        expect(tag?.attributes?.[0]?.description).toBe('Test attribute description.');
      });
    });
  });
  
  describe('extractTags', () => {
    it('should not extract tags when there are no classes', () => {
      const code = `
        export type Testing = 'value1' | 'value2';
      `;

      const tags = tagExtractor.extractTags(code);

      expect(tags.length).toBe(0);
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

      const tags = tagExtractor.extractTags(code);

      expect(tags.length).toBe(0);
    });

    it('should not extract tags when there are no component arguments', () => {
      const code = `
        import { Component } from '@angular/core';

        @Component()
        export class TestElementComponent { }
      `;

      const tags = tagExtractor.extractTags(code);

      expect(tags.length).toBe(0);
    });

    it('should not extract tags when there are no component selectors', () => {
      const code = `
        import { Component } from '@angular/core';

        @Component({ template: 'Hello world!' })
        export class TestElementComponent { }
      `;

      const tags = tagExtractor.extractTags(code);

      expect(tags.length).toBe(0);
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

      const tags = tagExtractor.extractTags(code);

      expect(tags.length).toBe(1);
      expect(tags[0].description).toBe('Test element description.');
    });

    describe('Components', () => {
      it('should extract a tag with no description and no attributes', () => {
        const code = `
          import { Component } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent { }
        `;

        const tags = tagExtractor.extractTags(code);

        expect(tags.length).toBe(1);
        expect(tags[0].name).toEqual('test-element');
        expect(tags[0].description).toBe('');
        expect(tags[0].attributes).toBeTruthy();
        expect(tags[0].attributes?.length).toBe(0);
      });
    });

    describe('Directives', () => {
      // todo: this will need to be removed when we support attribute selectors
      it('should not extract tags when selectors don\'t have element tags', () => {
        const code = `
          import { Directive } from '@angular/core';

          @Directive({ selector: 'input[test]' })
          export class TestElementDirective { }
        `;

        const tags = tagExtractor.extractTags(code);

        expect(tags.length).toBe(0);
      });

      it('should extract a tag with no description and no attributes', () => {
        const code = `
          import { Directive } from '@angular/core';

          @Directive({ selector: 'test-element' })
          export class TestElementDirective { }
        `;

        const tags = tagExtractor.extractTags(code);

        expect(tags.length).toBe(1);
        expect(tags[0].name).toEqual('test-element');
        expect(tags[0].description).toBe('');
        expect(tags[0].attributes).toBeTruthy();
        expect(tags[0].attributes?.length).toBe(0);
      });

      it('should extract a tag from multiple selectors', () => {
        const code = `
          import { Directive } from '@angular/core';

          @Directive({ selector: 'test-element, input[test]' })
          export class TestElementDirective { }
        `;

        const tags = tagExtractor.extractTags(code);

        expect(tags.length).toBe(1);
        expect(tags[0]?.name).toEqual('test-element');
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

        const tags = tagExtractor.extractTags(code);

        expect(tags[0].attributes?.length).toBe(1);
        expect(tags[0].attributes?.[0]?.name).toBe('testAttribute');
      });

      it('should have an ouput attribute', () => {
        const code = `
          import { Component, EventEmitter, Output } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent {
            @Output() tested = new EventEmitter();
          }
        `;

        const tags = tagExtractor.extractTags(code);

        expect(tags[0].attributes?.length).toBe(1);
        expect(tags[0].attributes?.[0]?.name).toBe('tested');
      });
      

      it('should not have non-input or non-output attributes', () => {
        const code = `
          import { Component } from '@angular/core';

          @Component({ selector: 'test-element' })
          export class TestElementComponent {
            testAttribute = '';
          }
        `;

        const tags = tagExtractor.extractTags(code);

        expect(tags[0].attributes?.length).toBe(0);
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
        const tags = tagExtractor.extractTags(code);

        expect(tags[0].attributes?.[0]?.description).toBe('Test attribute description.');
      });
    });
  });
});