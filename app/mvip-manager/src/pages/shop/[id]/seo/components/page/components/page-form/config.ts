// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { ShopTDKType } from '@/enums'
import { TdkDetail } from '@/interfaces/shop';

// TDK表单
export const tdkForm = (isB2B: boolean, pageType: ShopTDKType, onChange?: (params: TdkDetail) => void): FormConfig => {
  const config: FormConfig = {
    name: 'tdkForm',
    children: [
      { formItemWidth: '100%', label: 'SEO标题', name: 'title', type: FormType.Input, required: true, minLength: 9, maxLength: 50, patternList: [{ pattern: /^[\s\S]{9,50}$/, message: '9～50个字' }], placeholder: '请输入标题，9~50个字', showCount: true },
      { label: 'SEO描述', name: 'description', type: FormType.Textarea, required: true, minLength: 40, maxLength: 120, patternList: [{ pattern: /^[\s\S]{40,120}$/, message: '40～120个字' }], placeholder: '请输入描述，40～120个字' },
      {
        formItemWidth: 130, label: 'SEO关键词', name: 'keywords', type: FormType.Tag, required: true, maxLength: 10, placeholder: '输入标签', maxNum: 20, minNum: 3
      },
    ],
    buttonConfig: { text: '保存', size: 'large', className: 'mvip-btn' }
  }
  if (isB2B) {
    if (pageType === ShopTDKType.INDEX) {
      config.children[0].placeholder = '示例：打包机批发,集装箱厂家,打包机资源'
      config.children[0].extra = '请按照格式“关键词+后缀”填写，并用英文逗号隔开。例如：活动板房品牌,集装箱厂家,板房价格……'
      config.children[1].extra = '请输入40～120字描述，建议在描述中多嵌入一些关键词，会更有利于您的SEO排名。'
      config.children[2].extra = '请按照格式“关键词+后缀”填写，最多填写8个。例如：活动板房品牌、集装箱厂家、板房价格……'
      config.children[2].maxNum = 8
    } else if (pageType === ShopTDKType.PRODUCT) {
      config.children[0].placeholder = '示例：活动板房_集装箱|价格_批发_图片_行情_地址_厂家（推广关键词|后缀）'
      config.children[0].extra = '请按照格式 “产品分组名_产品分组名_……|后缀_后缀_……”填写，用英文竖线隔开，例如该店铺有2个产品分组，可以这样写：活动板房_集装箱|价格_批发_图片_货源_……'
      config.children[1].extra = '请输入40～120字描述，建议在描述中多嵌入一些关键词，会更有利于您的SEO排名。'
      config.children[2].extra = '请按照格式“产品分组名+后缀”填写，最多填写8个。例如：活动板房品牌、集装箱厂家、板房价格……'
      config.children[2].maxNum = 8
    }
    config.children[0].onChange = (...args) => {
        const [newValue, form] = args
        form.setFieldsValue({
            title: newValue
        })
        onChange && onChange(form.getFieldsValue(true))
    }
    config.children[1].onChange = (...args) => {
        const [newValue, form] = args
        form.setFieldsValue({
            description: newValue
        })
    }
  }
  return config
}
