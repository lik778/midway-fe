import { IsString } from 'class-validator';

export class ApiQeqDTO {
  @IsString()
  readonly path: string;

  @IsString()
  readonly method: string;

  readonly params: string | null;
}
