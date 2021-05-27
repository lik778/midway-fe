//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const shopInfoForm: FormConfig = {
  name: 'shopInfoForm',
  width: '100%',
  useLabelCol: { span: 4 },
  children: [
    { formItemWidth: 380, label: '店铺名称', name: 'name', type: FormType.Input, required: true, maxLength: 20, minLength: 1, patternList: [{ pattern: /^[\s\S]{2,20}$/, message: '2～20个字' }], placeholder: '请输入店铺名称，1~20个字', showCount: true },
    { formItemWidth: 380, label: '行业属性', name: 'shopType', type: FormType.Select, required: true, placeholder: '提交后不支持修改' },
    { formItemWidth: 380, label: '域名类型', name: 'domainType', type: FormType.Select, required: true, placeholder: '请选择域名类型' },
  ],
}
