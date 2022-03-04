// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { ContentCateType } from '@/enums';

// 文章表单
export const contentGroupForm = (isB2B: boolean, cateType: ContentCateType): FormConfig => {
  const config: FormConfig = {
    name: 'contentGroupForm',
    width: 520,
    useLabelCol: { span: 4 },
    children: [
      { formItemWidth: '100%', label: '分组名称', name: 'name', type: FormType.Input, required: true, placeholder: '请输入分组名称，2~8个字', minLength: 2, maxLength: 8, patternList: [{ pattern: /^[\s\S]{2,8}$/, message: '2～8个字' }], showCount: true, onChange: (...args: any) => {
          const [newValue, form] = args
          form.setFieldsValue({
            name: newValue
          })
      }},
      { formItemWidth: '100%', label: '分组权重', name: 'weight', type: FormType.InputNumber, required: true, minNum: 1, maxNum: 1000, placeholder: '请输入分组权重' },
      { formItemWidth: '100%', label: 'SEO标题', name: 'seoT', type: FormType.Input, required: false, placeholder: '请输入SEO标题，9~50个字', maxLength: 50, showCount: true, patternList: [{ pattern: /^[\s\S]{9,50}$/, message: '9～50个字' }], },
      { formItemWidth: '100%', label: 'SEO描述', name: 'seoD', type: FormType.Input, required: false, placeholder: '请输入SEO描述，40~120个字', maxLength: 120, showCount: true, patternList: [{ pattern: /^[\s\S]{40,120}$/, message: '40～120个字' }], },
      {
        formItemWidth: 130, label: 'SEO关键词', name: 'seoK', type: FormType.Tag, required: false, maxLength: 10, placeholder: '输入标签', maxNum: 20, minNum: 3
      },
    ],
    buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
  }
  if (isB2B && cateType === ContentCateType.PRODUCT) {
    config.children[2].placeholder = '示例：产品分组名|后缀_后缀'
    config.children[2].extra = '请按照格式 “产品分组名|后缀_后缀”填写，用英文竖线隔开，例如：活动板房|价格_批发_图片_货源_……'
    config.children[3].extra = '请输入40～120字描述，建议可以在描述中多嵌入一些关键词，会更有利于您的SEO排名'
    config.children[4] = {
      formItemWidth: 130, label: 'SEO关键词', name: 'seoK', type: FormType.Tag, required: false, maxLength: 10, placeholder: '输入标签', maxNum: 8, minNum: 3, extra: '请按照格式“产品分组名+后缀”填写，最多填写8个。例如：活动板房品牌、活动板房厂家、活动板房价格……'
    }
  }
  return config
}