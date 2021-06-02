import { FormType } from '../enums'
import { ColProps } from 'antd'
import { ReactNode } from 'react'
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
  width?: number | string;
  labelAlign?: 'left' | 'right',
  useLabelCol?: ColProps;
  // 有些组件确实不适合封装 但是也要放在表单里管理 则写自定义的组件进去
  customerFormItemList?: CustomerFormItem[]
}

export interface CustomerFormItem {
  key: string,
  index: number,// 决定当前这个自定义组件放在第几位 不填就是最后
  node: ReactNode
}
export interface FormItem {
  label: string; // 页面标签
  type: FormType; // 表单类型
  name: string; // 字段名
  required: boolean; // 是否必填
  patternList?: any[]; // 正则
  placeholder?: string; // 提示
  options?: OptionItem[] | OptionCheckBox[];
  maxLength?: number
  minLength?: number,
  tip?: string | ReactNode, // 文案说明,
  btnConfig?: ReactNode, // 输入框需要增加额外标签
  maxNum?: number,
  minNum?: number,
  images?: ImagesItem[],// 图片多种情况
  imagesTipPosition?: 'bottom' | 'right',// 图片下的请求的位置
  disabled?: boolean;
  showCount?: boolean;
  onChange?: (...args: any) => void; //给配置文件项，增加了onChange属性
  display?: boolean;
  formItemWidth?: number | string,
  className?: string, // 自定义样式,
}

export interface ImagesItem {
  text: string;
  name: string;
  rule?: any[];
  maxSize?: number
}
