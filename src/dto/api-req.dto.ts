import { IsString, IsJSON } from 'class-validator';

export class ApiQeqDTO {
  @IsString()
  readonly path: string;

  @IsString()
  readonly method: string;

  @IsJSON()
  readonly params: any;
}
