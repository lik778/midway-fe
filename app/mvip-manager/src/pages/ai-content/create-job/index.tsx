import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { message, Select, Form, Button, Modal, Input, Row, Col } from 'antd';
import { history } from 'umi'
import MainTitle from '@/components/main-title';
import { wordsItemConfig } from './config';
import { debounce } from 'lodash';
import './index.less';
import { getAiShopListApi, createAiJobApi } from '@/api/ai-content';
import { CateItem } from '@/interfaces/shop';
import { AiShopList } from '@/interfaces/ai-content';
const Option = Select.Option;
const FormItem = Form.Item;
const TextArea = Input.TextArea;

export default (props: any) => {
  const [form] = Form.useForm();
  const defaultCounters: any = {};
  Object.keys(wordsItemConfig).forEach((k: string) => defaultCounters[k] = 0)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [counters, setCounters] = useState<any>(defaultCounters)
  const [shopList, setShopList] = useState<AiShopList[]>([])
  const [articleList, setArticleList] = useState<CateItem[]>([])

  useEffect(() => {
    (async () => {
      const res = await getAiShopListApi()
      if (res.success) {
        setShopList(res.data)
      } else {
        message.error(res.message)
      }
    })()
  }, [])

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

  const submitData = async () => {
    const values = form.getFieldsValue()
    const groupNames = Object.keys(wordsItemConfig).map((x: string) => x)
    Object.keys(values).forEach((k: string) => {
      if (groupNames.includes(k)) {
        values[k] = values[k].split('\n')
      }
    })
    const res = await createAiJobApi(values)
    if (res.success) {
      message.success('添加成功')
      history.push(`/shop/${values.shopId}/article`);
    } else {
      message.error(res.message)
    }
  }

  const onShopChange = (shopId: number) => {
    const item = shopList.find((x: AiShopList) => x.id === shopId)
    setArticleList((item && item.articleCates) || [])
  }

  return (<div>
    <MainTitle title="新建任务"/>
    <div className="ai-create-job-box">
      <div className="ai-filters-box">
        <Form layout="inline" form={form}>
          <FormItem label="所属店铺" name="shopId" key="shopId">
            <Select  style={{ width: 200, marginRight: 40 }} placeholder="请选择所属店铺" onChange={onShopChange}>
              { shopList.length > 0 && shopList.map((shop: any) => {
                return (<Option key={shop.id} value={shop.id}>{shop.name}</Option>)
              }) }
            </Select>
          </FormItem>
          <FormItem label="所属文章分组" name="contentCateId" key="contentCateId">
            <Select  style={{ width: 200 }} placeholder="请选择所属文章分组" >
              { articleList.length > 0 && articleList.map((article: any) => {
                return (<Option key={article.id} value={article.id}>{article.name}</Option>)
              }) }
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
          <Button type="primary" onClick={() => setModalVisible(true)} htmlType="submit">提交</Button>
      </div>
      <Modal
        title="确认提交"
        visible={modalVisible}
        onOk={submitData}
        onCancel={() => setModalVisible(false)}>
        <p>提交后不可修改，确认提交吗？</p>
      </Modal>
    </div>
  </div>)
}
