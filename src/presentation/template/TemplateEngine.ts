import { TemplateName } from './TemplateName';

export abstract class TemplateEngine {
  abstract render(name: TemplateName, context?: any): Promise<string>;
}
