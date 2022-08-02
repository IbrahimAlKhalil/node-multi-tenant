import mjml2html from 'mjml';

type BaseOptions = Omit<
  Exclude<Parameters<typeof mjml2html>[1], undefined>,
  'filePath' | 'actualPath'
>;

export interface MJMLParsingOptions extends BaseOptions {
  variables?: Record<string, any>;
}
