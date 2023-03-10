import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { useHistory } from 'umi'
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { wordsItemConfig } from '@/constants/ai-module';
import styles from './index.less';
import { createAiJobApi, saveWord, getWord } from '@/api/ai-module';
import { CreateAiContentNav } from './components/nav';
import { randomList, translateProductText } from '@/utils';
import MainTitle from '@/components/main-title'
import { aiDefaultWord } from './data'
import { errorMessage, successMessage } from '@/components/message';
import MyModal, { ModalType } from '@/components/modal';
import { DomainStatus } from '@/enums'
import { shopMapStateToProps, shopMapDispatchToProps } from '@/models/shop'
import { AiShopList, AiTaskApiParams } from '@/interfaces/ai-module';
import AiModuleContext from '../context'
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const CreateShop = () => {
  const history = useHistory()
  const { copyId, copyIdType, handleChangeContextData } = useContext(AiModuleContext)
  // 店铺信息
  const [form] = Form.useForm();
  const [nowShopInfo, setNowShopInfo] = useState<AiShopList>()
  const defaultCounters: any = {};
  Object.keys(wordsItemConfig).forEach((k: string) => defaultCounters[k] = 0)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [visiblePanel, setVisiblePanel] = useState<boolean>(false)
  const [counters, setCounters] = useState<any>(defaultCounters)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
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

  const getWordFn = async () => {
    if (copyId && copyIdType === 'shop') {
      const res = await getWord({ wordId: copyId })
      if (res.success) {
        const { city, area, prefix, coreWords, suffix } = res.data
        form.setFieldsValue({
          wordA: area && area.length > 0 ? area.join('\n') : city && city.length > 0 ? city.join('\n') : undefined,
          wordB: (prefix || []).join('\n'),
          wordC: (coreWords || []).join('\n'),
          wordD: (suffix || []).join('\n'),
        })
        setCounters({
          wordA: area.length,
          wordB: prefix.length,
          wordC: coreWords.length,
          wordD: suffix.length,
        })
      } else {
        console.log('请求拷贝数据失败')
      }
      handleChangeContextData('copyId', null)
      handleChangeContextData('copyIdType', null)
    }
  }

  useEffect(() => {
    if (visiblePanel) {
      getWordFn()
    }
  }, [visiblePanel])

  useEffect(() => {
    track({
      eventType: BXMAINSITE,
      data: {
        event_type: BXMAINSITE,
        action: 'entry-page',
        action_page: 'shop-task-create',
      }
    })
  }, [])

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

  const saveWordFn = async (params: AiTaskApiParams) => {
    const res = await saveWord({
      aiSource: 'shop',
      area: params.wordA,
      prefix: params.wordB,
      coreWords: params.wordC,
      suffix: params.wordD
    })
    if (res.success) {
      return res.data
    } else {
      errorMessage(res.message)
      return Promise.reject()
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
      const wordId = await saveWordFn(values)
      console.log('saveWordFn', values, wordId)
      const res = await createAiJobApi({
        ...values,
        wordId,
      })
      setSubmitLoading(false)
      if (res.success) {
        successMessage('添加成功')
        history.goBack()
        track({
          eventType: BXMAINSITE,
          data: {
            event_type: BXMAINSITE,
            action: 'time-end',
            action_page: 'shop-task-create',
          }
        })
      } else {
        errorMessage(res.message)
      }
    }
  }

  const handleChangeShop = (shopInfo: AiShopList) => {
    setNowShopInfo(shopInfo)
  }

  return (<div>
    <MainTitle title="店铺文章AI任务填写" showJumpIcon={true} />
    <div className={styles["ai-create-job-box"]}>
      <CreateAiContentNav form={form} showPanel={() => setVisiblePanel(true)} handleChangeShop={handleChangeShop} />
      {visiblePanel && (
        <div>
          <ul className={styles["ai-handle-tips"]}>
            <h3>说明：</h3>
            <li>1、请填写「地区+前缀+核心词+后缀」，例如生成「上海+靠谱的+家电维修+价格」，该信息将用于生成文章及站点SEO元素</li>
            <li>2、每个词语之间请换行</li>
            <li>3、避免填写标点符号、错别字、以及有违规风险的词</li>
            <li>4、提交并通过审核后，不可修改</li>
          </ul>
          <div className={styles["ai-create-box"]}>
            <Form name="create-job-form" form={form} onFinish={submitData}>
              <Row className={styles["group-words-list"]} gutter={16}>
                {
                  Object.keys(wordsItemConfig).map((k) => {
                    const x = wordsItemConfig[k];
                    return (<Col key={k} className={`${styles['gutter-row']} ${styles['group-words-item']}`} span={6}>
                      <div className={styles["form-item-header"]}>{x.label}：<span>{x.rules}</span></div>
                      <FormItem name={x.name}>
                        <TextArea rows={15} placeholder={x.placeholder} onBlur={() => onFiledBlur(x.name)}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => wordsChange(e.target.value, x.name)} />
                      </FormItem>
                      <div className={styles["words-num"]}>已输入：{counters[x.name]} / {wordsItemConfig[k].max}</div>
                      <div className={styles["ai-content-actions"]}>
                        {x.name === 'wordB' && <Button onClick={() => obtainData(x.name)}>通用前缀</Button>}
                        {x.name === 'wordD' && nowShopInfo && nowShopInfo.type && <Button onClick={() => obtainData(x.name, nowShopInfo.type === 1 ? DomainStatus.SUFFIX : DomainStatus.PREFIX)}>
                          {translateProductText('aiRecommond', nowShopInfo.type === 1 ? DomainStatus.SUFFIX : DomainStatus.PREFIX)}</Button>}
                        <Button onClick={() => clearAll(x.name)}>清空</Button>
                      </div>
                    </Col>
                    )
                  })
                }
                {/* "wordD-PREFIX": suffixServiceDefaultData,
                  "wordD-SUFFIX": suffixB2BDefaultData */}
                {/* [DomainStatus.PREFIX]: {
                    main: '产品',
                    aiRecommond: '产品通用后缀'
                    2
                  },
                  [DomainStatus.SUFFIX]: {
                    main: '服务',
                    aiRecommond: '服务通用后缀'
                    1
                  } */}
              </Row>
            </Form>
            <p className={styles["group-words-rules"]}>组合规则：<span>地区+前缀+核心词+后缀</span>
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

export default CreateShop