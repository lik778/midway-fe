// tips: 页面配置
import { FormType, PageType } from '@/components/wildcat/enums';
import { WildCatConfig } from '@/components/wildcat/interfaces';

// 基础资料页面
export const baseInfoPage: WildCatConfig = {
  name: 'baseInfo',
  type: PageType.form,
  formConfig: {
    name: 'baseInfoForm',
    children: [
      { width: 346, label: '企业名称', name: 'name', type: FormType.Input, required: true, placeholder: '请输入企业名称，2～20个字' },
      { width: 346, label: '企业别称', name: 'alia', type: FormType.Input, required: false,placeholder: '请输入企业别称，2～20个字' },
      { width: 655, label: '企业地址', name: 'area', type: FormType.Input, required: true },
      { width: 655, label: '企业简介', name: 'description', type: FormType.Textarea, required: true, placeholder: '请输入简介，50～300个字' },
      { width: 646, label: '企业logo', name: 'logoImg', type: FormType.Input, required: true }
    ],
    buttonConfig: { text: '保存并下一步', size: 'middle'  }
  }
}
