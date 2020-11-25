import React from 'react';
import { Button, Cascader, Form, Input, Select } from 'antd';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';
import { ImgUpload } from '@/components/wildcat-form/components/img-upload';

const Option = Select.Option;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

interface Props {
  config: FormConfig,
  submit(values: any): void;
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
      <Form form={form} name={props.config && props.config.name} onFinish={props.submit}>
        { props.config && props.config.children.map(item => {
          if (item.type === FormType.Input) {
            return (<FormItem label={item.label} name={item.name} key={item.label}  style={{ width: item.width }}>
              <Input placeholder={item.placeholder} size='large'/>
            </FormItem>)
          } else if (item.type === FormType.Textarea) {
            return (<FormItem label={item.label} name={item.name} key={item.label}  style={{ width: item.width }}>
              <TextArea placeholder={item.placeholder} rows={6} size='large'/>
            </FormItem>)
          } else if (item.type === FormType.Select) {
            return (<FormItem label={item.label} name={item.name} key={item.label}  style={{ width: item.width }}>
              <Select placeholder={item.placeholder} size='large'>
                { item.options && item.options.map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
              </Select>
            </FormItem>)
          } else if (item.type === FormType.ImgUpload) {
            return (<FormItem label={item.label} name={item.name} key={item.label}  style={{ width: item.width }}>
              <ImgUpload />
            </FormItem>)
          } else if (item.type === FormType.AreaSelect) {
            return (<FormItem label={item.label} name={item.name} key={item.label}  style={{ width: item.width }}>
              <Cascader size='large' options={options} />
            </FormItem>)
          }
        }) }
        {
          props.config && props.config.buttonConfig && <Button type="primary" size={props.config.buttonConfig.size} htmlType="submit">
            {props.config.buttonConfig.text}</Button>
        }
      </Form>
    </div>
  )
}

export default WildcatForm
