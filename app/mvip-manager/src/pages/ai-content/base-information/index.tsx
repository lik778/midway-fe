import React, {useState} from 'react';
import { Input , Form , Col , Row  , Button} from 'antd';
import MainTitle from '@/components/main-title';
import './index.less';
import MyModal, { ModalType } from '@/components/modal';

export default (props: any) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const FormItem = Form.Item;
  const TextArea = Input.TextArea;

  const contentName: any = {
    wordA: {
      label: '公司优势',
      name: 'Advantage',
    },
    wordB: {
      label: '公司好评',
      name: 'Praise',
    },
    wordC: {
      label: '公司服务承诺',
      name: 'ServicePromise',
    },
    wordD: {
      label: '公司服务产品',
      name: 'ServiceProduct',
    },
    wordE: {
      label: '行业小知识',
      name: 'Industry knowledge',
      ps:'（回答通用素材库）',
    }
  }

  const printdata = () => {
    const values = form.getFieldsValue()
    const groupNames = Object.keys(contentName).map((x: string) => x)
      Object.keys(values).forEach((k: string) => {
        if (groupNames.includes(k)) {
          values[k] = (values[k] && values[k].split('\n')) || []
        }
      })
      console.log(values);
      setModalVisible(false);
  }
  return (
    <div>
      <MainTitle title="基础信息素材"/>
      <div className="ai-list-container" style={{padding:'40px 10px'}}>
          <div className="ai-create-information-box">
            <Form name="base-information-box" form={form} onFinish={printdata}>
              <Col className="content-list" span={20}>
                {
                  Object.keys(contentName).map((k) => {
                    const x = contentName[k];
                    return (<Row key={k} className="gutter-row" gutter={40} justify="start">
                        <Col className="content-label" flex="170px" style={{padding:'3px'}}>
                          <div><span style={{color:'red'}}>*</span>{x.label}：</div> 
                          <div>{x.ps}</div>
                        </Col>
                        <Col className="content-text" flex="800px" style={{padding:0}}>
                        <FormItem name={x.name}>
                          <TextArea rows={5} 
                          placeholder={"一行一个素材，至少填写5个，多个素材以回车分行区别。"} 
                          style={{resize:'none'}}
                          />
                        </FormItem>
                        </Col>
                      </Row>
                    )
                  })
                }
              </Col>
            </Form>
            <Button style={{ width: 120, height: 40, background: '#096DD9', borderColor: '#096DD9' }} type="primary" onClick={() => setModalVisible(true)} htmlType="submit">提交</Button>
          </div>
          <MyModal
            title="确认提交"
            content="提交后不可修改，确认提交吗？"
            type={ModalType.info}
            onCancel={() => setModalVisible(false)}
            onOk={() => setModalVisible(false)}
            footer={<div>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" onClick={() =>printdata()}>确认</Button>
            </div>}
            visible={modalVisible} />
        </div>
    </div>
  )
}
