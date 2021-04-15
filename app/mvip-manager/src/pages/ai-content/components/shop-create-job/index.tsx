import React, { ChangeEvent, useState } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { history } from 'umi'
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE } from '@/models/shop';
import { wordsItemConfig } from '@/constants';
import './index.less';
import { createAiJobApi } from '@/api/ai-content';
import { CreateAiContentNav } from './components/nav';
import { randomList, translateProductText } from '@/utils';
import { aiDefaultWord } from './data'
import { errorMessage, successMessage } from '@/components/message';
import MyModal, { ModalType } from '@/components/modal';
import { ShopStatus } from '@/interfaces/shop';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const ShopCreateJob = (props: { shopStatus: ShopStatus | null }) => {
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
    const wordsList = words.split('\n')
    const dedupWordsList = Array.from(new Set(wordsList));
    const maxLength = wordsItemConfig[name].max;
    const data = dedupWordsList.length > maxLength ? dedupWordsList.splice(0, maxLength) : dedupWordsList;
    values[name] = data.join('\n')
    form.setFieldsValue(values)
    counters[name] = data.filter(x => x !== '').length;
    setCounters({ ...counters })
  }

  const onFiledBlur = (name: string) => {
    const values = form.getFieldsValue()
    const fieldValue = values[name]
    if (fieldValue) {
      const formatFieldValue: string = fieldValue.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\n]+/g, '')
      values[name] = formatFieldValue
      form.setFieldsValue(values)
      counters[name] = formatFieldValue.split('\n').filter(x => x !== '').length;
      setCounters({ ...counters })
    }
  }

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
    const concatWords: string[] = randomList(aiDefaultWord[dataName], maxLength)
    formValues[name] = concatWords.join('\n')
    counters[name] = concatWords.length
    setCounters({ ...counters })
    form.setFieldsValue(formValues)
  }

  const isValidForm = (): boolean => {
    const errorList: string[] = []
    Object.keys(counters).forEach(x => {
      const min = wordsItemConfig[x].min
      const max = wordsItemConfig[x].max
      if (counters[x] < min || counters[x] > max) {
        errorList.push(`${wordsItemConfig[x].label}最少${min}个词，最多${max}个词。`)
      }
    })
    if (errorList.length > 0) {
      errorMessage(`提交失败：${errorList.join('\n')}`)
      return false
    } else {
      return true
    }
  }

  const submitData = async () => {
    if (!form.getFieldValue('contentCateId')) {
      errorMessage('请选择文章分组')
      return
    }
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
        successMessage('添加成功')
        window.location.reload()
      } else {
        errorMessage(res.message)
      }
    }
  }


  return (<div>
    {/*<MainTitle title="新建任务"/>*/}
    <div className="ai-create-job-box">
      <CreateAiContentNav form={form} showPanel={() => setVisiblePanel(true)} />
      {visiblePanel && (
        <div>
          <ul className="ai-handle-tips">
            <h3>说明：</h3>
            <li>1、请填写「地区+前缀+核心词+后缀」，例如生成「上海+靠谱的+家电维修+价格」，该信息将用于生成文章及站点SEO元素</li>
            <li>2、每个词语之间请换行</li>
            <li>3、避免填写标点符号、错别字、以及有违规风险的词</li>
            <li>4、提交并通过审核后，不可修改</li>
          </ul>
          <div className="ai-create-box">
            <Form name="create-job-form" form={form} onFinish={submitData}>
              <Row className="group-words-list" gutter={16} style={{ paddingTop: 32 }}>
                {
                  Object.keys(wordsItemConfig).map((k) => {
                    const x = wordsItemConfig[k];
                    return (<Col key={k} className="gutter-row group-words-item" span={6}>
                      <div className="form-item-header">{x.label}：<span>{x.rules}</span></div>
                      <FormItem name={x.name}>
                        <TextArea rows={15} placeholder={x.placeholder} onBlur={() => onFiledBlur(x.name)}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => wordsChange(e.target.value, x.name)} />
                      </FormItem>
                      <div className="words-num">已输入：{counters[x.name]} / {wordsItemConfig[k].max}</div>
                      <div className="ai-content-actions">
                        {x.name === 'wordB' && <Button onClick={() => obtainData(x.name)}>通用前缀</Button>}
                        {x.name === 'wordD' && shopStatus && shopStatus.domainType && <Button onClick={() => obtainData(x.name, shopStatus.domainType)}>
                          {translateProductText('aiRecommond', shopStatus && shopStatus.domainType)}</Button>}
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
            <Button style={{ width: 120, height: 40, background: '#096DD9', borderColor: '#096DD9' }} type="primary" onClick={() => setModalVisible(true)} htmlType="submit">提交</Button>
          </div>
          <MyModal
            title="确认提交"
            content="提交后不可修改，确认提交吗？"
            type={ModalType.info}
            onCancel={() => setModalVisible(false)}
            onOk={() => history.push('/company-info/base')}
            footer={<div>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" loading={submitLoading} onClick={() => submitData()}>确认</Button>
            </div>}
            visible={modalVisible} />
        </div>
      )}

    </div>
  </div>)
}

export default connect((state: ConnectState) => {
  return {
    shopStatus: state[SHOP_NAMESPACE].shopStatus,
  }
})(ShopCreateJob)
