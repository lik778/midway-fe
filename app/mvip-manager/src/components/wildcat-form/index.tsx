import React, { forwardRef, ReactNode, Ref, useEffect, useImperativeHandle } from 'react';
import { Button, Form, Input, Select, Checkbox, InputNumber, Row, Col } from 'antd';
import { FormConfig, OptionCheckBox, OptionItem } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';
import { ImgUpload } from '@/components/wildcat-form/components/img-upload';
import { TagModule } from '@/components/wildcat-form/components/tag';
import AreaSelect from '@/components/wildcat-form/components/area-select';
import InputLen from '@/components/input-len';
import { isEmptyObject } from '@/utils';
import styles from './index.less'

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

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

  return (
    <>
      <Form form={form} style={config && config.width ? { width: config.width } : {}} name={config && config.name} labelCol={config.useLabelCol ? config.useLabelCol : { span: 3 }}
        onFinish={props.submit} onValuesChange={props.formChange} className={`${styles['form-styles']} ${props.className}`} labelAlign={config.labelAlign || 'right'}>
        {config && config.children.map(item => {
          const patternList = item.patternList ? item.patternList : [];
          if (item.type === FormType.Input) {
            return (
              <FormItem className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }, ...patternList, { type: 'string', min: item.minLength, max: item.maxLength }]}>
                <InputLen width={item.formItemWidth} placeholder={item.placeholder} maxLength={item.maxLength} minLength={item.minLength} disabled={item.disabled} showCount={item.showCount} />
              </FormItem>
            )
          } else if (item.type === FormType.InputNumber) {
            return (
              <FormItem className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }, ...patternList]}>
                <InputNumber style={{ width: item.formItemWidth }} min={item.minNum} max={item.maxNum} placeholder={item.placeholder} size='large' onChange={(newValue) => onChange(newValue, item.name || '')} />
              </FormItem>
            )
          } else if (item.type === FormType.Textarea) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }, ...patternList]}>
              <TextArea showCount style={{ width: item.formItemWidth }} placeholder={item.placeholder} rows={6} size='large' maxLength={item.maxLength} minLength={item.minLength} />
            </FormItem>)
          } else if (item.type === FormType.Select) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }]}>
              <Select
                onChange={(newValue) => onChange(newValue, item.name || '')}
                placeholder={item.placeholder} size='large'
                style={{ width: item.formItemWidth }}>
                {item.options && (item.options as OptionItem[]).map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
              </Select>
            </FormItem>)
          } else if (item.type === FormType.ImgUpload) {
            return (<FormItem className={` ${styles['image-upload-box']} ${item.required ? '' : item.tip ? styles['image-upload-set-p'] : ''} ${item.className}`} key={item.label}
              label={item.label} required={item.required}>
              <div className={styles['flex-box']}>
                {
                  (item.images || []).map((img) => {
                    return (<FormItem className={styles['image-upload-list']} name={img.name} key={img.name} style={{ display: 'inline-block' }} required={item.required} rules={img.rule ? img.rule : undefined}>
                      <ImgUpload key={img.text} name={img.name} text={img.text} editData={editDataSource} maxLength={item.maxLength || 0}
                        onChange={(newValue) => onChange(newValue, item.name || '')} maxSize={img.maxSize} />
                    </FormItem>
                    )
                  })
                }
                {
                  item.imagesTipPosition === 'right' && (typeof item.tip === 'string' ? <p className={`${styles['image-tip']} ${styles['tip-right']} ${item.required ? styles['tip-right-transform'] : ''}`}>{item.tip}</p> : item.tip)
                }
              </div>
              {
                item.imagesTipPosition !== 'right' && (typeof item.tip === 'string' ? <p className={styles['image-tip']}>{item.tip}</p> : item.tip)
              }
            </FormItem>)
          } else if (item.type === FormType.AreaSelect) {
            const value = getEditData(item.name || '');
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }, ...patternList]}>
              <AreaSelect width={item.formItemWidth} initialValues={value} onChange={(values: string[]) => onChange(values, item.name || '')} />
            </FormItem>)
          } else if (item.type === FormType.GroupSelect) {
            return (<div key={item.label}>
              <FormItem className={item.className} label={item.label} name={item.name} rules={[{ required: item.required }]}>
                <Select placeholder={item.placeholder} size='large' style={{ width: item.formItemWidth }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                  {item.options && (item.options as OptionItem[]).map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
                </Select>
              </FormItem>
              {item.btnConfig}
            </div>)
          } else if (item.type === FormType.Tag) {
            const value = form.getFieldsValue()[item.name || ''];
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }]}>
              <TagModule
                value={value || []}
                maxLength={item.maxLength || 1}
                minLength={item.minLength || 1}
                maxNum={item.maxNum || 0}
                onChange={(newValue) => onChange(newValue, item.name || '')} />
            </FormItem>)
          } else if (item.type === FormType.MetaChecbox && item.display) {
            return (
              <FormItem className={item.className} label={item.label} name={item.name} key={item.label} rules={[{ required: item.required }]}>
                <CheckboxGroup
                  options={item.options as OptionCheckBox[]}
                />
              </FormItem>
            )
          }
        })}
        {config.customerFormItemList ? config.customerFormItemList : <></>}
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
