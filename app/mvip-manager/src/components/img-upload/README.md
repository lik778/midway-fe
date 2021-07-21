1. 当前图片库只能用于店铺，所以用店铺首页的 list。如果以后其他地方也要用，需要注意一下获取 shopList

### 参数介绍

| 参数             | 说明                                     | 类型                                                                                                     | 默认值 | 是否必填 |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------ | -------- |
| uploadType       | 1：直接上传 2：打开图库                  | 1 ,2                                                                                                     |        | true     |
| editData         | 默认值                                   | string / string[]/ undefined                                                                             |        | false    |
| uploadBtnText    | 上传按钮上的文本                         | string                                                                                                   |        | true     |
| maxSize          | 单个图片最大尺寸                         | number                                                                                                   | 1      | false    |
| maxLength        | 本次上传个数上线                         | number                                                                                                   |        | true     |
| disabled         | 是否禁用                                 | boolean                                                                                                  | false  | false    |
| aspectRatio      | 图片不是正方形的时候通过传比例去设置长度 | number                                                                                                   | 1/1    | false    |
| showUploadList   | 按钮控制                                 | ExpandShowUploadListInterface                                                                            |        | false    |
| cropProps        | 裁剪参数                                 | CropProps                                                                                                |        | true     |
| actionBtn        | 自定义图片上的功能                       | ActionBtnListItem[]                                                                                      |        | false    |
| uploadBeforeCrop | 上传前裁剪                               | boolean                                                                                                  | false  | false    |
| itemRender       | 自定义图片样式                           | (originNode: React.ReactElement, file: UploadFile, fileList?: Array<UploadFile<any>>) => React.ReactNode |        | false    |
| onChange         | 值变化                                   | (values: string \ string[], fileList: UploadFile[], oldFileList: UploadFile[]): void[]                   |        | false    |
