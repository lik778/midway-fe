import React, { FC, useState } from 'react';
import { useHistory } from 'umi'
import { Form, Button, Input, Row, Col, Select, Spin } from 'antd';
import MainTitle from '@/components/main-title';
import styles from './index.less';
import { getCookie, randomList, } from '@/utils';
import { modal, prefix } from '@/constants/ai-module'
import { CollectionTitleApiParams } from '@/interfaces/ai-module'
import { Rule, FormItemListItem } from './data'
import FormTextarea from './components/form-textarea'
import FormArea from './components/form-area'

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
  const [upDataLoading, setUpdataLoading] = useState<boolean>(false)

  const formItemList: FormItemListItem[] = [{
    label: '前缀',
    key: 'prefix',
    min: 3,
    max: 100,
    auto: 8,
    tip: '3-100个',
    rules: [{
      required: true,
      // message: `请输入前缀！(3-100个)`,
      validator: (rule: Rule, value: any) => validateItem('prefix', 3, 100, rule, value),
    }],
    placeholder: '举例：\n修饰词：\n靠谱的\n附近的\n\n行业细分词：\n公司注册：科技公司、游戏公司',
  }, {
    label: '核心词',
    key: 'main',
    placeholder: '举例：\n冰箱维修\n气动隔膜泵',
    min: 3,
    max: 100,
    tip: '3-100个',
    rules: [{
      required: true,
      // message: `请输入核心词！(3-100个)`,
      validator: (rule: Rule, value: any) => validateItem('coreWords', 3, 100, rule, value),
    }],
  }, {
    label: '后缀',
    key: 'suffix',
    placeholder: '请点击按钮获取',
    min: 6,
    max: 100,
    auto: 20,
    tip: '6-100个',
    rules: [{
      required: true,
      validator: (rule: Rule, value: any) => validateItem('modal', 6, 100, rule, value),
    }],
    readOnly: false
  }]

  const handleClickSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue()
    console.log(values)
    // const requestData: QuestionTaskApiParams = {
    //   area: [],
    //   prefix: [],
    //   coreWords: [],
    //   suffix: [],
    //   modal: []
    // }
    // for (let i in values) {
    //   if (i !== 'suffix') {
    //     requestData[i as keyof QuestionTaskApiParams] = (values[i] as string).split('\n').filter(item => item)
    //   } else {
    //     requestData.suffix = interrogativeWord.filter(item => item.isSelect).reduce((total, item) => {
    //       return total.concat(item.child.map(cItem => `${cItem.id}|||${cItem.content}|||${item.name}`))
    //     }, [] as string[])
    //   }
    // }
    // setUpdataLoading(true)
    // if (!validateUserId()) {
    //   errorMessage('当前用户已更换，在页面刷新后再试！')
    //   setTimeout(() => {
    //     window.location.reload()
    //   }, 1500)
    //   return
    // }
    // const res = await submitCoreWordsApi(requestData)
    // setUpdataLoading(false)
    // if (res.success) {
    //   setModalVisible(false)
    //   initCompoment()
    // } else {
    //   setModalVisible(false)
    //   errorMessage(res.message || '提交失败')
    // }
    // const res = await mockData('data', {})
    // 提交之后 重新请求用户状态
  }

  return <>
    <MainTitle title="批量添加标题" showJumpIcon />
    <div className={styles['post-title-create-container']}>
      <ul className={styles["ai-handle-tips"]}>
        <h3>组合规则说明：</h3>
        <li>1.  勾选“标题不含城市”后，标题中不会带有城市</li>
        <li>2.  行政区可以不选择，也可以选择1个或多个</li>
        <li>3.  前置修饰词、主关键词、后置修饰词点击换行（enter）键实现添加，点击文字可以直接修改。</li>
      </ul>
      <Form name="create-task-form" form={form}>
        <Row className={styles["group-words-list"]} gutter={24}>
          <FormArea form={form} key={'FormArea'}></FormArea>
          {
            formItemList.map((item) => {
              return <FormTextarea item={item} form={form} key={item.key}></FormTextarea>
            })
          }
        </Row>
      </Form>
      <Button className={styles['create-btn']} disabled={upDataLoading} loading={upDataLoading} onClick={handleClickSubmit} >生成问答</Button>
    </div>
  </>
}

export default PostTitleCreate