//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const postForm: FormConfig = {
  name: 'zhidaoInfoForm',
  width: 980,
  useLabelCol: { span: 2 },
  children: [
    { formItemWidth: 260, label: '企业名称', name: 'companyName', type: FormType.Input, required: true, maxLength: 50, minLength: 2, patternList: [{ pattern: /^[\s\S]{2,50}$/, message: '2～50个字' }], placeholder: '请输入企业名称，2~50个字', disabled: false, showCount: true },
    { formItemWidth: 260, label: '类目', name: 'metas', type: FormType.MetaSelect, required: true },
  ]
}
