export enum FormType {
  Input,
  InputNumber,
  Select,
  Textarea,
  Switch,
  Checkbox,
  Radio,
  AreaSelect,
  ImgUpload,
  Tag,
  RichText,
  GroupItem, // 当前item只是个壳子，具体item的在children里，但是数据字段同层
  MetaSelect = 'MetaSelect',// 三级类目选择器
}

