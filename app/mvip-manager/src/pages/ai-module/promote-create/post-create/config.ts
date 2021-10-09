//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const fromLabelCol = { span: 3 }

export const promoteCreateForm: FormConfig = {
  name: 'promoteCreateForm',
  width: '100%',
  useLabelCol: fromLabelCol,
  children: [
    { formItemWidth: 260, label: '素材包名称', name: 'name', type: FormType.Input, required: true, maxLength: 7, minLength: 2, patternList: [{ pattern: /^[\s\S]{2,7}$/, message: '2～7个字' }], placeholder: '请输入素材包名称，2~7个字', disabled: false, showCount: true },
    { formItemWidth: 260, label: '类目', name: 'metas', type: FormType.MetaSelect, required: true },
  ]
}

// export {
//   fromLabelCol
// }