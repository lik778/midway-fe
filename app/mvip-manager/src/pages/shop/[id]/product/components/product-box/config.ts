// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// 服务表单
export const productForm: FormConfig = {
  name: 'productForm',
  width: 650,
  children: [
    { formItemWidth: 260, className: 'f-middle', label: '服务分组', name: 'contentCateId', type: FormType.GroupSelect, options: [], required: true, placeholder: '暂无分组', btnConfig: { text: '新建分组' } },
    { formItemWidth: 395, className: 'f-middle', label: '服务名称', name: 'name', type: FormType.Input, required: true, maxLength: 50, placeholder: '请输入标题，2~50个字', minLength: 2, showCount: true },
    { formItemWidth: 260, className: 'f-middle', label: '市场价格', name: 'price', type: FormType.Input, required: false, maxLength: 8, placeholder: '例如：面议', showCount: false },
    { formItemWidth: 130, className: 'f-tag', label: '标签', name: 'tags', type: FormType.Tag, required: true, minLength: 1, maxLength: 10, placeholder: '输入标签', maxNum: 30, minNum: 3 },
    {
      formItemWidth: 150, className: 'f-img', label: '图片信息', name: 'imgInfo', type: FormType.ImgUpload, required: false, maxLength: 2, images: [{ text: '用于封面', name: 'headImg', maxSize: 3, }, { text: '用于正文介绍', name: 'contentImg', maxSize: 3, }],
      tip: '图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200'
    },
    { className: 'f-textarea', label: '服务描述', name: 'content', type: FormType.Textarea, required: true, minLength: 100, maxLength: 1000, placeholder: '请输入简介，100～1000个字' },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}
