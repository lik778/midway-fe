import React, { useEffect } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';
import { ImgUpload } from '@/components/wildcat-form/components/img-upload';
import { TagModule } from '@/components/wildcat-form/components/tag';
import AreaSelect from '@/components/wildcat-form/components/area-select';
import InputLen from '@/components/input-len';
import  Btn  from '@/components/btn';
import { isEmptyObject } from '@/utils';

const Option = Select.Option;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

interface Props {
  config: FormConfig;
  onInit?(form: any): void;
  editDataSource?: any;
  submit?(values: any): void;
  formChange?(changeValue: any, allValues: any): void;
  className?: string;
  onClick?: any;
  useLabelCol?: boolean;
}


const WildcatForm = (props: Props) => {
  const [form] = Form.useForm();
  const { editDataSource, useLabelCol, onInit } = props

  useEffect(() => {
    if (editDataSource) {
      form.setFieldsValue(editDataSource)
    } if (isEmptyObject(editDataSource)) {
      form.resetFields()
    }
  },[editDataSource])

  useEffect(() => {
    if (onInit) {
      // 将form实例放出来
      onInit(form)
    }
  }, [])

  const onChange = (newValue: any, name: string) => {
    const values = form.getFieldsValue()
    values[name] = newValue
    form.setFieldsValue(values)
  }

  const getEditData = (name: string) => {
    return editDataSource && editDataSource[name];
  }

  return (
    <div>
      <Form form={form} name={props.config && props.config.name} labelCol={useLabelCol ? { span: 6 } : {}}
        onFinish={props.submit} onValuesChange={props.formChange} className={props.className}>
        { props.config && props.config.children.map(item => {
          const patternList = item.patternList ? item.patternList : [];
          if (item.type === FormType.Input) {
            return (
                <FormItem className={item.className}  label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }, ...patternList]}>
                  <InputLen width={item.inputWidth} placeholder={item.placeholder}  maxLength={item.maxLength} minLength={item.minLength} disabled={item.disabled} showCount={item.showCount}/>
                  {/* <Input style={{ width: item.inputWidth }} placeholder={item.placeholder} size='large' maxLength={item.maxLength} minLength={item.minLength} disabled={item.disabled}/> */}
                </FormItem>
              )
          } else if (item.type === FormType.Textarea) {
            return (<FormItem className={item.className} label={item.label} labelCol={{ span: 3 }} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }, ...patternList]}>
              <TextArea showCount style={{ width: item.inputWidth }} placeholder={item.placeholder} rows={6} size='large' maxLength={item.maxLength} minLength={item.minLength}/>
            </FormItem>)
          } else if (item.type === FormType.Select) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <Select placeholder={item.placeholder} size='large' style={{ width: item.inputWidth }}>
                { item.options && item.options.map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
              </Select>
            </FormItem>)
          } else if (item.type === FormType.ImgUpload) {
            return (<FormItem className={item.className} label={item.label} labelCol={{ span: 3 }} key={item.label} style={{ width: item.width }} rules={[{required: item.required }]}>
              { item.images && item.images.length > 0 &&
                item.images.map((img) => {
                  const url = getEditData(img.name || '');
                  return (<FormItem name={img.name} key={img.name} style={{ display: 'inline-block' }}>
                    <ImgUpload key={img.text} text={img.text} url={ url || ''} maxLength={item.maxLength || 0}
                     onChange={(newValue) => onChange(newValue, item.name || '')}/>
                  </FormItem>
                  )
                })
              }
              <FormItem><p className="tip">{item.tip}</p></FormItem>
            </FormItem>)
          } else if (item.type === FormType.AreaSelect) {
            const value = getEditData(item.name || '');
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <AreaSelect initialValues={value} onChange={(values: string[]) => onChange(values, item.name || '')}/>
            </FormItem>)
          } else if (item.type === FormType.GroupSelect) {
            return (<FormItem key={item.label}>
              <FormItem className={item.className} label={item.label} name={item.name}  style={{ width: item.width }} rules={[{ required: item.required }]}>
                <Select placeholder={item.placeholder} size='large' style={{ width: item.inputWidth }}>
                  { item.options && item.options.map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
                </Select>
              </FormItem>
              <FormItem >
                <Btn btnConfig={item.btnConfig} onClick={props.onClick}></Btn>
              </FormItem>
            </FormItem>)
          }else if (item.type === FormType.Tag) {
            const value = form.getFieldsValue()[item.name || ''];
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <TagModule
                value={value || []}
                 maxLength={item.maxLength || 1}
                 minLength={item.minLength || 1}
                 maxNum={item.maxNum || 0}
                 onChange={(newValue) => onChange(newValue, item.name || '')}/>
            </FormItem>)
          }
        }) }
        {
          props.config && props.config.buttonConfig &&
            <Button className={props.config.buttonConfig.className} type="primary" size={props.config.buttonConfig.size} htmlType="submit">
              {props.config.buttonConfig.text}</Button>
        }
      </Form>
    </div>
  )
}

export default WildcatForm
