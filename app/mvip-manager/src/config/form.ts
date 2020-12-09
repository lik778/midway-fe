// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// 基础资料页面表单
export const baseInfoForm: FormConfig = {
  name: 'baseInfoForm',
  children: [
    { width: 346, label: '企业名称', name: 'companyName', type: FormType.Input, required: true, placeholder: '请输入企业名称，2～20个字' },
    { width: 346, label: '企业别称', name: 'companyAlias', type: FormType.Input, required: false,placeholder: '请输入企业别称，2～20个字' },
    { width: 346, label: '企业地址', name: 'areaMap', type: FormType.AreaSelect, required: true },
    { width: 346, label: '详细地址', name: 'companyAddress', type: FormType.Input, required: true, placeholder: '详细地址（如街道、门牌号等）' },
    { width: 655, label: '企业简介', name: 'companyDescription', type: FormType.Textarea, required: true, placeholder: '请输入简介，50～300个字' },
    { width: 646, label: '企业logo', name: 'imgInfo', type: FormType.ImgUpload, images: [{text:'企业logo', name: 'promoteImg'}],
      required: true, tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例1：1，建议最小尺寸100*100' }
  ],
  buttonConfig: { text: '保存并下一步', size: 'large'  }
}

// 联系面表单
export const contactForm: FormConfig = {
  name: 'contactForm',
  children: [
    { width: 346, label: '联系人', name: 'contactName', type: FormType.Input, required: true, placeholder: '请输入联系人' },
    { width: 346, label: '电话号码', name: 'contactMobile', type: FormType.Input, required: true, placeholder: '请输入电话号码' },
    { width: 346, label: '微信号码', name: 'wechat', type: FormType.Input, required: false, placeholder: '请输入微信号码' },
  ]
}

// 文章表单
export const articleForm: FormConfig = {
  name: 'articleForm',
  children: [
    { inputWidth: 260, className:'f-middle', label: '文章分组', name: 'contentCateId', type: FormType.GroupSelect, options: [], required: true, placeholder: '暂无分组', btnConfig: { text: '新建分组'}},
    { inputWidth: 395, className:'f-middle', label: '文章标题', name: 'name', type: FormType.Input, required: true, maxLength: 30, placeholder: '请输入标题，2~30个字' },
    { inputWidth: 130, className:'f-middle', label: '标签', name: 'tags', type: FormType.Tag, required: true, maxLength: 8, placeholder: '输入标签',  maxNum: 20 },
    { inputWidth: 150, className:'f-img', label: '图片信息', name: 'imgInfo', type: FormType.ImgUpload, required: false, maxNum: 1,maxLength: 1, images: [{text:'用于正文介绍', name: 'contentImg'}], tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例3：2，建议最小尺寸300*200' },
    { inputWidth: 542, label: '服务描述', name: 'content', type: FormType.Textarea, required: true, minLength: 100, maxLength: 1000,placeholder: '请输入简介，100～1000个字' },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}


// 服务表单
export const productForm: FormConfig = {
  name: 'productForm',
  children: [
    { inputWidth: 260, className:'f-middle', label: '服务分组', name: 'contentCateId', type: FormType.GroupSelect, options: [], required: true, placeholder: '暂无分组', btnConfig: { text: '新建分组'}},
    { inputWidth: 395, className:'f-middle', label: '服务名称', name: 'name', type: FormType.Input, required: true, maxLength: 30, placeholder: '请输入标题，2~30个字' },
    { inputWidth: 260, className:'f-middle', label: '市场价格', name: 'price', type: FormType.Input, required: false, maxLength: 8, placeholder: '例如：面议' },
    { inputWidth: 130, className:'f-tag', label: '标签', name: 'tags', type: FormType.Tag, required: true, maxLength: 10, placeholder: '输入标签',  maxNum: 20},
    { inputWidth: 150, className:'f-img', label: '图片信息', name: 'imgInfo', type: FormType.ImgUpload, required: false, maxNum:2 , maxLength: 1,images: [{text:'用于封面', name: 'headImg'}, {text: '用于正文介绍', name: 'contentImg'}],
      tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例3：2，建议最小尺寸300*200' },
    { inputWidth: 542, className:'f-textarea', label: '服务描述', name: 'content', type: FormType.Textarea, required: true, minLength: 100, maxLength: 1000,placeholder: '请输入简介，100～1000个字' },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}


// TDK表单
export const tdkForm: FormConfig = {
  name: 'tdkForm',
  children: [
    { inputWidth: 260, className:'f-middle', label: 'SEO标题', name: 'contentCateId', type: FormType.Input, required: true, placeholder: '请输入标题，9~15个字'},
    { inputWidth: 524, className:'f-textarea', label: 'SEO描述', name: 'content', type: FormType.Textarea, required: true, minLength: 40, maxLength: 80,placeholder: '请输入描述，40～80个字' },
    { inputWidth: 130, className:'f-tag', label: 'SEO关键词', name: 'tags', type: FormType.Tag, required: true, maxLength: 10, placeholder: '输入标签',  maxNum: 20},
  ],
  buttonConfig: { text: '保存', size: 'large', className: 'mvip-btn' }
}