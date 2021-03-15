// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// 文章表单
export const articleForm: FormConfig = {
  name: 'articleForm',
  children: [
    { inputWidth: 260, className:'f-middle', label: '文章分组', name: 'contentCateId', type: FormType.GroupSelect, options: [], required: true, placeholder: '暂无分组', btnConfig: { text: '新建分组'}},
    { inputWidth: 395, className:'f-middle', label: '文章标题', name: 'name', type: FormType.Input, required: true, maxLength: 50, placeholder: '请输入标题，2~50个字',minLength:2,showCount: true },
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
    { inputWidth: 395, className:'f-middle', label: '服务名称', name: 'name', type: FormType.Input, required: true, maxLength: 50, placeholder: '请输入标题，2~50个字', minLength:2,showCount: true },
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
    { inputWidth: 260, className:'f-middle', label: 'SEO标题', name: 'title', type: FormType.Input, required: true, minLength: 9, maxLength: 50,placeholder: '请输入标题，9~50个字', showCount: true},
    { inputWidth: 524, className:'f-textarea', label: 'SEO描述', name: 'description', type: FormType.Textarea, required: true, minLength: 40, maxLength: 80,placeholder: '请输入描述，40～80个字' },
    { inputWidth: 130, className:'f-tag', label: 'SEO关键词', name: 'keywords', type: FormType.Tag, required: true, maxLength: 10, placeholder: '输入标签',  maxNum: 20, minNum: 3},
  ],
  buttonConfig: { text: '保存', size: 'large', className: 'mvip-btn' }
}
