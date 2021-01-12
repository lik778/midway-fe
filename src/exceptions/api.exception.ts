// tips: 后台管理系统请求midway-service报错
export class ApiException {
  private code: number;
  private success: boolean;
  private message: string;
  constructor(code: number, success: boolean, message: string) {
    this.code = code;
    this.success = success;
    this.message = message;
  }
  public getCode (): number {
    return this.code;
  }

  public setCode(code: number) {
    this.code = code;
  }

  public getSuccess (): boolean {
    return this.success;
  }

  public setSuccess(success: boolean) {
    this.success = success;
  }

  public getMessage (): string {
    return this.message;
  }

  public setMessage(message: string) {
    this.message = message;
  }
}
