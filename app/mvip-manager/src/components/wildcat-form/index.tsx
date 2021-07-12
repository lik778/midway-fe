import React, { forwardRef, ReactNode, Ref, useEffect, useImperativeHandle, useMemo } from 'react';
import { Button, Form, Input, Select, Checkbox, InputNumber, Row, Col } from 'antd';
import { FormConfig, FormItem, OptionCheckBox, OptionItem, CustomerFormItem } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';
import ImgUpload from '@/components/img-upload';
import { TagModule } from '@/components/wildcat-form/components/tag';
import AreaSelect from '@/components/wildcat-form/components/area-select';
import InputLen from '@/components/input-len';
import { isEmptyObject } from '@/utils';
import styles from './index.less'

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;


interface Props {
  config: FormConfig;
  onInit?(form: any): void;
  //父传的表单数据
  editDataSource?: any;
  submit?(values: any): void;
  formChange?(changeValue: any, allValues: any): void;
  className?: string;
  onClick?: any;
  loading?: boolean;
  submitBtn?: ReactNode;
}


const WildcatForm = (props: Props, parentRef: Ref<any>) => {
  const [form] = Form.useForm();
  const { editDataSource, onInit, loading, config } = props

  const FormItemList = useMemo<(FormItem | CustomerFormItem)[]>(() => {
    if (!config || !config.children || config.children.length === 0) {
      return []
    } else if (!config.customerFormItemList) {
      return config.children
    } else {
      const customerFormItemList = [...config.customerFormItemList]
      const children = [...config.children]
      const arr: (FormItem | CustomerFormItem)[] = []
      let i = 0
      while (true) {
        const cItem = customerFormItemList.findIndex(cItem => cItem.index === i)
        if (cItem !== -1) {
          arr.push(...customerFormItemList.splice(cItem, 1))
        } else {
          arr.push(children.shift()!)
        }
        if (children.length === 0) {
          arr.push(...customerFormItemList.sort((a, b) => a.index - b.index))
          break
        }
        if (customerFormItemList.length === 0) {
          arr.push(...children)
          break
        }
        if (i >= customerFormItemList.length + children.length) {
          break
        }
        i++
      }
      return arr
    }
  }, [config])

  /** 暴露变量、方法给父组件 */
  useImperativeHandle(parentRef, () => ({
    form
  }));

  useEffect(() => {
    if (editDataSource) {
      form.setFieldsValue(editDataSource)
    } if (isEmptyObject(editDataSource)) {
      form.resetFields()
    }
  }, [editDataSource])

  useEffect(() => {
    if (onInit) {
      // 将form实例放出来
      onInit(form)
    }
  }, [])

  const onChange = (newValue: any, name: string) => {
    const configItem = config.children.find(item => item.name === name)
    //如果配置项里有onChange
    if (configItem?.onChange) { configItem.onChange(newValue, form) }
    const values = form.getFieldsValue()
    values[name] = newValue
    //给表格数据加选择后的数据
    form.setFieldsValue(values)
  }

  const getEditData = (name: string) => {
    return editDataSource && editDataSource[name];
  }


  function isCustomerFormItem(item: FormItem | CustomerFormItem): item is CustomerFormItem {
    return Boolean((item as CustomerFormItem).node)
  }

  const creatForm = (FormItemList: (CustomerFormItem | FormItem)[]) => {
    return FormItemList.map(item => {
      if (isCustomerFormItem(item)) {
        return item.node
      }
      const patternList = item.patternList ? item.patternList : [];
      if (item.type === FormType.Input) {
        return (
          <Form.Item className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }, ...patternList]} labelCol={item.labelCol}>
            <InputLen width={item.formItemWidth} placeholder={item.placeholder} maxLength={item.maxLength} minLength={item.minLength} disabled={item.disabled} showCount={item.showCount} />
          </Form.Item>
        )
      } else if (item.type === FormType.InputNumber) {
        return (
          <Form.Item className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }, ...patternList]} labelCol={item.labelCol}>
            <InputNumber style={{ width: item.formItemWidth }} min={item.minNum} max={item.maxNum} placeholder={item.placeholder} size='large' onChange={(newValue) => onChange(newValue, item.name || '')} disabled={item.disabled} />
          </Form.Item>
        )
      } else if (item.type === FormType.Textarea) {
        return (<Form.Item className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }, ...patternList]} labelCol={item.labelCol}>
          <TextArea showCount style={{ width: item.formItemWidth }} placeholder={item.placeholder} rows={6} size='large' maxLength={item.maxLength} minLength={item.minLength} disabled={item.disabled} />
        </Form.Item>)
      } else if (item.type === FormType.Select) {
        return (<Form.Item className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }]} labelCol={item.labelCol}>
          <Select
            onChange={(newValue) => onChange(newValue, item.name || '')}
            placeholder={item.placeholder} size='large'
            style={{ width: item.formItemWidth }} disabled={item.disabled}>
            {item.options && (item.options as OptionItem[]).map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
          </Select>
        </Form.Item>)
      } else if (item.type === FormType.ImgUpload) {
        return (<Form.Item className={` ${styles['image-upload-box']} ${item.required ? '' : item.tip ? styles['image-upload-set-p'] : ''} ${item.className}`} key={item.label}
          label={item.label} required={item.required} labelCol={item.labelCol}>
          <div className={styles['flex-box']}>
            {
              (item.images || []).map((img) => {
                return (<Form.Item className={styles['image-upload-list']} name={img.name} key={img.name} style={{ display: 'inline-block' }} required={item.required} rules={img.rule ? img.rule : undefined}>
                  <ImgUpload uploadType={img.uploadType} key={img.text} uploadBtnText={img.text} editData={editDataSource && editDataSource[img.name]} maxLength={img.maxLength || item.maxLength || 1} onChange={(newValue) => onChange(newValue, item.name || '')} maxSize={img.maxSize} disabled={item.disabled} aspectRatio={img.aspectRatio} showUploadList={img.showUploadList} cropProps={img.cropProps} uploadBeforeCrop={img.uploadBeforeCrop} />
                </Form.Item>
                )
              })
            }
            {
              item.imagesTipPosition === 'right' && (typeof item.tip === 'string' ?
                <div className={styles['tip-right']}>
                  <p className={`${styles['image-tip']} ${item.required ? styles['tip-right-transform'] : ''}`}>{item.tip}</p>
                  <p className={`${styles['image-tip']} ${styles['red-tip']}`}>严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担</p>
                </div>
                : item.tip)
            }
          </div>
          {
            item.imagesTipPosition !== 'right' && (typeof item.tip === 'string' ?
              <>
                <p className={styles['image-tip']}>{item.tip}</p>
                <p className={`${styles['image-tip']} ${styles['red-tip']}`}>严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担</p>
              </>
              : item.tip)
          }
        </Form.Item>)
      } else if (item.type === FormType.AreaSelect) {
        const value = getEditData(item.name || '');
        return (<Form.Item className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }, ...patternList]} labelCol={item.labelCol}>
          <AreaSelect width={item.formItemWidth} initialValues={value} onChange={(values: string[]) => onChange(values, item.name || '')} />
        </Form.Item>)
      } else if (item.type === FormType.GroupSelect) {
        return (<div className={styles['group-select-btn']} key={item.label}>
          <Form.Item className={item.className} label={item.label} name={item.name} rules={[{ required: item.required }]} labelCol={item.labelCol}>
            <Select placeholder={item.placeholder} size='large' style={{ width: item.formItemWidth }} getPopupContainer={triggerNode => triggerNode.parentNode} disabled={item.disabled}>
              {item.options && (item.options as OptionItem[]).map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
            </Select>
          </Form.Item>
          {item.btnConfig}
        </div>)
      } else if (item.type === FormType.Tag) {
        const value = form.getFieldsValue()[item.name || ''];
        return (<Form.Item className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }]} labelCol={item.labelCol}>
          <TagModule
            value={value || []}
            maxLength={item.maxLength || 1}
            minLength={item.minLength || 1}
            maxNum={item.maxNum || 0}
            onChange={(newValue) => onChange(newValue, item.name || '')} />
        </Form.Item>)
      } else if (item.type === FormType.MetaChecbox && item.display) {
        return (
          <Form.Item className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }]} labelCol={item.labelCol}>
            <CheckboxGroup
              options={item.options as OptionCheckBox[]}
            />
          </Form.Item>
        )
      } else if (item.type === FormType.GroupItem) {
        return (
          <Form.Item className={item.className} label={item.label} key={item.label} rules={[{ required: item.required }]} labelCol={item.labelCol}>
            {
              item.children ? creatForm(item.children) : ''
            }
          </Form.Item>
        )
      }
    })
  }

  return (
    <>
      <Form form={form} style={config && config.width ? { width: config.width } : {}} name={config && config.name} labelCol={config.useLabelCol ? config.useLabelCol : { span: 3 }}
        onFinish={props.submit} onValuesChange={props.formChange} className={`${styles['form-styles']} ${props.className}`} labelAlign={config.labelAlign || 'right'}>
        {
          creatForm(FormItemList)
        }
        {
          props.submitBtn || config && config.buttonConfig &&
          (<Row>
            <Col span={3}></Col>
            <Col> <Button loading={loading} className={`${styles['sumbit-btn']} ${config.buttonConfig.className}`} type="primary" size={config.buttonConfig.size} htmlType="submit" style={{ marginLeft: '16px' }}>
              {config.buttonConfig.text}</Button></Col>
          </Row>)
        }
      </Form>
    </>
  )
}

export default forwardRef(WildcatForm)
