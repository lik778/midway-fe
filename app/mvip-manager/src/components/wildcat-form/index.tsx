import React, { ReactNode, useEffect } from 'react';
import { Button, Form, Input, Select, Checkbox } from 'antd';
import { FormConfig, OptionCheckBox } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';
import { ImgUpload } from '@/components/wildcat-form/components/img-upload';
import { TagModule } from '@/components/wildcat-form/components/tag';
import AreaSelect from '@/components/wildcat-form/components/area-select';
import InputLen from '@/components/input-len';
import { isEmptyObject } from '@/utils';

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
  useLabelCol?: boolean;
  loading?: boolean;
  submitBtn?: ReactNode;
}


const WildcatForm = (props: Props) => {
  //通过 Form.useForm 对表单数据域进行交互
  const [form] = Form.useForm();
  const { editDataSource, useLabelCol, onInit, loading } = props
  useEffect(() => {
    console.log("大表单开始数据：",editDataSource)

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
    console.log("表单选择项",newValue)
    const configItem = props.config.children.find(item=>item.name === name)
    //如果配置项里有onChange
    if(configItem?.onChange){configItem.onChange(newValue,form)}

    const values = form.getFieldsValue()
    values[name] = newValue
    //给表格数据加选择后的数据
    form.setFieldsValue(values)
  }

  const getEditData = (name: string) => {
    return editDataSource && editDataSource[name];
  }
  const CheckboxGroup = Checkbox.Group;

  return (
    <div>
      <Form form={form} name={props.config && props.config.name} labelCol={useLabelCol ? { span: 6 } : {}}
        onFinish={props.submit} onValuesChange={props.formChange} className={`form-styles ${props.className}`}>
        { props.config && props.config.children.map(item => {
          const patternList = item.patternList ? item.patternList : [];
          if (item.type === FormType.Input) {
            return (
                <FormItem className={item.className}  label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }, ...patternList]}>
                  <InputLen width={item.inputWidth} placeholder={item.placeholder}  maxLength={item.maxLength} minLength={item.minLength} disabled={item.disabled} showCount={item.showCount}/>
                </FormItem>
              )
          } else if (item.type === FormType.Textarea) {
            return (<FormItem className={item.className} label={item.label} labelCol={{ span: 3 }} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }, ...patternList]}>
              <TextArea showCount style={{ width: item.inputWidth }} placeholder={item.placeholder} rows={6} size='large' maxLength={item.maxLength} minLength={item.minLength}/>
            </FormItem>)
          } else if (item.type === FormType.Select) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <Select
                onChange={(newValue) => onChange(newValue, item.name || '')}
                placeholder={item.placeholder} size='large'
                style={{ width: item.inputWidth }}>
                { item.options && item.options.map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
              </Select>
            </FormItem>)
          } else if (item.type === FormType.ImgUpload) {
            if (item.images && item.images.length === 1) {
              return (<FormItem className={item.className} key={item.label} >
                {
                  item.images.map((img) => {
                  return (<FormItem name={img.name} key={img.name}
                                    style={{ width: item.width }} labelCol={{ span: 3 }}
                                    label={item.label} rules={[{required: item.required, message: `请上传${item.label}` }]}>
                      <ImgUpload key={img.text} name={img.name} text={img.text}  editData={editDataSource}
                                 maxLength={item.maxLength || 0}  onChange={(newValue) => onChange(newValue, item.name || '')}/>
                    </FormItem>
                  )
                  })
                }
                <FormItem style={{ width: item.width, marginLeft: 83, color: '#999' }}><p className="tip">{item.tip}</p></FormItem>
              </FormItem>)
            } else if (item.images && item.images.length > 1) {
              return (<FormItem className={item.className} key={item.label}
                  style={{ width: item.width }} labelCol={{ span: 3 }} label={item.label}>
                {
                  item.images.map((img) => {
                    return (<FormItem name={img.name} key={img.name} style={{ display: 'inline-block' }}>
                        <ImgUpload key={img.text} name={img.name} text={img.text} editData={editDataSource} maxLength={item.maxLength || 0}
                           onChange={(newValue) => onChange(newValue, item.name || '')}/>
                      </FormItem>
                    )
                  })
                }
                <FormItem><p className="tip">{item.tip}</p></FormItem>
              </FormItem>)
            }
          } else if (item.type === FormType.AreaSelect) {
            const value = getEditData(item.name || '');
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }, ...patternList]}>
              <AreaSelect initialValues={value} onChange={(values: string[]) => onChange(values, item.name || '')}/>
            </FormItem>)
          } else if (item.type === FormType.GroupSelect) {
            return (<FormItem key={item.label}>
              <FormItem className={item.className} label={item.label} name={item.name}  style={{ width: item.width }} rules={[{ required: item.required }]}>
                <Select placeholder={item.placeholder} size='large' style={{ width: item.inputWidth }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                  { item.options && item.options.map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
                </Select>
              </FormItem>
              <FormItem >
                { item.btnConfig && <Button type="primary" className="primary-btn p-btn mvip-primary-btn" onClick={props.onClick}>+{ item.btnConfig && item.btnConfig.text }</Button> }
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
            }else if(item.type === FormType.MetaChecbox && item.display){
            //const metas = [{"label":"办公室装修","value":"m35988"},{"label":"厂房装修","value":"m35989"}];
            //const initialCheckedMetas = ["m35988"];
            return (
              <FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
                <CheckboxGroup
                options={item.options as OptionCheckBox[]}
                //这个defaultValue提示报可能不能用，待查
                //defaultValue={initialCheckedMetas}
                />
              </FormItem>
            )
          //引用原先的
          //  {
          //    this.state.fuwuMeta.length > 0 ?
          //        <FormItem {...formItemLayout} label="服务内容" required>
          //            {/* 这里有个坑： defaultValue要想再次渲染，给其添加一个Key，值为defaultValue才可以 */}
          //            <CheckboxGroup options={this.state.fuwuMeta} onChange={this.onChangeCheckedMeta}
          //                            defaultValue={this.state.initialCheckedMetas}
          //                            key={this.state.initialCheckedMetas}/>
          //        </FormItem> : ''
          //}
          }
        }) }
        {
          props.submitBtn || props.config && props.config.buttonConfig &&
          (<Button loading={loading} className={props.config.buttonConfig.className} type="primary" size={props.config.buttonConfig.size} htmlType="submit">
            {props.config.buttonConfig.text}</Button>)
        }
      </Form>
    </div>
  )
}

export default WildcatForm
