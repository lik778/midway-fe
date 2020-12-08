export interface ServiceResponse<T> {
  code: number;
  data: T;
  success: boolean;
  message: string;
  requestId: string;
  timestamp: string;
  exception: string;
  exceptionClass: string;
}
