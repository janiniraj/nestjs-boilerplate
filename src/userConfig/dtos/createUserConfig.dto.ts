export class CreateUserConfigDto {
  userId: number;
  name: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
  userEditable?: boolean;
}
