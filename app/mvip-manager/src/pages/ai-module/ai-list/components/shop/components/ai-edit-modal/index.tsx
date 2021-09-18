import React, { ChangeEvent, useEffect, useState } from 'react';
import { Col, Form, Input, Modal, Row } from 'antd';
import { updateAiTaskApi } from '@/api/ai-module';
import { wordsItemConfig } from '@/constants';
import { AiContentItem } from '@/interfaces/ai-module';
import { AiTaskStatus } from '@/enums/ai-module';
import { errorMessage, successMessage } from '@/components/message';
import styles from './index.less'

interface Props {
  visible: boolean;
  close(): void;
  editItem: AiContentItem | null;
}

const FormItem = Form.Item;
const TextArea = Input.TextArea;

// tips：这个组件要提出去
export default (props: Props) => {
  const [form] = Form.useForm();
  const { visible, close, editItem } = props
  const [isRejectStatus, setIsRejectStatus] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  useEffect(() => {
    if (editItem && visible) {
      setIsRejectStatus(editItem?.status === AiTaskStatus.REJECT);
      form.setFieldsValue(getDefaultValue(editItem))
    }
  }, [editItem, visible])

  const getDefaultValue = (values: any) => {
    const defaultValues: any = {};
    Object.keys(wordsItemConfig).forEach((k: string) => {
      const x = wordsItemConfig[k];
      if (Array.isArray(values[x.name])) {
        defaultValues[x.name] = values[x.name].join('\n')
      }
    })
    return defaultValues
  }

  const onFiledBlur = (name: string) => {
    const values = form.getFieldsValue()
    const fieldValue = values[name]
    if (fieldValue) {
      const formatFieldValue: string = fieldValue.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\n]+/g, '')
      values[name] = formatFieldValue
      form.setFieldsValue(values)
    }
  }

  const wordsChange = (words: string, name: string) => {
    const values = form.getFieldsValue()
    const wordsList = words.split('\n')
    const dedupWordsList = Array.from(new Set(wordsList));
    const maxLength = wordsItemConfig[name].max;
    const data = dedupWordsList.length > maxLength ? dedupWordsList.splice(0, maxLength) : dedupWordsList;
    values[name] = data.join('\n')
    form.setFieldsValue(values)
  }

  const isValidForm = (checkValues: any): boolean => {
    const errorList: string[] = []
    Object.keys(checkValues).forEach(x => {
      const min = wordsItemConfig[x].min
      const max = wordsItemConfig[x].max
      if (checkValues[x].length < min || checkValues[x].length > max) {
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

  const formatFormValues = (values: any) => {
    const ret = Object.assign(values, {})
    Object.keys(ret).forEach(k => {
      ret[k] = ret[k].split('\n')
    })
    return ret
  }

  const submitData = async () => {
    setSubmitLoading(true)
    const values = form.getFieldsValue()
    const ret = formatFormValues(values)
    if (isValidForm(ret)) {
      const params = { id: editItem?.id, ...ret }
      const resData = await updateAiTaskApi(params)
      if (resData.success) {
        successMessage(resData.message)
        setTimeout(() => location.reload(), 500)
      } else {
        errorMessage(resData.message)
      }
    }
    setSubmitLoading(false)
  }

  const createTitle = () => {
    if (isRejectStatus) {
      return <div>修改<span style={{ marginLeft: 6, fontSize: 12, color: '#f1492c' }}>
        驳回原因（{editItem?.memo}）</span></div>
    } else {
      return '查看词组'
    }
  }

  return <Modal
    width={940}
    title={createTitle()}
    className="my-modal-box"
    visible={visible}
    okButtonProps={{ style: { display: isRejectStatus ? '' : 'none' } }}
    cancelButtonProps={{ style: { display: isRejectStatus ? '' : 'none' } }}
    confirmLoading={submitLoading}
    onOk={submitData}
    onCancel={() => { close(); setTimeout(form.resetFields) }}>
    <Form name="edit-job-form" form={form}>
      <Row className={styles["group-words-list"]} gutter={16} style={{ paddingTop: 32 }}>
        {
          Object.keys(wordsItemConfig).map((k) => {
            const x = wordsItemConfig[k];
            return (<Col key={k} className={styles["gutter-row group-words-item"]} span={6}>
              <h4>{x.label}：<span>{x.rules}</span></h4>
              <FormItem name={x.name}>
                <TextArea disabled={!isRejectStatus} rows={15} placeholder={x.placeholder} onBlur={() => onFiledBlur(x.name)}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => wordsChange(e.target.value, x.name)} />
              </FormItem>
            </Col>
            )
          })
        }
      </Row>
    </Form>
  </Modal>
}
