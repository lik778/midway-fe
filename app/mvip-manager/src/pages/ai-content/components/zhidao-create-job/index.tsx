import React, { ChangeEvent, useState } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'antd';
import { history } from 'umi'
import './index.less';
import { createAizhidaoApi } from '@/api/ai-content';
import { randomList, translateProductText } from '@/utils';
import { aiDefaultWord } from './data'
import { errorMessage, successMessage } from '@/components/message';
import MyModal, { ModalType } from '@/components/modal';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const { Option } = Select;

const QAwordsItemConfig : any = {
  wordA: {
    label: '地区',
    name: 'wordA',
    placeholder: '举例：\n浦东新区\n东方明珠\n南京西路',
    min: 7,
    max: 20,
    rules: '7-20个'
  },
  wordB: {
    label: '前缀',
    name: 'wordB',
    placeholder: '举例：\n修饰词：\n靠谱的\n附近的\n\n行业细分词：\n公司注册：科技公司、游戏公司',
    min: 7,
    max: 20,
    rules: '7-20个'
  },
  wordC: {
    label: '核心词',
    name: 'wordC',
    placeholder: '举例：\n冰箱维修\n气动隔膜泵',
    min: 7,
    max: 20,
    rules: '7-20个'
  },
  wordD: {
    label: '疑问词',
    name: 'wordD',
    placeholder: '',
    min: 30,
    max: 50,
    rules: '3-5个类型'
  },
  wordE: {
    label: '辅助词',
    name: 'wordE',
    placeholder: '举例：\n在线等！\n有大佬知道的吗？\n求高手帮助',
    min: 3,
    max: 10,
    rules: ''
  }
}

const wordDitems : any = {
  brandPublicity: {
    id:1,
    name: '品牌宣传',
    value: 'brandPublicity',
    child: [
      {
        id:1,
        name :'1词语a'
      },
      {
        id:2,
        name:'1词语b'
      },
      {
        id:3,
        name:'1词语c'
      },
      {
        id:4,
        name:'1词语d'
      },
      {
        id:5,
        name:'1词语e'
      },
      {
        id:6,
        name :'1词语a'
      },
      {
        id:7,
        name:'1词语b'
      },
      {
        id:8,
        name:'1词语c'
      },
      {
        id:9,
        name:'1词语d'
      },
      {
        id:10,
        name:'1词语e'
      },
    ],
  },
  priceDecision: {
    id:2,
    name: '价格决策',
    value: 'priceDecision',
    child: [
      {
        id:1,
        name:'2词语a'
      },
      {
        id:2,
        name:'2词语b'
      },
      {
        id:3,
        name:'2词语c'
      },
      {
        id:4,
        name:'2词语d'
      },
      {
        id:5,
        name:'2词语e'
      },
      {
        id:6,
        name:'2词语a'
      },
      {
        id:7,
        name:'2词语b'
      },
      {
        id:8,
        name:'2词语c'
      },
      {
        id:9,
        name:'2词语d'
      },
      {
        id:10,
        name:'2词语e'
      },
    ],
  },
  qualityDecision: {
    name: '品质决策',
    value: 'qualityDecision',
    child: [
      {
        id:1,
        name:'3词语a'
      },
      {
        id:2,
        name:'3词语b'
      },
      {
        id:3,
        name:'3词语c'
      },
      {
        id:4,
        name:'3词语d'
      },
      {
        id:5,
        name:'3词语e'
      },
      {
        id:6,
        name:'3词语a'
      },
      {
        id:7,
        name:'3词语b'
      },
      {
        id:8,
        name:'3词语c'
      },
      {
        id:9,
        name:'3词语d'
      },
      {
        id:10,
        name:'3词语e'
      }
    ],
  },
  contactWay: {
    name: '联系方式',
    value: 'contactWay',
    child: [
      {
        id:1,
        name:'4词语a'
      },
      {
        id:2,
        name:'4词语b'
      },
      {
        id:3,
        name:'4词语c'
      },
      {
        id:4,
        name:'4词语d'
      },
      {
        id:5,
        name:'4词语e'
      },
      {
        id:6,
        name:'4词语a'
      },
      {
        id:7,
        name:'4词语b'
      },
      {
        id:8,
        name:'4词语c'
      },
      {
        id:9,
        name:'4词语d'
      },
      {
        id:10,
        name:'4词语e'
      }
    ],
  },
  attention: {
    name: '注意事项',
    value: 'attention',
    child: [
      {
        id:1,
        name:'5词语a'
      },
      {
        id:2,
        name:'5词语b'
      },
      {
        id:3,
        name:'5词语c'
      },
      {
        id:4,
        name:'5词语d'
      },
      {
        id:5,
        name:'5词语e'
      },
      {
        id:6,
        name:'5词语a'
      },
      {
        id:7,
        name:'5词语b'
      },
      {
        id:8,
        name:'5词语c'
      },
      {
        id:9,
        name:'5词语d'
      },
      {
        id:10,
        name:'5词语e'
      }
    ],
  }
}

