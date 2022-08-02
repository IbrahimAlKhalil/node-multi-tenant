export interface JobMailData {
  subject: string;
  from: string;
  to: string;
  template: string;
  variables?: Record<string, any>;
}
