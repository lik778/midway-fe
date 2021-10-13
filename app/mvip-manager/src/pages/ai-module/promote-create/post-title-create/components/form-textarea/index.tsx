import React, { FC, useState, forwardRef, useImperativeHandle, Ref } from 'react';
import { Form, Button, Input, Col, FormInstance } from 'antd';
import styles from './index.less';
import { CollectionTitleApiParams } from '@/interfaces/ai-module'
import { prefix, productSuffix, serviceSuffix } from '@/constants/ai-module'
import { getCookie, randomList, } from '@/utils';
import { Rule, FormItemListItem } from '../../data'
import { useDebounce } from '@/hooks/debounce';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const ButtonGroup = Button.Group

interface Props {
  item: FormItemListItem,
  form: FormInstance
}

const FormTextarea = (props: Props, parentRef: Ref<any>) => {
  const { item, form } = props
  const [wordNum, setWordNum] = useState<number>(0)

  useImperativeHandle(parentRef, () => ({
    setWordNum
  }))

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

  const getWordNum = (key: string, value: string) => {
    const words = value.split('\n').filter(item => !!item)
    setWordNum(words.length)
  }

  /**
* 获取通用数据
*  */
  const obtainData = (key: keyof CollectionTitleApiParams, data: string[]) => {
    const value: string | undefined = form.getFieldValue(key)
    const concatWords: string[] = randomList(data, item.auto || item.max)
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


  return <Col key={item.key} className={styles["group-words-item"]} flex="20%" >
    <div className={styles['form-item-header']} >
      {item.label}：<span style={{ color: 'blue' }}>{item.tip}</span>
    </div>
    <FormItem name={item.key} rules={item.rules} normalize={(val) => outgoingControl(item.key, val)
    } validateTrigger={'onChange'}>
      <TextArea className={styles['textarea']} rows={15}
        onBlur={() => textAreaBlur(item.key)}
        placeholder={item.placeholder}
        readOnly={item.readOnly}
      />
    </FormItem>
    <div className={styles['words-num']}>已输入：{wordNum}/{item.max}</div>
    <div className={styles["ai-content-actions"]}>
      <ButtonGroup>
        {item.key === 'prefix' && <Button onClick={() => obtainData(item.key, prefix)} >通用前缀</Button>}
        {item.key === 'suffix' && <> <Button onClick={() => obtainData(item.key, productSuffix)} >产品后缀</Button><Button onClick={() => obtainData(item.key, serviceSuffix)} >服务后缀</Button></>}
        <Button onClick={() => handleClickClearItem(item.key)} >清空</Button>
      </ButtonGroup>
    </div>
  </Col>
}

export default forwardRef(FormTextarea)