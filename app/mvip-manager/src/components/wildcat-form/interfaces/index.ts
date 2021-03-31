import { FormType } from '../enums'

export interface ButtonItem {
  text: string; // 提交页面文案
  size: any;
  className?: any;
}

export interface FormConfig {
  name: string;
  children: FormItem[];
  buttonConfig?: ButtonItem;
}

//这样定义，与实际的select反过来了，后期优化下
export interface OptionItem {
  key: string;
  value: any;
}

export interface OptionCheckBox {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface FormItem {
  width?: number; //长度
  label: string; // 页面标签
  type: FormType; // 表单类型
  name?: string; // 当前表单名字
  required: boolean; // 是否必填
  patternList?: any[]; // 正则
  placeholder?: string; // 提示
  defaultValue?: any; // 默认值
  validator?: any; // 校验
  options?: OptionItem[] | OptionCheckBox[];
  maxLength?: number
  minLength?: number,
  inputWidth?: number,
  tip?: string, // 文案说明,
  className?: string, // 自定义样式,
  btnConfig?: any, // 输入框需要增加额外标签
  maxNum?: number,
  minNum?: number,
  images?: ImagesItem[],// 图片多种情况
  disabled?: boolean;
  showCount?:boolean;
  onChange?:(...args:any)=>void; //给配置文件项，增加了onChange属性
  display?:boolean;
}

export interface ImagesItem {
  text: string;
  name: string;
}
