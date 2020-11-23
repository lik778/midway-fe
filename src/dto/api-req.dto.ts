import { IsJSON, IsString } from 'class-validator';

export class ApiQeqDTO {
  @IsString()
  readonly path: string;

  @IsString()
  readonly method: string;

  @IsString()
  readonly params: string;
}
