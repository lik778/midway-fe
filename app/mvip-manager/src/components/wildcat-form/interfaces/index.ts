import { FormType } from '../enums'
import { ColProps } from 'antd'
import { ReactNode } from 'react'
import { ExpandShowUploadListInterface } from '@/components/img-upload/data'
import { FormLayout } from 'antd/lib/form/Form'
import { imageCropProps } from '@/components/img-upload/data'
import { ShopTDKType } from '@/enums'
export interface ButtonItem {
  text: string; // 提交页面文案
  size: any;
  className?: any;
}

export interface OptionItem {
  key: string;
  value: any;
  disabled?: boolean;
}

export type SelectOptionItem = { key: string, children?: OptionItem[] } & OptionItem

export type CheckboxOptionItem = { label: string } & OptionItem

export type RadioOptionItem = CheckboxOptionItem


export interface FormConfig {
  name: string;
  children: FormItem[];
  buttonConfig?: ButtonItem;
  width?: number | string;
  labelAlign?: 'left' | 'right',
  useLabelCol?: ColProps;
  layout?: FormLayout,
  // 有些组件确实不适合封装 但是也要放在表单里管理 则写自定义的组件进去
  customerFormItemList?: CustomerFormItem[]
}

export interface CustomerFormItem {
  key: string,
  index: number,// 决定当前这个自定义组件放在第几位 不填就是最后
  node: ReactNode,// 自定义的组件
  hidden?: boolean,// 是否隐藏
}
export interface FormItem {
  label: ReactNode | string; // 页面标签
  type: FormType; // 表单类型
  name: string; // 字段名
  required: boolean; // 是否必填
  patternList?: any[]; // 正则
  placeholder?: string; // 提示
  options?: SelectOptionItem[] | CheckboxOptionItem[] | RadioOptionItem[];
  maxLength?: number,
  minLength?: number,
  tip?: string | ReactNode, // 文案说明,
  slotDom?: ReactNode, // 需要增加额外节点
  maxNum?: number,
  minNum?: number,
  images?: ImagesItem[],// 图片多种情况
  imagesTipPosition?: 'bottom' | 'right',// 图片下的请求的位置
  imageTipHide?: boolean,// 使用图片组件的警告是否出现
  disabled?: boolean;
  showCount?: boolean;// 输入框计数
  onChange?: (...args: any) => void; //给配置文件项，增加了onChange属性
  formItemWidth?: number | string,// 单独给表单项设置宽度
  className?: string, // 自定义样式,
  labelCol?: ColProps;
  hidden?: boolean,// 是否隐藏当前项
  showMetaSelectAll?: boolean
  children?: FormItem[];// 嵌套表单
  extra?: ReactNode
}

export interface ImagesItem {
  uploadType: 1 | 2,//1：直接上传  2：打开图库
  unique?: boolean,// 是否禁止选择重复图片
  text: string;
  name: string;
  shopImage?: boolean,
  showVideo?: boolean,
  rule?: any[];
  maxSize?: number
  maxLength?: number
  aspectRatio?: number// 图片显示块的大小
  showUploadList?: ExpandShowUploadListInterface,
  cropProps: imageCropProps,
  extra?: ReactNode
}

export interface WildcatFormProps {
  config: FormConfig;
  disabled?: boolean;
  onInit?(form: any): void;
  //父传的表单数据
  editDataSource?: any;
  submit?(values: any): void;
  formChange?(changeValue: any, allValues: any): void;
  className?: string;
  onClick?: any;
  loading?: boolean;
  submitBtn?: ReactNode;
  pageType?: ShopTDKType;
  children?(params?: string,type?:number): any;
  fillObject?:object
}
