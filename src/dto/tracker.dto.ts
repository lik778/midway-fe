import { IsObject, IsString } from 'class-validator';
import { TrackerType } from '../enums/tracker';

export class TrackerDTO {
  @IsString()
  readonly type: TrackerType;

  @IsObject()
  readonly data: any;
}
