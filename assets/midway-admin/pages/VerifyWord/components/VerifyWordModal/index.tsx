import * as React from 'react';
import { message, Form, Input, Button, Collapse, Modal } from 'antd';
import './index.styl';
import { AiTaskStatus, VerifyAction } from '../../../../enums/verify';
import { VerifyWordItem } from '../../../../interfaces/verify';
import { verifyWordApi } from '../../../../api/verify';
import { useState } from 'react';

const { Panel } = Collapse;
const TextArea = Input.TextArea;
const FormItem = Form.Item;
interface Props {
  visible: boolean;
  editItem: VerifyWordItem;
  close(taskId?: number);
}

export const VerifyWordModal =  (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm();
  const { visible, close, editItem } = props
  const wordNames = [
      { label: '区域', name: 'wordA' },
      { label: '前缀', name: 'wordB' },
      { label: '核心词', name: 'wordC' },
      { label: '后缀', name: 'wordD' }]

  const verifiyAction = async (action: VerifyAction) => {
    if (action === VerifyAction.RESOVE) {
        // to api 审核
        setLoading(true)
        await verifyWordApi({ id: editItem.taskId, approve: true })
        setLoading(false)
        message.success('操作成功')
        setTimeout(close(editItem.taskId))
    } else if (action === VerifyAction.REJECTED) {
        // 出现一个弹框
        createRejectModal()
    }
  }

  const createRejectModal = () => {
    Modal.info({
      title: '审核失败原因',
      closable: true,
      centered:  true,
      icon: null,
      okText: '确定',
      okType: 'primary',
      content:
        <Form form={form}>
          <FormItem name="memo">
              <TextArea showCount placeholder="请输入审核失败原因" rows={6} maxLength={100}/>
          </FormItem>
        </Form>,
      onOk: async () => {
        // 去打接口
        const formData = form.getFieldsValue()
        if (!formData.memo) {
          message.warn('请填写审核失败原因')
        } else {
          await verifyWordApi({ id: editItem.taskId, approve: false, ...formData })
          form.resetFields()
          message.success('操作成功')
          setTimeout(close(editItem.taskId))
          return;
        }
      }
    })
  }
  return <Modal
    title={<div>详情<span style={{ fontSize: 12, color: 'red' }}>
      { [AiTaskStatus.REJECT, AiTaskStatus.DEFAULT].includes(editItem.status) && editItem.memo ?
        `（${editItem.status === AiTaskStatus.DEFAULT ? '上一次' : ''}
        审核失败原因：${editItem.memo}）` : '' }</span></div>}
    visible={visible}
    width={800}
    maskClosable={false}
    footer={null}
    onCancel={() => close()}
    closable={true}>
    <div className="verify-word-modal">
      <Collapse className="list" defaultActiveKey={[0, 1, 2, 3]}>
      { wordNames.map((w, i) => {
        return (
          <Panel header={w.label} key={i} >
            <div>{ editItem[w.name].join('，') }</div>
          </Panel>) })
      }
      </Collapse>
      { editItem.status === AiTaskStatus.DEFAULT && <div className="action">
          <Button type="primary" loading={loading} onClick={() => verifiyAction(VerifyAction.RESOVE)}>审核通过</Button>
          <Button type="primary" danger onClick={() => verifiyAction(VerifyAction.REJECTED)}>审核驳回</Button>
      </div> }
    </div>
  </Modal>
}
