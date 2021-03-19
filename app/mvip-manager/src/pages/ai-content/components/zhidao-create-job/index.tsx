import React, { ChangeEvent, useState, useEffect } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'antd';
import { history } from 'umi'
import './index.less';
import { createAizhidaoApi } from '@/api/ai-content';
import { randomList } from '@/utils';
import { aiDefaultWord } from './data'
import { errorMessage, successMessage } from '@/components/message';
import MyModal, { ModalType } from '@/components/modal';
import { UserInfo } from '@/interfaces/user';
import { getUserBaseInfoApi } from '@/api/user'


const FormItem = Form.Item;
const TextArea = Input.TextArea;
const { Option } = Select;
const { QAwordsItemConfig, suffixitems  } = aiDefaultWord

export default (props: any) => {
  const [form] = Form.useForm();
  const defaultCounters: any = {};
  Object.keys(QAwordsItemConfig).forEach((k: string) => defaultCounters[k] = 0)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [counters, setCounters] = useState<any>(defaultCounters)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo | any>({})
  const [selectItems,setselectItems] = useState<string[]>([])

  useEffect(() => {
    (async () => {
      const res = await getUserBaseInfoApi();
      if (res?.success) {
        setUserInfo({...res.data})
      }
    })();
  }, [])

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
    form.setFieldsValue(values);
    setCounters({ ...counters })
    setselectItems([])
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
  const selectItem = (Dname: string, type?: string) => {
    setselectItems([...selectItems,Dname])
    const formValues = form.getFieldsValue()
    const dataName = type ? `${Dname}-${type}` : Dname
    const children: string[] = suffixitems[dataName].child
    let concatWords : string[] = []
    children.forEach((element) => {
      concatWords.push(element.name);
    }) 
    const CW = concatWords.join('\n');
    formValues['suffix'] ? ( formValues['suffix'] = formValues['suffix'] + '\n' + CW ) : ( formValues['suffix'] = CW )
    counters['suffix'] = formValues['suffix'].split('\n').length
    setCounters({ ...counters})
    form.setFieldsValue(formValues)
  }

  // 取消选择疑问词
  const deleteSelectItem = (Dname: string, type?: string) => {
    setselectItems(selectItems.filter(item=>item!==Dname))
    const formValues = form.getFieldsValue()
    const dataName = type ? `${Dname}-${type}` : Dname
    const children: string[] = suffixitems[dataName].child
    const cancelWords : string = children[0].name
    const cancelnum : number = 10
    const suffix : string[] = formValues['suffix'].split('\n');
    const cancelindex = suffix.indexOf(cancelWords);
    suffix.splice(cancelindex, cancelnum);
    formValues['suffix'] = suffix.join('\n')
    counters['suffix'] = formValues['suffix'].split('\n').length
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
      values['uid'] = userInfo.userId
      const groupNames = Object.keys(QAwordsItemConfig).map((x: string) => x)
      Object.keys(values).forEach((k: string) => {
        if (groupNames.includes(k)) {
          values[k] = (values[k] && values[k].split('\n')) || []
        }
        if ( k === "suffix" ){
          let wordSuffix : string[] = [];
          const splitSuffix = values[k];
          Object.keys(suffixitems).forEach((k) => {
            const s = suffixitems[k];
            const child = s.child
            const suffixname = s.name
            if (splitSuffix.indexOf(child[0].name) !== -1 ){
              child.forEach( ( e: any ) => {
                const word = e.id + "|||" + e.name + "|||" + suffixname;
                wordSuffix.push(word);
              });
            }
          })
          values[k].splice(0,values[k].length)
          wordSuffix.forEach((e:string) => {
            values[k].push(e)
          });
        }
      })
      setSubmitLoading(true)
      const res = await createAizhidaoApi(values)
      setSubmitLoading(false)
      if (res.success) {
        successMessage('添加成功')
        history.push(`/ai-content/zhidao-job-list`);
      } else {
        errorMessage(res.message)
      }
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
                          { x.name === 'suffix' && 
                          <Select mode="multiple"  className="wordD-container-dropdown"
                            showArrow={true} maxTagCount={'responsive'} placeholder={'请选择'}
                            // allowClear={true}
                            value={selectItems}
                            onSelect={(value:string) => selectItem(value)}
                            onDeselect={(value:string) => deleteSelectItem(value)}
                            filterOption={(input, option) =>
                              option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            >
                            { Object.keys(suffixitems).map((data)=>{
                              const dd = suffixitems[data];
                              return <Option value={dd.value} key={dd.value}>{dd.name}</Option>
                              })
                            }
                          </Select>}
                        </h4>
                        <FormItem name={x.name} style={{marginBottom:18}}>
                          { x.name === 'suffix' ?
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
                          { x.name === 'prefix' && <Button onClick={() => obtainData(x.name)}>通用前缀</Button> }
                          { x.name === 'modal' && <Button onClick={() => obtainData(x.name)}>通用辅助词</Button> }
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
