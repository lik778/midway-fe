import { FormType, PageType } from '../enums'

export interface WildCatConfig {
  name: string;
  type: PageType;
  formConfig?: FormConfig;
}

export interface ButtonItem {
  text: string; // 提交页面文案
  size: any;
}

export interface FormConfig {
  name: string;
  children: FormItem[];
  buttonConfig?: ButtonItem;
}

export interface OptionItem {
  key: string;
  value: any;
}

export interface FormItem {
  width: number; //长度
  label: string; // 页面标签
  type: FormType; // 表单类型
  name: string; // 当前表单名字
  required: boolean; // 是否必填
  placeholder?: string; // 提示
  defaultValue?: any; // 默认值
  validator?: any; // 校验
  options?: OptionItem[];
}