export default (props: any) => {
  const [form] = Form.useForm();
  const defaultCounters: any = {};
  Object.keys(QAwordsItemConfig).forEach((k: string) => defaultCounters[k] = 0)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [counters, setCounters] = useState<any>(defaultCounters)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  // 问答信息
  const { shopStatus } = props
  const wordsChange = (words: string, name: string) => {
    const values = form.getFieldsValue()
    const wordsList = words.split('\n')
    const dedupWordsList =  Array.from(new Set(wordsList));
    const maxLength = QAwordsItemConfig[name].max;
    const data = dedupWordsList.length > maxLength ? dedupWordsList.splice(0, maxLength) : dedupWordsList;
    values[name] = data.join('\n')
    form.setFieldsValue(values)
    counters[name] = data.filter(x => x !== '').length;
    setCounters({ ...counters })
  }

  // 去除特殊字符
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

  // 清空
  const clearAll = (name: string) => {
    const values = form.getFieldsValue()
    values[name] = ''
    counters[name] = 0
    if(name === 'wordD'){
      form.resetFields
    }
    form.setFieldsValue(values);
    setCounters({ ...counters })
  }

  // 获取通用数据
  const obtainData = (name: string, type?: string) => {
    const maxLength = QAwordsItemConfig[name].max;
    const formValues = form.getFieldsValue()
    const dataName = type ? `${name}-${type}` : name
    const concatWords: string[] = randomList(aiDefaultWord[dataName], maxLength)
    formValues[name] = concatWords.join('\n')
    counters[name] = concatWords.length
    setCounters({ ...counters})
    form.setFieldsValue(formValues)
  }

  // 选中添加疑问词
  const selectitem = (Dname: string, type?: string) => {
    const formValues = form.getFieldsValue()
    const dataName = type ? `${Dname}-${type}` : Dname
    const children: string[] = wordDitems[dataName].child
    let concatWords : string[] = []
    children.forEach((element) => {
      concatWords.push(element.name);
    })
    const CW = concatWords.join('\n');
    formValues['wordD'] ? ( formValues['wordD'] = formValues['wordD'] + '\n' + CW ) : ( formValues['wordD'] = CW )
    counters['wordD'] = formValues['wordD'].split('\n').length
    setCounters({ ...counters})
    form.setFieldsValue(formValues)
  }

  // 取消选择疑问词
  const deleteSelectitem = (Dname: string, type?: string) => {
    const formValues = form.getFieldsValue()
    const dataName = type ? `${Dname}-${type}` : Dname
    const children: string[] = wordDitems[dataName].child
    const cancelWords : string = children[0].name
    const cancelnum : number = 10
    const WordD : string[] = formValues['wordD'].split('\n');
    const cancelindex = WordD.indexOf(cancelWords);
    WordD.splice(cancelindex, cancelnum);
    formValues['wordD'] = WordD.join('\n')
    counters['wordD'] = formValues['wordD'].split('\n').length
    setCounters({ ...counters})
    form.setFieldsValue(formValues)
  }

  // 验证数量格式
  const isValidForm =(): boolean => {
    const errorList: string[] = []
    Object.keys(counters).forEach(x => {
      const min = QAwordsItemConfig[x].min
      const max = QAwordsItemConfig[x].max
      if ((counters[x] < min || counters[x] > max) && x !== 'wordD') {
        errorList.push(`${QAwordsItemConfig[x].label}最少${min}个词，最多${max}个词。`)
      }
      if ((counters[x] < min || counters[x] > max) && x === 'wordD') {
        errorList.push(`${QAwordsItemConfig[x].label}最少3个类型，最多5个类型。`)
      }
    })
    if (errorList.length > 0) {
      errorMessage(`提交失败：${errorList.join('\n')}`)
      return false
    } else {
      return true
    }
  }

  // 提交数据
  const submitData = async () => {
    if (isValidForm()) {
      const values = form.getFieldsValue()
      const groupNames = Object.keys(QAwordsItemConfig).map((x: string) => x)
      Object.keys(values).forEach((k: string) => {
        if (groupNames.includes(k)) {
          values[k] = (values[k] && values[k].split('\n')) || []
        }
      })
      console.log(values);

      // setSubmitLoading(true)
      // const res = await createAizhidaoApi(values)
      // setSubmitLoading(false)
      // if (res.success) {
      //   successMessage('添加成功')
      //   history.push(`/ai-content/job-list`);
      // } else {
      //   errorMessage(res.message)
      // }
    }
  }


  return (<div>
    <div className="ai-create-task-box">
        <div>
          <ul className="ai-handle-tips">
            <h3>组合规则说明：</h3>
            <li>1、请填写<span style={{color:'orange'}}>「地区+前缀+核心词+疑问词+辅助词」</span>，该信息将用于生成文章及站点SEO元素</li>
            <li>2、每个词语之间请换行</li>
            <li>3、避免填写标点符号、错别字、以及有违规风险的词</li>
            <li>4、提交并通过审核后，不可修改</li>
          </ul>
          <div className="ai-create-box">
            <Form name="create-task-form" form={form} onFinish={submitData}>
              <Row className="group-words-list" gutter={24} style={{ paddingTop: 10 , marginLeft:-6, marginRight:-6 }}>
                {
                  Object.keys(QAwordsItemConfig).map((k) => {
                    const x = QAwordsItemConfig[k];
                    return (<Col key={k} className="gutter-row group-words-item" flex="20%"  style={{padding:'6px'}}>
                        <h4 style={{marginBottom:'8px', height:'32px', lineHeight:'32px'}}>
                          {x.label}：<span style={{color:'blue'}}>{x.rules}</span>
                          { x.name === 'wordD' &&
                          <Select mode="multiple"  className="suffix-container-dropdown"
                            showArrow={true} maxTagCount={'responsive'}
                            // allowClear={true}
                            onSelect={(value:string) => selectitem(value)}
                            onDeselect={(value:string) => deleteSelectitem(value)} >
                            { Object.keys(wordDitems).map((data)=>{
                              const dd = wordDitems[data];
                              return <Option value={dd.value} key={dd.value}>{dd.name}</Option>
                              })
                            }
                          </Select>}
                        </h4>
                        <FormItem name={x.name} style={{marginBottom:18}}>
                          { x.name === 'wordD' ?
                            <TextArea rows={15}
                              placeholder={x.placeholder}
                              onBlur={() => onFiledBlur(x.name)}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => wordsChange(e.target.value, x.name)}
                              readOnly /> :
                              <TextArea rows={15}
                              placeholder={x.placeholder}
                              onBlur={() => onFiledBlur(x.name)}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => wordsChange(e.target.value, x.name)}
                               />
                          }
                        </FormItem>
                        <div className="ai-content-actions">
                          { x.name === 'wordB' && <Button onClick={() => obtainData(x.name)}>通用前缀</Button> }
                          { x.name === 'wordE' && <Button onClick={() => obtainData(x.name)}>通用辅助词</Button> }
                          <Button onClick={() => clearAll(x.name)}>清空</Button>
                        </div>
                      </Col>
                    )
                  })
                }
              </Row>
            </Form>
            <Button style={{ width: 120, height: 40, background: '#096DD9', borderColor: '#096DD9', position: 'relative' , top:'30px'  }} type="primary" onClick={() => setModalVisible(true)} htmlType="submit">生成问题</Button>
          </div>
          <MyModal
            title="确认提交"
            content="提交后不可修改，确认提交吗？"
            type={ModalType.info}
            onCancel={() => setModalVisible(false)}
            onOk={() => history.push('/company-info/base')}
            footer={<div>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" loading={submitLoading} onClick={() =>submitData()}>确认</Button>
            </div>}
            visible={modalVisible} />
        </div>

    </div>
  </div>)
}
