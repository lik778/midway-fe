import React, { ChangeEvent, useCallback, useState } from 'react';
import { message, Tooltip, Form, Button, Modal, Input, Row, Col } from 'antd';
import { history } from 'umi'
import MainTitle from '@/components/main-title';
import { wordsItemConfig } from './config';
import { debounce } from 'lodash';
import './index.less';
import { createAiJobApi } from '@/api/ai-content';
import { CreateAiContentNav } from  './components/nav';
import qsIcon from '../../../styles/qs-icon.svg'
import { randomList, translateProductText } from '@/utils';
import { aiDefaultWord } from './data'

const FormItem = Form.Item;
const TextArea = Input.TextArea;

export default (props: any) => {
  const [form] = Form.useForm();
  const defaultCounters: any = {};
  Object.keys(wordsItemConfig).forEach((k: string) => defaultCounters[k] = 0)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [visiblePanel, setVisiblePanel] = useState<boolean>(false)
  const [counters, setCounters] = useState<any>(defaultCounters)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  // 店铺信息
  const { shopStatus } = props
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
    counters[name] = data.filter(x => x !== '').length;
    setCounters({ ...counters })
  }

  const delayedQuery = useCallback(debounce((words, name) => { wordsChange(words, name) }, 500), []);

  const clearAll = (name: string) => {
    const values = form.getFieldsValue()
    values[name] = ''
    counters[name] = 0
    form.setFieldsValue(values);
    setCounters({ ...counters })
  }
  // 获取通用数据
  const obtainData = (name: string, type?: string) => {
    const maxLength = wordsItemConfig[name].max;
    const formValues = form.getFieldsValue()
    const dataName = type ? `${name}-${type}` : name
    // 这里要做一下随机值
    const concatWords: string[] = randomList(aiDefaultWord[dataName], maxLength)
      .concat(formValues[dataName] === undefined ? [] : formValues[name].split('\n'))
    const sliceWords: string[] = concatWords.length <= maxLength ? concatWords : concatWords.slice(0, maxLength)
    formValues[name] = sliceWords.join('\n')
    counters[name] = sliceWords.length
    setCounters({ ...counters} )
    form.setFieldsValue(formValues)
  }

  const isValidForm =(): boolean => {
    const errorList: string[] = []
    Object.keys(counters).forEach(x => {
      const min = wordsItemConfig[x].min
      const max = wordsItemConfig[x].max
      if (counters[x] < min || counters[x] > max) {
        errorList.push(`${wordsItemConfig[x].label}最少${min}个词，最多${max}个词。`)
      }
    })
    if (errorList.length > 0) {
      message.error(`提交失败：${errorList.join('\n')}`)
      return false
    } else {
      return true
    }
  }

  const submitData = async () => {
    if (isValidForm()) {
      const values = form.getFieldsValue()
      const groupNames = Object.keys(wordsItemConfig).map((x: string) => x)
      Object.keys(values).forEach((k: string) => {
        if (groupNames.includes(k)) {
          values[k] = (values[k] && values[k].split('\n')) || []
        }
      })
      setSubmitLoading(true)
      const res = await createAiJobApi(values)
      setSubmitLoading(false)
      if (res.success) {
        message.success('添加成功')
        history.push(`/ai-content/job-list`);
      } else {
        message.error(res.message)
      }
    }
  }


  return (<div>
    <MainTitle title="新建任务"/>
    <div className="ai-create-job-box">
      <CreateAiContentNav form={form} showPanel={() => setVisiblePanel(true)}/>
      { visiblePanel && (
        <div>
          <div className="ai-create-box">
            <Form name="create-job-form" form={form} onFinish={submitData}>
              <Row className="group-words-list" gutter={16} style={{ paddingTop: 32 }}>
                {
                  Object.keys(wordsItemConfig).map((k) => {
                    const x = wordsItemConfig[k];
                    return (<Col key={k} className="gutter-row group-words-item" span={6}>
                        <h4>{x.label}：
                          <Tooltip placement="topLeft" title={x.rules}>
                            <span className="ai-group-word-tips">
                              {x.label}规则<img src={qsIcon} />
                            </span>
                          </Tooltip>
                        </h4>
                        <FormItem name={x.name}>
                          <TextArea rows={15} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => delayedQuery(e.target.value, x.name)} />
                        </FormItem>
                        <div>已输入:  { counters[x.name] } / { wordsItemConfig[k].max }</div>
                        <div className="ai-content-actions">
                          { x.name === 'wordB' && <Button onClick={() => obtainData(x.name)}>通用前缀</Button> }
                          { x.name === 'wordD' && shopStatus.domainType && <Button onClick={() => obtainData(x.name, shopStatus.domainType)}>
                            { translateProductText('aiRecommond', shopStatus.domainType) }</Button> }
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
            <Button type="primary" onClick={() => setModalVisible(true)} htmlType="submit">提交</Button>
          </div>
          <Modal
          title="确认提交"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={<div>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button type="primary" loading={submitLoading} onClick={() =>submitData()}>确认</Button>
          </div>}>
          <p>提交后不可修改，确认提交吗？</p>
          </Modal>
        </div>
      )}

    </div>
  </div>)
}
