// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// 基础资料页面表单
export const baseInfoForm: FormConfig = {
  name: 'baseInfoForm',
  children: [
    { width: 376, label: '企业名称', name: 'companyName', type: FormType.Input, required: true, maxLength: 20, minLength: 2,placeholder: '请输入企业名称，2~20个字', disabled: false, showCount: true },
    { width: 376, label: '企业别称', name: 'companyAlias', type: FormType.Input, required: false, maxLength: 20, minLength: 2,placeholder: '请输入企业别称，2~20个字',showCount: true },
    { width: 376, label: '企业地址', name: 'area', type: FormType.AreaSelect, required: true },
    { width: 376, label: '详细地址', name: 'companyAddress', type: FormType.Input, required: true, placeholder: '详细地址（如街道、门牌号等）' },
    { width: 690, label: '企业简介', name: 'companyDescription', type: FormType.Textarea, required: true, placeholder: '请输入简介，50～300个字',
      minLength: 50, maxLength: 300, patternList: [ { pattern: /^[\s\S]{50,300}$/, message: '50～300个字'}  ] },
    { width: 690, label: '企业logo', name: 'promoteImg', maxLength: 1, type: FormType.ImgUpload, images: [{text:'企业logo', name: 'promoteImg'}],
      required: true, tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例1：1，建议最小尺寸100*100' }
  ]
}

// 联系面表单
export const contactForm: FormConfig = {
  name: 'contactForm',
  children: [
    { width: 346, label: '联系人', name: 'contactName', type: FormType.Input, required: true, placeholder: '请输入联系人' },
    { width: 346, label: '电话号码', name: 'contactMobile', type: FormType.Input, required: true, placeholder: '请输入电话号码',
      patternList: [ {pattern: /(^(0[0-9]{2,3}\-{0,1})?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-{0,1}))?(1[0-9]\d{9})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4})(.)(\d{1,4})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4}$))/,
        message: '请输入正确的联系方式'} ]
    },
    { width: 346, label: '微信号码', name: 'wechat', type: FormType.Input, required: false, placeholder: '请输入微信号码',
      minLength: 6, maxLength: 20, patternList: [ { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{6,20}$/, message: '微信号码(6-20个字符)'} ] },
  ]
}

// 文章表单
export const articleForm: FormConfig = {
  name: 'articleForm',
  children: [
    { inputWidth: 260, className:'f-middle', label: '文章分组', name: 'contentCateId', type: FormType.GroupSelect, options: [], required: true, placeholder: '暂无分组', btnConfig: { text: '新建分组'}},
    { inputWidth: 395, className:'f-middle', label: '文章标题', name: 'name', type: FormType.Input, required: true, maxLength: 30, placeholder: '请输入标题，2~30个字',minLength:2,showCount: true },
    { inputWidth: 130, className:'f-tag', label: '标签', name: 'tags', type: FormType.Tag, required: true, minLength:1, maxLength: 10, placeholder: '输入标签',  maxNum: 30, minNum: 3 },
    { inputWidth: 150, className:'f-img', label: '图片信息', name: 'imgInfo', type: FormType.ImgUpload, required: false, maxLength: 1, images: [{text:'用于正文介绍', name: 'contentImg'}], tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例3：2，建议最小尺寸300*200' },
    { inputWidth: 542, className:'f-textarea', label: '文章描述', name: 'content', type: FormType.Textarea, required: true, minLength: 100, maxLength: 1000,placeholder: '请输入简介，100～1000个字' },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}


// 服务表单
export const productForm: FormConfig = {
  name: 'productForm',
  children: [
    { inputWidth: 260, className:'f-middle', label: '服务分组', name: 'contentCateId', type: FormType.GroupSelect, options: [], required: true, placeholder: '暂无分组', btnConfig: { text: '新建分组'}},
    { inputWidth: 395, className:'f-middle', label: '服务名称', name: 'name', type: FormType.Input, required: true, maxLength: 30, placeholder: '请输入标题，2~30个字', minLength:2,showCount: true },
    { inputWidth: 260, className:'f-middle', label: '市场价格', name: 'price', type: FormType.Input, required: false, maxLength: 8, placeholder: '例如：面议', showCount: false },
    { inputWidth: 130, className:'f-tag', label: '标签', name: 'tags', type: FormType.Tag, required: true, minLength:1, maxLength: 10, placeholder: '输入标签',  maxNum: 30, minNum: 3},
    { inputWidth: 150, className:'f-img', label: '图片信息', name: 'imgInfo', type: FormType.ImgUpload, required: false, maxLength: 2, images: [{text:'用于封面', name: 'headImg'}, {text: '用于正文介绍', name: 'contentImg'}],
      tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例3：2，建议最小尺寸300*200' },
    { inputWidth: 542, className:'f-textarea', label: '服务描述', name: 'content', type: FormType.Textarea, required: true, minLength: 100, maxLength: 1000,placeholder: '请输入简介，100～1000个字' },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}


// TDK表单
export const tdkForm: FormConfig = {
  name: 'tdkForm',
  children: [
    { inputWidth: 260, className:'f-middle', label: 'SEO标题', name: 'title', type: FormType.Input, required: true, minLength: 9, maxLength: 15,placeholder: '请输入标题，9~15个字', showCount: true},
    { inputWidth: 524, className:'f-textarea', label: 'SEO描述', name: 'description', type: FormType.Textarea, required: true, minLength: 40, maxLength: 80,placeholder: '请输入描述，40～80个字' },
    { inputWidth: 130, className:'f-tag', label: 'SEO关键词', name: 'keywords', type: FormType.Tag, required: true, maxLength: 10, placeholder: '输入标签',  maxNum: 20, minNum: 3},
  ],
  buttonConfig: { text: '保存', size: 'large', className: 'mvip-btn' }
}
