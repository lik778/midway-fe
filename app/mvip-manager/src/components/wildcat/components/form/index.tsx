//主要的页面方式
import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { FormConfig } from '@/components/wildcat/interfaces';
import { FormType } from '@/components/wildcat/enums';

const Option = Select.Option;
const TextArea = Input.TextArea;
const FormItem = Form.Item;

interface Props {
  config?: FormConfig
}


const WildcatForm = (props: Props) => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div>
      <Form form={form} name={props.config && props.config.name} onFinish={onFinish}>
        { props.config && props.config.children.map(item => {
          // 这里要把组件再次封装一下
          return (
            <FormItem label={item.label} name={item.name} key={item.label}  style={{ width: item.width }}>
              { item.type === FormType.Input && <Input placeholder={item.placeholder}/> }
              { item.type === FormType.Textarea && <TextArea placeholder={item.placeholder} rows={6}/> }
              { item.type === FormType.Select &&
                <Select placeholder={item.placeholder}>
                  { item.options && item.options.map(option => <Option key={option.key} value={option.value}>{option.key}</Option>)}
                </Select>
              }
            </FormItem>
          )
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
