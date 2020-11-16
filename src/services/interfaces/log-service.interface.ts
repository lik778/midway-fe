export interface LogServiceInterface {
  getLogConfig(): string;
  getLog(): string;
  setLog(context:string): string;
}
