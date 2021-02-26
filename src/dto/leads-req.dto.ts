import { IsString } from 'class-validator';

export class LeadsReqDTO {
  @IsString()
  readonly shopName: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly contact: string;

  @IsString()
  readonly content: string;
}
