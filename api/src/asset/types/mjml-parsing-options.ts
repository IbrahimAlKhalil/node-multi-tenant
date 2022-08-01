import mjml2html from 'mjml';

export interface MJMLParsingOptions
  extends Omit<Parameters<typeof mjml2html>[1], 'filePath' | 'actualPath'> {
  variables: Record<string, any>;
}
