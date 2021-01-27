import * as React from 'react';
import { message, Input, Button, Collapse, Modal } from 'antd';
import './index.styl';
import { VerifyAction } from '../../enums/verify';

const { Panel } = Collapse;
const TextArea = Input.TextArea;

interface Props {
  visible: boolean;
  close();
}

export const VerifyWordModal =  (props: Props) => {
  const { visible, close } = props
  const wordName = ['区域', '前缀', '核心词', '后缀']

  const verifiyAction = (action: VerifyAction) => {
    if (action === VerifyAction.RESOVE) {
        // to api 审核
        message.success('审核通过')
        close()
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
      content: <TextArea placeholder="请输入审核失败原因" rows={6} showCount/>,
      onOk: () => {
        // 去打接口
        console.log('审核失败')
        close()
        return Promise.resolve()
      }
    })
  }

  return <Modal
    title="审核词"
    visible={visible}
    width={800}
    maskClosable={false}
    footer={null}
    onCancel={close}
    closable={true}>
    <div className="verify-word-modal">
      <Collapse className="list" defaultActiveKey={[0, 1, 2, 3]}>
      { wordName.map((name, i) => {
        return (
          <Panel header={name} key={i} >
            <div>词组1，词组2</div>
          </Panel>) })
      }
      </Collapse>
      <div className="action">
        <Button type="primary" onClick={() => verifiyAction(VerifyAction.RESOVE)}>审核通过</Button>
        <Button type="primary" danger onClick={() => verifiyAction(VerifyAction.REJECTED)}>审核驳回</Button>
      </div>
    </div>
  </Modal>
}
