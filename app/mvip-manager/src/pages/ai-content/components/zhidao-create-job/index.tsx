import React, { ChangeEvent, useEffect, useState, useMemo } from 'react';
import { Form, Button, Input, Row, Col, Select, Spin } from 'antd';
import { history } from 'umi'
import styles from './index.less';
import { getCreateQuestionTaskPageStatus, getCreateQuestionTaskBasicData, submitCoreWords } from '@/api/ai-content';
import { QuestionTaskApiParams, InterrogativeChildListItem, InterrogativeListItem, CreateQuestionTaskPageStatus, CreateQuestionTaskBasicData } from '@/interfaces/ai-content'
import { mockData, randomList, translateProductText } from '@/utils';
import { aiDefaultWord } from './data'
import { ActiveKey } from '@/pages/ai-content/ai-zhidao/index'
import { errorMessage, successMessage } from '@/components/message';
import MyModal, { ModalType } from '@/components/modal';
import TipModal from './components/tip-modal'
import pages from '@/pages';
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
  tip: string,
  rules: Rule[],
  placeholder: string,
}


const validateItem: (key: string, min: number, max: number, rule: Rule, value: string | InterrogativeListItem[]) => Promise<any> = (key, min, max, rule, value) => {
  if (key === 'area' || key === 'prefix' || key === 'coreWords') {
    const dataList = value && typeof value === 'string' ? value.split('\n').filter((item: string) => item !== '') : []
    if (dataList.length < min) {
      return Promise.reject(new Error(`单词数不得少于${min}个`));
    }
    if (dataList.length > max) {
      return Promise.reject(new Error(`单词数不得多于${max}个`));
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

interface ZhidaoCreateJobProp {
  activeKey: ActiveKey,
  changeActiveKey(activeKey: ActiveKey): void
}

export default (props: ZhidaoCreateJobProp) => {
  const { activeKey, changeActiveKey } = props
  const [form] = Form.useForm();

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
    max: 20,
    tip: '7-20个',
    rules: [{
      required: true,
      // message: `请输入地区！(7-20个)`,
      validator: (rule: Rule, value: any) => validateItem('area', 7, 20, rule, value),
    }],
    placeholder: '举例：\n浦东新区\n东方明珠\n南京西路',
  }, {
    label: '前缀',
    key: 'prefix',
    min: 7,
    max: 20,
    tip: '7-20个',
    rules: [{
      required: true,
      // message: `请输入前缀！(7-20个)`,
      validator: (rule: Rule, value: any) => validateItem('prefix', 7, 20, rule, value),
    }],
    placeholder: '举例：\n修饰词：\n靠谱的\n附近的\n\n行业细分词：\n公司注册：科技公司、游戏公司',
  }, {
    label: '核心词',
    key: 'coreWords',
    placeholder: '举例：\n冰箱维修\n气动隔膜泵',
    min: 7,
    max: 20,
    tip: '7-20个',
    rules: [{
      required: true,
      // message: `请输入核心词！(7-20个)`,
      validator: (rule: Rule, value: any) => validateItem('coreWords', 7, 20, rule, value),
    }],
  }, {
    label: '疑问词',
    key: 'suffix',
    placeholder: '',
    min: 30,
    max: 50,
    tip: '3-5个类型',
    rules: [{
      required: true,
      // message: `请选择地区！(3-5个类型)`,
      validator: (rule: Rule, value: any) => validateItem('suffix', 3, 5, rule, interrogativeWord),
    }],
  }, {
    label: '辅助词',
    key: 'modal',
    placeholder: '举例：\n在线等！\n有大佬知道的吗？\n求高手帮助',
    min: 3,
    max: 10,
    tip: '',
    rules: [],
  }], [interrogativeWord])

  /** 当页面处于进行中状态时 需要禁止操作 */
  const [pageStatus, setPageStatus] = useState<CreateQuestionTaskPageStatus | null>(null)
  const [upDataLoading, setUpdataLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  const [showTipModal, setShowTipModal] = useState<boolean>(false)

  useEffect(() => {
    if (pageStatus && componentBasicData) {
      // 只有正常的时候才不用显示弹窗
      setShowTipModal(!(pageStatus === 'create' && componentBasicData.canCreateTask && componentBasicData.nextAction === 'SHOW_CREATE'))
    } else {
      setShowTipModal(false)
    }
  }, [pageStatus, componentBasicData])


  const closeTipModal = (showModal: false) => {
    if (componentBasicData && !componentBasicData.forceNotice) {
      setShowTipModal(showModal)
    }
  }

  /** 获取页面状态  如果能创建任务 则请求接下来的基础数据 */
  const getComponentStatus = async () => {
    // TODO;
    // const res = await getCreateQuestionTaskPageStatus()
    const res = await mockData<CreateQuestionTaskPageStatus>('data', 'loading')
    if (res.success) {
      setPageStatus(res.data)
    } else {
      console.log(res)
    }
    return res.data
  }

  const mockInterrogativeWord = (): InterrogativeListItem[] => {
    const childList: InterrogativeChildListItem[] = []
    let i = 0
    while (i < 10) {
      childList.push({
        id: i,
        content: `关键字${i}`
      })
      i++
    }
    return ['品牌宣传', '价格决策', '品质决策', '联系方式', '注意事项'].map((item, index) => ({
      id: index + 1,
      name: item,
      child: childList.map(cItem => ({
        id: index * 10 + cItem.id,
        content: `${item}-${cItem.content}`
      }))
    }))
  }

  const getCreateQuestionTaskBasicDataFn = async () => {
    // TODO;
    // const res = await getCreateQuestionTaskBasicData()
    const res = await mockData<CreateQuestionTaskBasicData>('data', {
      canCreateTask: false,
      forceNotice: true,
      nextAction: 'CREATE_WAITING',
      notice: '测试文本',
      suggestSuffix: mockInterrogativeWord()
    })
    if (res.success) {
      setComponentBasicData(res.data)
      if (res.data.suggestSuffix.length !== interrogativeWord.length) {
        setInterrogativeWord(res.data.suggestSuffix)
      }
    } else {
      console.log(res)
    }
  }

  /** 初始化组件 
   * @description 先判断是否要跳页再请求具体参数
  */
  const initCompoment = async () => {
    setGetDataLoading(true)
    const pageStatus = await getComponentStatus()
    if (pageStatus === 'showQuestionList') {
      history.push(`/ai-content/edit/ai-zhidao-detail?pageType=edit`)
    } else {
      await getCreateQuestionTaskBasicDataFn()
    }
    setGetDataLoading(false)
  }

  // 切换tab不会重新渲染页面 需要手动监听 刷新页面
  useEffect(() => {
    if (activeKey === 'create-job') {
      initCompoment()
    } else {
      setPageStatus(null)
      setComponentBasicData(null)
    }
  }, [activeKey])

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
    form.setFieldsValue({
      suffix: newInterrogativeWord.reduce((total, item, index) => {
        if (item.isSelect) {
          return `${total}${item.child.map(item => item.content).join('\n')}${item.child && item.child.length > 1 ? '\n' : ''}`
        } else {
          return total
        }
      }, '')
    })
    // form.setFieldsValue不会触发数据校验，需要手动触发一次
    form.validateFields(['suffix'])
  }

  /** 
   * 去除特殊字符 
   * @description 注意replace里要把单引号排除，因为中文输入时，输入未结束拼音是以单引号分割的
   * */
  const clearSpecialCharacter = (value: string) => {
    return value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\n\']+/g, '')
  }

  /**
   * 获取通用数据
   *  */
  const obtainData = (key: string, name: string, type?: string) => {
    const formItem = formItemList.find(item => item.key === key)
    const dataName = type ? `${name}-${type}` : name
    const concatWords: string[] = randomList(aiDefaultWord[dataName], formItem!.max)
    form.setFieldsValue({
      [key]: concatWords.join('\n')
    })
  }

  const handleClickClearItem = (key: string) => {
    form.setFieldsValue({
      [key]: ''
    })
  }

  const handleClickValidate = async () => {
    try {
      await form.validateFields();
      setModalVisible(true)
    } catch (e) {
      console.log(e)
    }
  }

  const submit = async () => {
    const values = form.getFieldsValue()
    console.log(values)
    const requestData: QuestionTaskApiParams = {
      area: [],
      prefix: [],
      coreWords: [],
      suffix: [],
      modal: []
    }
    for (let i in values) {
      if (i !== 'suffix') {
        requestData[i as keyof QuestionTaskApiParams] = (values[i] as string).split('\n').filter((item: string) => item !== '')
      } else {
        requestData.suffix = interrogativeWord.filter(item => item.isSelect).reduce((total, item) => {
          return total.concat(item.child.map(cItem => `${cItem.id}|||${cItem.content}|||${item.name}`))
        }, [] as string[])
      }
    }
    console.log(requestData)
    setUpdataLoading(true)
    // TODO;
    // const res = await submitCoreWords(requestData)
    const res = await mockData('data', {})
    // 提交之后 重新请求用户状态
    setUpdataLoading(false)
    setModalVisible(false)
    initCompoment()
  }

  return (<Spin spinning={getDataLoading}>
    <div className={styles["ai-create-task-box"]} onClick={() => closeTipModal(false)}>
      <ul className={styles["ai-handle-tips"]}>
        <h3>组合规则说明：</h3>
        <li>1、请填写<span className={styles['tip']}>「地区+前缀+核心词+疑问词+辅助词」</span>，该信息将用于生成文章及站点SEO元素</li>
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
                      // allowClear={true}
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
                <FormItem name={item.key} style={{ marginBottom: 18 }} rules={item.rules} normalize={clearSpecialCharacter} validateTrigger={item.key === 'suffix' ? 'onChange' : 'onChange'}>
                  <TextArea rows={15}
                    placeholder={item.placeholder}
                    readOnly={item.key === 'suffix'}
                    disabled={componentBasicData ? !componentBasicData.canCreateTask : true}
                  />
                </FormItem>
                <div className={styles["ai-content-actions"]}>
                  {item.key === 'prefix' && <Button onClick={() => obtainData(item.key, 'wordB')} disabled={componentBasicData ? !componentBasicData.canCreateTask : true}>通用前缀</Button>}
                  {item.key === 'modal' && <Button onClick={() => obtainData(item.key, 'wordE')} disabled={componentBasicData ? !componentBasicData.canCreateTask : true}>通用辅助词</Button>}
                  <Button onClick={() => handleClickClearItem(item.key)} disabled={componentBasicData ? !componentBasicData.canCreateTask : true}>清空</Button>
                </div>
              </Col>
              )
            })
          }
        </Row>
      </Form>
      <Button className={styles['create-question-btn']} onClick={handleClickValidate} htmlType="submit" disabled={componentBasicData ? !componentBasicData.canCreateTask : true}>生成问题</Button>
    </div>

    <MyModal
      title="确认提交"
      content="提交后不可修改，确认提交吗？"
      type={ModalType.info}
      onCancel={() => setModalVisible(false)}
      onOk={() => history.push('/company-info/base')}
      footer={<div>
        <Button onClick={() => setModalVisible(false)}>取消</Button>
        <Button type="primary" disabled={upDataLoading} loading={upDataLoading} onClick={() => submit()}>确认</Button>
      </div>}
      visible={modalVisible} />
    {
      /* 当处于创建阶段与等待阶段都有可能出现这个组件 */
      (pageStatus === 'create' || pageStatus === 'loading') && componentBasicData && <TipModal showModal={showTipModal} pageStatus={pageStatus} componentBasicData={componentBasicData} changeActiveKey={changeActiveKey} closeModal={() => closeTipModal(false)} />
    }
  </Spin>
  )
}
