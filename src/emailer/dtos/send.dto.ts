export class SendDto {
  to: string[];
  cc?: string[];
  bcc?: string[];
  from: string;
  title: string;
  subject: string;
  snippet: 'password-reset';
  params: any;
}
