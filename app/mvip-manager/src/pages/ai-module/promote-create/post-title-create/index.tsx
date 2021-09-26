import React, { FC, useState } from 'react';
import { useHistory } from 'umi'
import { Form, Button, Input, Row, Col, Select, Spin } from 'antd';
import MainTitle from '@/components/main-title';
import styles from './index.less';
import { getCookie, randomList, } from '@/utils';
import { useDebounce } from '@/hooks/debounce';
import { modal, prefix } from '@/constants/ai-module'
import { CollectionTitleApiParams } from '@/interfaces/ai-module'
const FormItem = Form.Item;
const TextArea = Input.TextArea;

interface Rule {
  required: boolean,
  // message: string,
  validator: (rule: any, value: any, callback: (error?: string) => void) => Promise<void | any> | void,
}

interface FormItemListItem {
  key: keyof CollectionTitleApiParams,
  label: string,
  min: number,
  max: number,
  auto?: number
  tip: string,
  rules: Rule[],
  readOnly?: boolean
  placeholder: string,
}


const validateItem: (key: string, min: number, max: number, rule: Rule, value: string) => Promise<any> = (key, min, max, rule, value) => {
  if (key === 'area' || key === 'prefix' || key === 'coreWords' || key === 'modal') {
    const dataList = value && typeof value === 'string' ? value.split('\n').filter((item: string) => item !== '') : []
    if (dataList.length < min) {
      return Promise.reject(new Error(`词语数不得少于${min}个`));
    }
    if (dataList.length > max) {
      return Promise.reject(new Error(`词语数不得多于${max}个`));
    }
  }
  return Promise.resolve()
}

const PostTitleCreate: FC = () => {
  const history = useHistory()
  // @ts-ignore
  // 这里是history.location的类型定义里没有query字段
  const { id } = history.location.query
  const [form] = Form.useForm();

  const [wordsNum, setWordsNum] = useState({
    area: 0,
    prefix: 0,
    coreWords: 0,
    suffix: 0,
    modal: 0,
  })

  const formItemList = [{
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
    label: '后缀',
    key: 'modal',
    placeholder: '请点击按钮获取',
    min: 20,
    max: 20,
    auto: 20,
    tip: '20个',
    rules: [{
      required: true,
      validator: (rule: Rule, value: any) => validateItem('modal', 20, 20, rule, value),
    }],
    readOnly: true
  }]


  const getWordNum = (key: string, value: string) => {
    const words = value.split('\n').filter(item => !!item)
    setWordsNum((wordsNum) => ({
      ...wordsNum,
      [key]: words.length
    }))
  }

  /**
 * 获取通用数据
 *  */
  const obtainData = (key: string) => {
    const value: string | undefined = form.getFieldValue(key)
    const formItem = formItemList.find(item => item.key === key)
    const data = key === 'prefix' ? prefix : modal
    const concatWords: string[] = randomList(data, formItem!.auto || formItem!.max)
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
  const textAreaBlur = useDebounce((key: string) => {
    const value: string | undefined = form.getFieldValue(key)
    form.setFieldsValue({
      [key]: value ? outgoingControl(key, value, 'blur') : ''
    })
    form.validateFields([key])
  }, 200, { leading: false, trailing: true })

  const handleClickClearItem = (key: string) => {
    form.setFieldsValue({
      [key]: ''
    })
  }

  return <>
    <MainTitle title="批量添加标题" showJumpIcon />
    <div className={styles['post-title-create-container']}>
      <ul className={styles["ai-handle-tips"]}>
        <h3>组合规则说明：</h3>
        <li>1.  勾选“标题不含城市”后，标题中不会带有城市</li>
        <li>2.  行政区可以不选择，也可以选择1个或多个</li>
        <li>3.  前置修饰词、主关键词、后置修饰词点击换行（enter）键实现添加，点击文字可以直接修改，点击“X”按钮可以删除</li>
        <li>4.  副标题前会增加逗号“，”，例如以下例句：</li>
      </ul>
      <Form name="create-task-form" form={form}>
        {/* <Row className={styles["group-words-list"]} gutter={24}>
          {
            formItemList.map((item) => {
              return (<Col key={item.key} className={styles["group-words-item"]} flex="20%" >
                <div className={styles['form-item-header']} >
                  {item.label}：<span style={{ color: 'blue' }}>{item.tip}</span>
                </div>
                <FormItem name={item.key} rules={item.rules} normalize={(val) => outgoingControl(item.key, val)
                } validateTrigger={'onChange'}>
                  <TextArea rows={15}
                    onBlur={() => textAreaBlur(item.key)}
                    placeholder={item.placeholder}
                    readOnly={item.readOnly}
                  />
                </FormItem>
                <div className={styles['words-num']}>已输入：{wordsNum[item.key]}/{item.max}</div>
                <div className={styles["ai-content-actions"]}>
                  {item.key === 'prefix' && <Button onClick={() => obtainData(item.key)} >通用前缀</Button>}
                  {item.key === 'modal' && <Button onClick={() => obtainData(item.key)} >通用辅助词</Button>}
                  <Button onClick={() => handleClickClearItem(item.key)} >清空</Button>
                </div>
              </Col>
              )
            })
          }
        </Row> */}
      </Form>
    </div>
  </>
}

export default PostTitleCreate