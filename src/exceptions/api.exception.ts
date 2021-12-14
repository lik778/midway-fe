// tips: 后台管理系统请求midway-service报错
/**
 * @private code 错误码
 * @private success 状态
 * @private message 错误信息
 * @private type 用于定位是哪里出的报错
 * @private info 一些和请求有关的信息
 */
export class ApiException {
  private code: number;
  private success: boolean;
  private message: string;
  private type: string
  private info?: any;
  constructor(code: number, success: boolean, message: string, type: string, info?: string) {
    this.code = code;
    this.success = success;
    this.message = message;
    this.type = type;
    this.info = info;
  }
  public getCode(): number {
    return this.code;
  }

  public setCode(code: number) {
    this.code = code;
  }

  public getSuccess(): boolean {
    return this.success;
  }

  public setSuccess(success: boolean) {
    this.success = success;
  }

  public getMessage(): string {
    return this.message;
  }

  public setMessage(message: string) {
    this.message = message;
  }

  public getInfo(): string {
    return this.info;
  }

  public setInfo(info: any) {
    this.info = info;
  }

  public getType(): string {
    return this.type;
  }

  public setType(type: any) {
    this.type = type;
  }
}
