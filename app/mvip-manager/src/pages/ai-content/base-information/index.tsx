import React, { useEffect, useState } from 'react';
import { Input, Tooltip , Form , Col , Row  , Button} from 'antd';
import { Link } from 'umi';
import MainTitle from '@/components/main-title';
import Loading from '@/components/loading';
import AiEditModal from '@/components/ai-edit-modal';
import { getAiListApi, pauseAiTaskApi, startAiTaskApi } from '@/api/ai-content';
import './index.less';
import { AiContentItem } from '@/interfaces/ai-content';
import { addKeyForListData, formatTime } from '@/utils';
import { errorMessage } from '@/components/message';
import { AiTaskAction, AiTaskStatus } from '@/enums';
import { AiTaskStatusText } from '@/constants';

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
    }
  }

  return (
    <div>
      <MainTitle title="基础信息素材"/>
      <div className="ai-list-container">
          <div className="ai-create-box">
            <Form name="create-job-form">
              <Col className="group-words-list" span={24}>
                {
                  Object.keys(contentName).map((k) => {
                    const x = contentName[k];
                    return (<Row key={k} className="gutter-row" gutter={40} justify="center">
                        <Col className="content-label" span={2}><div><span style={{color:'red'}}>*</span>{x.label}：</div> </Col>
                        <Col span={18}>
                        <FormItem name={x.name}>
                          <TextArea rows={5} 
                          placeholder={"一行一个素材，至少填写5个，多个素材以回车分行区别。"} 
                          maxLength={200} 
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
            {/* <Button style={{ width: 120, height: 40, background: '#096DD9', borderColor: '#096DD9' }} type="primary" onClick={() => setModalVisible(true)} htmlType="submit">提交</Button> */}
          </div>
        </div>
    </div>
  )
}
