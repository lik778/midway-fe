import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'antd';
import MainTitle from '@/components/main-title';
import { connect } from 'dva';
import { cloneDeepWith } from 'lodash';
import { zhidaoInfoForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { UserEnterpriseInfo } from '@/interfaces/user';
import { companyInfoStateToProps } from '@/models/user';
import { saveEnterpriseForShopApi } from '@/api/user'
import { errorMessage, successMessage } from '@/components/message';
import './index.less';

function ZhidaoBase (props: any){
    const { companyInfo } = props
    const [formLoading, setFormLoading] = React.useState<boolean>(false);
    const [enterpriseInfo, setEnterpriseInfo] = useState<UserEnterpriseInfo | null>(null)
    const [config, setConfig] = useState<FormConfig>(cloneDeepWith(zhidaoInfoForm));
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
        if (companyInfo){
            setEnterpriseInfo(companyInfo)
            setFormLoading(false)
            setConfig({...config})
        }else{
            setFormLoading(true)
        }
    }, [ companyInfo ])

    const sumbit = async(values:any)=>{
        setLoading(true)
        const { success, message, data } = await saveEnterpriseForShopApi(values)
        setLoading(false)
        if (success) {
            successMessage('保存成功')
        }else{
            errorMessage(message || '出错了')
        }
    }
    return (
        <div>
            <MainTitle title="问答素材"/>
            <div className="container">
                {/*{ formLoading && <Loading />}*/}
                <WildcatForm
                    editDataSource={enterpriseInfo}
                    submit={sumbit}
                    config={config}
                    submitBtn={
                        <Row className="save-base-info-box">
                          <Col span={3}></Col>
                          <Col><Button loading={loading} className="btn"
                                type="primary" size="large" htmlType="submit">保存</Button></Col>
                        </Row>
                      }
                />
            </div>
        </div>)
}

const WrapperZhidaoBasePage: any = connect(companyInfoStateToProps)(ZhidaoBase)

WrapperZhidaoBasePage.wrappers = ['@/wrappers/path-auth']

export default WrapperZhidaoBasePage
