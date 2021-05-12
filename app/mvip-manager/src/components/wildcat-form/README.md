# 组件代号-野猫

太平洋战争前期，美军当之无愧的主力舰载战斗机，马力强劲、皮糙肉厚，哪怕是那些菜鸟飞行员被经验丰富的零式驾驶员对着来上一梭机枪，照样能安然不淡定的飞回母舰。

动态的生成表单

## 配置参数介绍

### 外层参数介绍

| 参数                 | 说明                                                       | 类型             | 默认值   | 是否必填 |
| -------------------- | ---------------------------------------------------------- | ---------------- | -------- | -------- |
| name                 | 表单名称，会作为表单字段 id 前缀使用                       | string           |          | true     |
| children             | 表单项，详情见下                                           | FormItem[]       | []       | true     |
| buttonConfig         | 当没有传入 submitBtn，则检测该属性配置提交按钮             | ButtonItem       |          | false    |
| width                | 配置表单宽度                                               | number,string    | 680      | false    |
| labelAlign           | label 对齐方式                                             | 'left' , 'right' | 'right'  | false    |
| useLabelCol          | 设置 lable 占比                                            | ColProps         | {span:3} | false    |
| customerFormItemList | 有些组件不适合封装，但是要放在表单管理，传自定义的组件进去 | ReactNode        |          | false    |

---

### children(FormItem[]) 参数介绍

| 参数              | 说明                                                                                | 类型                             | 默认值                                     | 是否必填                               |
| ----------------- | ----------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------ | -------------------------------------- |
| label             | 表单项名                                                                            | string                           |                                            | true                                   |
| type              | 表单项类型                                                                          | FormType                         |                                            | true                                   |
| name              | 字段名                                                                              | string                           |                                            | true                                   |
| required          | 是否必填                                                                            | boolean                          |                                            | true                                   |
| patternList       | 对字段的正则规则                                                                    | any[]                            | []                                         | false                                  |
| placeholder       | 提示语                                                                              | string                           |                                            | false                                  |
| options           | Select、checkbox 的选择项                                                           | OptionItem[] 、 OptionCheckBox[] |                                            | false                                  |
| maxLength         | 最大长度 ， 输入框指最大输入长度，图片则是指最大上传个数，tag 是指 tag 文字最大长度 | number                           | Input、textarea: undefined, upload:0,tag:1 | false                                  |
| minLength         | 最小长度 输入框指最小输入长度，tag 是指 tag 文字最小长度                            | number                           | Input、textarea: undefined, tag:1          | false                                  |
| tip               | 文案说明，目前只用在图片上传                                                        | string 、ReactNode               |                                            | false                                  |
| btnConfig         | 输入框需要增加额外按钮什么的，现在用于店铺服务，文章                                | ReactNode                        |                                            | false                                  |
| maxNum            | 最大值，数字输入框是最大值，tag 是指最大个数                                        | number                           | inputNumber:undefined,tag：0               |
| minNum            | 最小值，只用于数字输入                                                              | number                           |                                            | false                                  |
| images            | 只用于图片上传，配置每一小个上传                                                    | ImagesItem[]                     | []                                         | type === FormType.ImgUpload?true:false |
| imagesTipPosition | 只用于图片上传，配置提示语位置                                                      | 'bottom' 、 'right'              | 'bottom'                                   | false                                  |
| disabled          | 是否禁用                                                                            | boolean                          | false                                      | false                                  |
| showCount         | 只用于输入框，查看输入数量数字                                                      | boolean                          | false                                      | false                                  |
| onChange          | 用于触发某个表单项发生变化后，触发指定事件                                          | (...args: any) => void;          |                                            | false                                  |
| display           | 是否显示                                                                            | boolean                          | true                                       | false                                  |
| formItemWidth     | 表单项的宽度（这里是指 antd 的组件的宽度）                                          | number、string                   |                                            | false                                  |
| className         | 表单项的类名                                                                        | string                           |                                            | false                                  |
