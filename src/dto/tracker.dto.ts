import { IsObject, IsString } from 'class-validator';
import { TrackerType } from '../enums/tracker';

export class TrackerDTO {
  @IsString()
  readonly eventType: TrackerType;

  @IsObject()
  readonly data: any;
}
