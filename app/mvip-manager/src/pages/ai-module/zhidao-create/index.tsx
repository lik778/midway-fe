import React, { ChangeEvent, useEffect, useState, useMemo, useCallback, FC } from 'react';
import { Form, Button, Input, Row, Col, Select, Spin } from 'antd';
import { useHistory } from 'umi'
import styles from './index.less';
import { getCreateQuestionTaskPageStatusApi, getCreateQuestionTaskBasicDataApi, submitCoreWordsApi, getQuotaNumApi } from '@/api/ai-module';
import { QuestionTaskApiParams, InterrogativeListItem, CreateQuestionTaskPageStatus, CreateQuestionTaskBasicData, InterrogativeDataVo } from '@/interfaces/ai-module'
import { getCookie, randomList, } from '@/utils';
import MainTitle from '@/components/main-title'
import { aiDefaultWord } from './data'
import { errorMessage } from '@/components/message';
import MyModal, { ModalType } from '@/components/modal';
import TipModal from './components/tip-modal'
import { debounce } from 'lodash'

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const { Option } = Select;

interface Rule {
  required: boolean,
  // message: string,
  validator: (rule: any, value: any, callback: (error?: string) => void) => Promise<void | any> | void,
}

interface FormItemListItem {
  key: keyof QuestionTaskApiParams,
  label: string,
  min: number,
  max: number,
  auto?: number
  tip: string,
  rules: Rule[],
  readOnly?: boolean
  placeholder: string,
}


const validateItem: (key: string, min: number, max: number, rule: Rule, value: string | InterrogativeListItem[]) => Promise<any> = (key, min, max, rule, value) => {
  if (key === 'area' || key === 'prefix' || key === 'coreWords' || key === 'modal') {
    const dataList = value && typeof value === 'string' ? value.split('\n').filter((item: string) => item !== '') : []
    if (dataList.length < min) {
      return Promise.reject(new Error(`词语数不得少于${min}个`));
    }
    if (dataList.length > max) {
      return Promise.reject(new Error(`词语数不得多于${max}个`));
    }
  } else {
    const wordCount = (value as InterrogativeListItem[]).reduce((total, item) => {
      if (item.isSelect) {
        return total + 1
      } else {
        return total
      }
    }, 0)
    if (wordCount < min) {
      return Promise.reject(new Error(`疑问词类型不得少于${min}个`));
    }
    if (wordCount > max) {
      return Promise.reject(new Error(`疑问词类型不得多于${max}个`));
    }
  }
  return Promise.resolve()
}

interface QuotaNumInterface {
  aiRemain: number,
  remain: number,
  consumeCount: number,
  buyUrl?: string
}


