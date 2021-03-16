import React from 'react';
import { Input , Form , Col , Row  , Button} from 'antd';
import MainTitle from '@/components/main-title';
import './index.less';

export default (props: any) => {

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;

  const contentName: any = {
    wordA: {
      label: '公司优势',
      name: 'One',
    },
    wordB: {
      label: '公司好评',
      name: 'Two',
    },
    wordC: {
      label: '公司服务承诺',
      name: 'Three',
    },
    wordD: {
      label: '公司服务产品',
      name: 'Four',
    },
    wordE: {
      label: '行业小知识',
      name: 'Five',
      ps:'（回答通用素材库）',
    }
  }

  return (
    <div>
      <MainTitle title="基础信息素材"/>
      <div className="ai-list-container" style={{padding:'40px 10px'}}>
          <div className="ai-create-information-box">
            <Form name="base-information-box">
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
            <Button style={{ width: 120, height: 40, background: '#096DD9', borderColor: '#096DD9' }} type="primary" htmlType="submit">提交</Button>
          </div>
        </div>
    </div>
  )
}
