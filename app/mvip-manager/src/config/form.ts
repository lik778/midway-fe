// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// 基础资料页面表单
export const baseInfoForm: FormConfig = {
  name: 'baseInfoForm',
  children: [
    { width: 346, label: '企业名称', name: 'name', type: FormType.Input, required: true, placeholder: '请输入企业名称，2～20个字' },
    { width: 346, label: '企业别称', name: 'alia', type: FormType.Input, required: false,placeholder: '请输入企业别称，2～20个字' },
    { width: 346, label: '企业地址', name: 'area', type: FormType.AreaSelect, required: true },
    { width: 346, label: '详细地址', name: 'areaDetail', type: FormType.Input, required: true, placeholder: '详细地址（如街道、门牌号等）' },
    { width: 655, label: '企业简介', name: 'description', type: FormType.Textarea, required: true, placeholder: '请输入简介，50～300个字' },
    { width: 646, label: '企业logo', name: 'logoImg', type: FormType.ImgUpload, required: true, tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例1：1，建议最小尺寸100*100' }
  ],
  buttonConfig: { text: '保存并下一步', size: 'large'  }
}

// 联系面表单
export const contactForm: FormConfig = {
  name: 'contactForm',
  children: [
    { width: 346, label: '联系人', name: 'contact', type: FormType.Input, required: true, placeholder: '请输入联系人' },
    { width: 346, label: '企业别称', name: 'phone', type: FormType.Input, required: true, placeholder: '请输入电话号码' },
    { width: 346, label: '企业地址', name: 'wechat', type: FormType.Input, required: false, placeholder: '请输入微信号码' },
  ]
}

// 文章表单
export const articleForm: FormConfig = {
  name: 'articleForm',
  children: [
    { inputWidth: 260, className:'f-middle', label: '文章分组', name: 'group', type: FormType.GroupSelect, required: true, placeholder: '暂无分组', btnConfig: { text: '新建分组'}},
    { inputWidth: 395, className:'f-middle', label: '文章标题', name: 'title', type: FormType.Input, required: true, maxLength: 30, placeholder: '请输入标题，2~30个字' },
    { inputWidth: 130, className:'f-middle', label: '标签', name: 'tag', type: FormType.Tag, required: true, maxLength: 8, placeholder: '输入标签' },
    { inputWidth: 150, label: '图片信息', name: 'imgInfo', type: FormType.ImgUpload, required: false, tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例3：2，建议最小尺寸300*200' },
    { inputWidth: 542, label: '服务描述', name: 'description', type: FormType.Textarea, required: true, minLength: 100, maxLength: 1000,placeholder: '请输入简介，100～1000个字' },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}


// 服务表单
export const categoryForm: FormConfig = {
  name: 'categoryForm',
  children: [
    { inputWidth: 260, className:'f-middle', label: '文章分组', name: 'group', type: FormType.GroupSelect, required: true, placeholder: '暂无分组', btnConfig: { text: '新建分组'}},
    { inputWidth: 395, className:'f-middle', label: '文章标题', name: 'title', type: FormType.Input, required: true, maxLength: 30, placeholder: '请输入标题，2~30个字' },
    { inputWidth: 260, className:'f-middle', label: '市场价格', name: 'price', type: FormType.Input, required: false, maxLength: 8, placeholder: '例如：面议' },
    { inputWidth: 130, className:'f-middle', label: '标签', name: 'tag', type: FormType.Tag, required: true, maxLength: 8, placeholder: '输入标签' },
    { inputWidth: 150, label: '图片信息', name: 'imgInfo', type: FormType.ImgUpload, required: false, tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例3：2，建议最小尺寸300*200' },
    { inputWidth: 542, label: '服务描述', name: 'description', type: FormType.Textarea, required: true, minLength: 100, maxLength: 1000,placeholder: '请输入简介，100～1000个字' },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}