import React, { ChangeEvent, useCallback, useState } from 'react';
import { Select, Form, Button, Input, Row, Col } from 'antd';
import MainTitle from '@/components/main-title';
import { wordsItemConfig } from './config';
import { debounce } from 'lodash';
import './index.less';
const Option = Select.Option;
const FormItem = Form.Item;
const TextArea = Input.TextArea;

export default (props: any) => {
  const [form] = Form.useForm();
  const defaultCounters: any = {};
  Object.keys(wordsItemConfig).forEach((k: string) => defaultCounters[k] = 0)
  const [counters, setCounters] = useState<any>(defaultCounters)

  const wordsChange = (words: string, name: string) => {
    const values = form.getFieldsValue()
    // 这里来去重(包含空格)
    const wordsList = words.split('\n').map(x => x.replace(/\s+/g, ''))
    const dedupWordsList =  Array.from(new Set(wordsList));
    const maxLength = wordsItemConfig[name].max;
    const minLength = wordsItemConfig[name].min;
    const data = dedupWordsList.length > maxLength ? dedupWordsList.splice(0, maxLength) : dedupWordsList;
    values[name] = data.join('\n')
    form.setFieldsValue(values)
    counters[name] = data.length;
    setCounters({ ...counters })
  }

  const delayedQuery = useCallback(debounce((words, name) => { wordsChange(words, name) }, 300), []);

  const clearAll = (name: string) => {
    const values = form.getFieldsValue()
    values[name] = ''
    form.setFieldsValue(values);
  }

  const submitData = () => {
    alert(JSON.stringify(form.getFieldsValue()))
  }
  return (<div>
    <MainTitle title="新建任务"/>
    <div className="ai-create-job-box">
      <div className="ai-filters-box">
        <Form layout="inline" name="">
          <FormItem label="所属店铺" name="shopId" key="shopId">
            <Select  style={{ width: 200, marginRight: 40 }}>
              <Option value="lucy">Lucy</Option>
            </Select>
          </FormItem>
          <FormItem label="所属文章分组" name="contentCateId" key="contentCateId">
            <Select  style={{ width: 200 }}>
              <Option value="lucy">Lucy</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div className="ai-create-box">
          <Form name="create-job-form" form={form} onFinish={submitData}>
            <Row className="group-words-list" gutter={16} style={{ paddingTop: 32 }}>
                {
                  Object.keys(wordsItemConfig).map((k) => {
                    const x = wordsItemConfig[k];
                    return (<Col key={k} className="gutter-row group-words-item" span={6}>
                      <h4>{x.label}</h4>
                      <FormItem name={x.name}>
                        <TextArea rows={15} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => delayedQuery(e.target.value, x.name)} />
                      </FormItem>
                      <div>已输入:  { counters[x.name] } / { wordsItemConfig[k].max }</div>
                      <div className="ai-content-actions">
                        { x.name === 'prefix' && <Button onClick={() => clearAll(x.name)}>通用前缀</Button> }
                        <Button onClick={() => clearAll(x.name)}>清空</Button>
                      </div>
                    </Col>
                    )
                  })
                }
            </Row>
          </Form>
          <p className="group-words-rules">组合规则：<span>地区+前缀+核心词+后缀</span>
            <span>地区+前缀+核心词</span>
            <span>地区+核心词+后缀</span>
            <span>前缀+核心词+后缀</span>
            <span>地区+核心词</span>
            <span>核心词+后缀</span>
            <span>前缀+核心词</span>
          </p>
          <Button type="primary" onClick={submitData} htmlType="submit">提交</Button>
      </div>
    </div>
  </div>)
}