const CreateZhidao: FC = () => {
  const history = useHistory()
  const [uid, setUid] = useState<string>(() => getCookie('__u'))
  const [form] = Form.useForm();
  const [wordsNum, setWordsNum] = useState({
    area: 0,
    prefix: 0,
    coreWords: 0,
    suffix: 0,
    modal: 0,
  })

  /** 页面的一些参数 控制显示 */
  const [componentBasicData, setComponentBasicData] = useState<CreateQuestionTaskBasicData | null>(null)
  /** 疑问词 */
  const [interrogativeWord, setInterrogativeWord] = useState<InterrogativeListItem[]>([])
  /** 下面的表单
   * @description 这里是因为疑问词的校验依赖疑问词的选中，所以用useMemo
   */
  const formItemList = useMemo<FormItemListItem[]>(() => [{
    label: '地区',
    key: 'area',
    min: 7,
    max: 30,
    tip: '7-30个',
    rules: [{
      required: true,
      // message: `请输入地区！(7-30个)`,
      validator: (rule: Rule, value: any) => validateItem('area', 7, 30, rule, value),
    }],
    placeholder: '举例：\n浦东新区\n东方明珠\n南京西路',
  }, {
    label: '前缀',
    key: 'prefix',
    min: 15,
    max: 30,
    auto: 8,
    tip: '15-30个',
    rules: [{
      required: true,
      // message: `请输入前缀！(15-30个)`,
      validator: (rule: Rule, value: any) => validateItem('prefix', 15, 30, rule, value),
    }],
    placeholder: '举例：\n修饰词：\n靠谱的\n附近的\n\n行业细分词：\n公司注册：科技公司、游戏公司',
  }, {
    label: '核心词',
    key: 'coreWords',
    placeholder: '举例：\n冰箱维修\n气动隔膜泵',
    min: 7,
    max: 30,
    tip: '7-30个',
    rules: [{
      required: true,
      // message: `请输入核心词！(7-30个)`,
      validator: (rule: Rule, value: any) => validateItem('coreWords', 7, 30, rule, value),
    }],
  }, {
    label: '疑问词',
    key: 'suffix',
    placeholder: '请点击疑问词类型选择',
    min: 30,
    max: 40,
    tip: '3-4个类型',
    rules: [{
      required: true,
      // message: `请选择地区！(3-5个类型)`,
      validator: (rule: Rule, value: any) => validateItem('suffix', 3, 5, rule, interrogativeWord),/** 这里用了state里的interrogativeWord */
    }],
    readOnly: true
  }, {
    label: '辅助词',
    key: 'modal',
    placeholder: '请点击通用辅助词按钮获取',
    // placeholder: '举例：\n在线等！\n有大佬知道的吗？\n求高手帮助',
    min: 20,
    max: 20,
    auto: 20,
    tip: '20个',
    rules: [{
      required: true,
      validator: (rule: Rule, value: any) => validateItem('modal', 20, 20, rule, value),
    }],
    readOnly: true
  }], [interrogativeWord])

  const [quotaNum, setQuotaNum] = useState<QuotaNumInterface>({} as QuotaNumInterface)

  /** 当页面处于进行中状态时 需要禁止操作 */
  const [pageStatus, setPageStatus] = useState<CreateQuestionTaskPageStatus | null>(null)
  const [upDataLoading, setUpdataLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [showTipModal, setShowTipModal] = useState<boolean>(false)

  const suffixValue = useMemo(() => {
    return interrogativeWord.filter(item => item.isSelect).map(item => item.id)
  }, [interrogativeWord])

  useEffect(() => {
    if (pageStatus) {
      // 只有正常的时候才不用显示弹窗
      if (pageStatus === 'CREATE_WAITING') {
        setShowTipModal(true)
      } else if (pageStatus === 'SHOW_CREATE' && componentBasicData) {
        setShowTipModal(Boolean(!(pageStatus === 'SHOW_CREATE' && componentBasicData.canCreateTask) && componentBasicData.forceNotice))
      }
    } else {
      setShowTipModal(false)
    }
  }, [pageStatus, componentBasicData])


  const closeTipModal = (showModal: false) => {
    if (componentBasicData && !componentBasicData.forceNotice) {
      setShowTipModal(showModal)
    }
  }

  const getQuotaNum = async () => {
    const res = await getQuotaNumApi()
    if (res.success) {
      const { queryResultVo, consumeCount, buyUrl } = res.data
      setQuotaNum({
        aiRemain: queryResultVo.aiRemain,
        remain: queryResultVo.remain,
        consumeCount,
        buyUrl
      })
    }
  }

  useEffect(() => {
    getQuotaNum()
  }, [])


  const mockInterrogativeWord = (): InterrogativeDataVo => {
    const word = ['品牌宣传', '价格决策', '品质决策', '联系方式', '注意事项']

    return word.reduce((total, item, index) => {
      const childObj: {
        [key: string]: string
      } = {}
      let i = 0;
      while (i < 10) {
        childObj[`${index * 10 + i}`] = `${item}-数据${i}`
        i++
      }
      total[item] = childObj
      return total
    }, {} as InterrogativeDataVo)
  }

  const getCreateQuestionTaskBasicDataFn = async () => {
    const res = await getCreateQuestionTaskBasicDataApi()
    // const res = await mockData<CreateQuestionTaskBasicData>('data', {
    //   canCreateTask: false,
    //   forceNotice: true,
    //   nextAction: 'USER_QA_MATERIAL',
    //   notice: '填充问答素材',
    //   suggestSuffix: null

    //   // forceNotice: true,
    //   // nextAction: 'USER_PROFILE',
    //   // notice: '填充用户基础信息',
    //   // suggestSuffix: mockInterrogativeWord()

    //   // canCreateTask: false,
    //   // forceNotice: true,
    //   // nextAction: 'USER_MATERIAL',
    //   // notice: '补充基础素材库',
    //   // suggestSuffix: mockInterrogativeWord()

    //   // canCreateTask: true,
    //   // forceNotice: false,
    //   // nextAction: 'SHOW_CREATE',
    //   // notice: '可以创建',
    //   // suggestSuffix: mockInterrogativeWord()
    // })
    if (res.success) {
      const { canCreateTask, suggestSuffix } = res.data
      setComponentBasicData(res.data)
      if (suggestSuffix) {
        const data: InterrogativeListItem[] = []
        data.push(...Object.keys(suggestSuffix).map((item, index) => ({
          id: index + 1,
          name: item,
          child: [...Object.keys(suggestSuffix[item]).map((cItem) => ({
            id: Number(cItem),
            content: suggestSuffix[item][cItem]
          }))],
        })))
        if (data.length !== interrogativeWord.length) {
          setInterrogativeWord(data)
        }
      }
    }
  }

  /** 获取页面状态  如果能创建任务 则请求接下来的基础数据 */
  const getComponentStatus = async () => {
    setComponentBasicData(null)
    const res = await getCreateQuestionTaskPageStatusApi()
    // const res = await mockData<CreateQuestionTaskPageStatus>('data', 'SHOW_CREATE')
    // // const res = await mockData<CreateQuestionTaskPageStatus>('data', 'loading')
    // // const res = await mockData<CreateQuestionTaskPageStatus>('data', 'showQuestionList')
    if (res.success) {
      setPageStatus(res.data)
    } else {
      //console.log(res)
    }
    return res.data
  }

  /** 初始化组件
   * @description 先判断是否要跳页再请求具体参数
  */
  const initCompoment = async () => {
    setPageStatus(null)
    setComponentBasicData(null)
    setGetDataLoading(true)
    const pageStatus = await getComponentStatus()
    if (pageStatus === 'SHOW_QA_LIST') {
      history.push(`/ai-module/zhidao-detail?pageType=edit`)
    } else if (pageStatus === 'SHOW_CREATE') {
      await getCreateQuestionTaskBasicDataFn()
    }
    setGetDataLoading(false)
  }

  // 切换tab不会重新渲染页面 需要手动监听 刷新页面
  useEffect(() => {
    initCompoment()
  }, [])

  /** 选择疑问词类型 */
  const selectInterrogativeWord = (id: number, suffix?: string) => {
    const newInterrogativeWord: InterrogativeListItem[] = interrogativeWord.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isSelect: !item.isSelect
        }
      } else {
        return item
      }
    })
    setInterrogativeWord(newInterrogativeWord)
    const str = newInterrogativeWord.reduce((total, item, index) => {
      if (item.isSelect) {
        return `${total}${item.child.map(item => item.content).join('\n')}${item.child && item.child.length > 1 ? '\n' : ''}`
      } else {
        return total
      }
    }, '')
    form.setFieldsValue({
      suffix: str
    })
    // 需要手动触发一次
    form.validateFields(['suffix'])
    getWordNum('suffix', str)
  }


  const getWordNum = (key: string, value: string) => {
    const words = value.split('\n').filter(item => !!item)
    setWordsNum((wordsNum) => ({
      ...wordsNum,
      [key]: words.length
    }))
  }

  /**
   * 去重 去特殊符号
   * @description 注意replace里要把单引号排除，因为中文输入时，输入未结束拼音是以单引号分割的
   * */
  const outgoingControl = (key: string, value: string, type?: 'blur') => {
    let newValue = value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\n\']+/g, '').replace(/\s{1,}\n/g, '\n')
    const words = newValue.split('\n')
    if (words.length > 1) {
      // 当失焦校验时，最后一行也要加入去重
      const endWord = type === 'blur' ? '' : words.pop()
      newValue = `${[...new Set(words.filter(item => !!item))].reduce((total, item) => `${total}${item}\n`, '')}${endWord}`
    }
    getWordNum(key, newValue)
    return newValue
  }

  /** 失焦时去重 */
  const textAreaBlur = useCallback(debounce((key: string) => {
    const value: string | undefined = form.getFieldValue(key)
    form.setFieldsValue({
      [key]: value ? outgoingControl(key, value, 'blur') : ''
    })
    form.validateFields([key])
  }, 200, { leading: false, trailing: true }), []);

  /**
   * 获取通用数据
   *  */
  const obtainData = (key: string) => {
    const value: string | undefined = form.getFieldValue(key)
    const formItem = formItemList.find(item => item.key === key)
    const concatWords: string[] = randomList(aiDefaultWord[key], formItem!.auto || formItem!.max)
    let words: string[] = []
    if (key === 'prefix' && !!value) {
      words = value.split('\n').concat(concatWords)
    } else {
      words = concatWords
    }
    form.setFieldsValue({
      [key]: outgoingControl(key, words.join('\n'))
    })
    form.validateFields([key])
  }


  const handleClickClearItem = (key: string) => {
    form.setFieldsValue({
      [key]: ''
    })
    getWordNum('suffix', '')
    if (key === 'suffix') {
      setInterrogativeWord((value) => {
        return value.map(item => {
          item.isSelect = false
          return item
        })
      })
    }
  }

  const filterSuffixSelect = (input: string, option: any) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  const handleClickValidate = async () => {
    try {
      await form.validateFields();
      setModalVisible(true)
    } catch (e) {
      console.log(e)
    }
  }


  const validateUserId = (): boolean => {
    const nowUserId = getCookie('__u')
    return uid === nowUserId
  }

  const submit = async () => {
    const values = form.getFieldsValue()
    const requestData: QuestionTaskApiParams = {
      area: [],
      prefix: [],
      coreWords: [],
      suffix: [],
      modal: []
    }
    for (let i in values) {
      if (i !== 'suffix') {
        requestData[i as keyof QuestionTaskApiParams] = (values[i] as string).split('\n').filter(item => item)
      } else {
        requestData.suffix = interrogativeWord.filter(item => item.isSelect).reduce((total, item) => {
          return total.concat(item.child.map(cItem => `${cItem.id}|||${cItem.content}|||${item.name}`))
        }, [] as string[])
      }
    }
    setUpdataLoading(true)
    if (!validateUserId()) {
      errorMessage('当前用户已更换，在页面刷新后再试！')
      setTimeout(() => {
        window.location.reload()
      }, 1500)
      return
    }
    const res = await submitCoreWordsApi(requestData)
    setUpdataLoading(false)
    if (res.success) {
      setModalVisible(false)
      initCompoment()
    } else {
      setModalVisible(false)
      errorMessage(res.message || '提交失败')
    }
    // const res = await mockData('data', {})
    // 提交之后 重新请求用户状态
  }

  const taskBuildSuccess = () => {
    setShowTipModal(false)
    initCompoment()
  }


  return (<Spin spinning={getDataLoading || upDataLoading}>
    <MainTitle title="知道AI任务填写" showJumpIcon={true} />
    <div className={styles["ai-create-task-box"]} onClick={() => closeTipModal(false)}>
      <div className={styles["ai-quota-tip"]}>当前AI剩余问答量：<span className={styles['num']}>{quotaNum.aiRemain || 0}&nbsp;</span>个（每个问答消耗&nbsp;{quotaNum.consumeCount || 0}&nbsp;个信息发布点，当前剩余信息发布点：<span className={styles['num']}>{quotaNum.remain || 0}</span>{quotaNum.buyUrl ? <>，<a href={quotaNum.buyUrl} target="_blank">去充值</a> </> : ''}） {
        pageStatus === 'SHOW_CREATE' && (componentBasicData && !componentBasicData.canCreateTask && componentBasicData.forceNotice === null) && <span className={styles['not-auth-tip']}>{componentBasicData.notice ? componentBasicData.notice : '您当前没有足够资源创建问答ai任务'}</span>
      }</div>
      <ul className={styles["ai-handle-tips"]}>
        <h3>组合规则说明：</h3>
        <li>1、请填写<span className={styles['tip']}>「地区+前缀+核心词+疑问词+辅助词」</span>，该信息将用于生成问答内容及站点SEO元素</li>
        <li>2、每个词语之间请换行</li>
        <li>3、避免填写标点符号、错别字、以及有违规风险的词</li>
        <li>4、提交并通过审核后，不可修改</li>
      </ul>
      <Form name="create-task-form" form={form}>
        <Row className={styles["group-words-list"]} gutter={24}>
          {
            formItemList.map((item) => {
              return (<Col key={item.key} className={styles["group-words-item"]} flex="20%" >
                <div className={styles['form-item-header']} >
                  {item.label}：<span style={{ color: 'blue' }}>{item.tip}</span>
                  {item.key === 'suffix' &&
                    <Select mode="multiple" className={styles["suffix-container-dropdown"]}
                      showArrow={true} maxTagCount={'responsive'}
                      filterOption={filterSuffixSelect}
                      value={suffixValue}
                      onSelect={(value: number) => selectInterrogativeWord(value)}
                      onDeselect={(value: number) => selectInterrogativeWord(value)} placeholder='疑问词' disabled={componentBasicData ? !componentBasicData.canCreateTask : true}>
                      {
                        interrogativeWord.map((item) => <Option title={item.name} value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                        )
                      }
                    </Select>}
                </div>
                <FormItem name={item.key} rules={item.rules} normalize={(val) => outgoingControl(item.key, val)
                } validateTrigger={item.key === 'suffix' ? 'onChange' : 'onChange'}>
                  <TextArea rows={15}
                    onBlur={() => textAreaBlur(item.key)}
                    placeholder={item.placeholder}
                    readOnly={item.readOnly}
                    disabled={componentBasicData ? !componentBasicData.canCreateTask : true}
                  />
                </FormItem>
                <div className={styles['words-num']}>已{item.key === 'suffix' || item.key === 'modal' ? '选择' : '输入'}：{wordsNum[item.key]}/{item.max}</div>
                <div className={styles["ai-content-actions"]}>
                  {item.key === 'prefix' && <Button onClick={() => obtainData(item.key)} disabled={componentBasicData ? !componentBasicData.canCreateTask : true}>通用前缀</Button>}
                  {item.key === 'modal' && <Button onClick={() => obtainData(item.key)} disabled={componentBasicData ? !componentBasicData.canCreateTask : true}>通用辅助词</Button>}
                  <Button onClick={() => handleClickClearItem(item.key)} disabled={componentBasicData ? !componentBasicData.canCreateTask : true}>清空</Button>
                </div>
              </Col>
              )
            })
          }
        </Row>
      </Form>
      <Button className={(componentBasicData ? !componentBasicData.canCreateTask : true) ? '' : styles['create-question-btn']} onClick={handleClickValidate} htmlType="submit" disabled={componentBasicData ? !componentBasicData.canCreateTask : true}>生成问答</Button>
    </div>

    <MyModal
      title="确认提交"
      content="提交后不可修改，确认提交吗？"
      type={ModalType.info}
      onCancel={() => setModalVisible(false)}
      onOk={() => submit()}
      footer={<div>
        <Button onClick={() => setModalVisible(false)}>取消</Button>
        <Button type="primary" disabled={upDataLoading} loading={upDataLoading} onClick={() => submit()}>确认</Button>
      </div>}
      visible={modalVisible} />
    {
      /* 当处于创建阶段与等待阶段都有可能出现这个组件 */
      (pageStatus === 'SHOW_CREATE' || pageStatus === 'CREATE_WAITING') && <TipModal showModal={showTipModal} pageStatus={pageStatus} componentBasicData={componentBasicData} closeModal={() => closeTipModal(false)} taskBuildSuccess={taskBuildSuccess} />
    }
  </Spin>
  )
}

export default CreateZhidao
