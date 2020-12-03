import React from 'react';
import { Button, Cascader, Form, Input, Select } from 'antd';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';
import { ImgUpload } from '@/components/wildcat-form/components/img-upload';
import  Btn  from '@/components/btn';

const Option = Select.Option;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

interface Props {
  config: FormConfig,
  submit(values: any): void;
  className?: string,
  onClick?: any,
}

const options = [
  {
    value: 'sichuan',
    label: '四川',
    children: [
      {
        value: 'chendu',
        label: '成都',
        children: [
          {
            value: 'jinjiang',
            label: '锦江区',
          },
          {
            value: 'wuhou',
            label: '武侯区',
          },
        ],
      },
    ],
  }];

const WildcatForm = (props: Props) => {
  const [form] = Form.useForm();
  return (
    <div>
      <Form form={form} name={props.config && props.config.name} onFinish={props.submit} className={props.className}>
        { props.config && props.config.children.map(item => {
          if (item.type === FormType.Input) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <Input style={{ width: item.inputWidth }} placeholder={item.placeholder} size='large' maxLength={item.maxLength} minLength={item.minLength}/>
            </FormItem>)
          } else if (item.type === FormType.Textarea) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <TextArea showCount style={{ width: item.inputWidth }} placeholder={item.placeholder} rows={6} size='large' maxLength={item.maxLength} minLength={item.minLength}/>
            </FormItem>)
          } else if (item.type === FormType.Select) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <Select placeholder={item.placeholder} size='large' style={{ width: item.inputWidth }}>
                { item.options && item.options.map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
              </Select>
            </FormItem>)
          } else if (item.type === FormType.ImgUpload) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <ImgUpload tip={item.tip}/>
            </FormItem>)
          } else if (item.type === FormType.AreaSelect) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <Cascader size='large' options={options} />
            </FormItem>)
          } else if (item.type === FormType.GroupSelect) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }} rules={[{ required: item.required }]}>
              <Select placeholder={item.placeholder} size='large' style={{ width: item.inputWidth }}>
                { item.options && item.options.map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
              </Select>
              <Btn btnConfig={item.btnConfig} onClick={props.onClick}></Btn>
            </FormItem>)
          }else if (item.type === FormType.Tag) {
            return (<FormItem className={item.className} label={item.label} name={item.name} key={item.label}  style={{ width: item.width }}>
              <Select placeholder={item.placeholder} size='large' style={{ width: item.inputWidth }}>
                { item.options && item.options.map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
              </Select>
            </FormItem>)
          }
        }) }
        {
          props.config && props.config.buttonConfig && <Button className={props.config.buttonConfig.className} type="primary" size={props.config.buttonConfig.size} htmlType="submit">
            {props.config.buttonConfig.text}</Button>
        }
      </Form>
    </div>
  )
}

export default WildcatForm
