import { FormType } from '../enums'
import { ColProps } from 'antd'
export interface ButtonItem {
  text: string; // 提交页面文案
  size: any;
  className?: any;
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

export interface FormConfig {
  name: string;
  children: FormItem[];
  buttonConfig?: ButtonItem;
  width?: number;
  labelAlign?: 'left' | 'right',
  useLabelCol?: ColProps;
}
export interface FormItem {
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
  tip?: string, // 文案说明,
  btnConfig?: any, // 输入框需要增加额外标签
  maxNum?: number,
  minNum?: number,
  images?: ImagesItem[],// 图片多种情况
  disabled?: boolean;
  showCount?: boolean;
  onChange?: (...args: any) => void; //给配置文件项，增加了onChange属性
  display?: boolean;
  formItemWidth?: number,

  // 下面三个属性必须重写
  className?: string, // 自定义样式,
}

export interface ImagesItem {
  text: string;
  name: string;
  rule?: any[];
  maxSize?: number
}
