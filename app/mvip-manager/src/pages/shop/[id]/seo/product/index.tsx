import React, { useState, useEffect } from 'react';
import ShopBasisTab from '@/components/shop-basis-tab';
import SeoTab from '@/components/seo-tab';
import WildcatForm from '@/components/wildcat-form';
import { ShopBasisType, ShopTDKType, ShopTDKPosition } from '@/enums';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { tdkForm } from '@/config/form';
import { Form, message } from 'antd';
import { useParams } from 'umi';
import { RouteParams, TdkSaveMeta } from '@/interfaces/shop';
import { getMetaDetailApi, getMetaSaveApi } from '@/api/shop';
export default (props: any) => {
  const [formConfig, setformConfig] = useState<FormConfig>(tdkForm)
  const [editData, setEditData] = useState<any>(null)
  const params: RouteParams = useParams();

  const getMetaDetail = async () => {
    const res = await getMetaDetailApi(Number(params.id), {
      position: ShopTDKPosition.PRODUCT
    })
    if(res?.success) {
      const tkd = res.data.tkd
      setEditData(tkd)
    }
  }



  useEffect(() => {
    getMetaDetail()
  }, [])


  const sumbit = async (values: TdkSaveMeta) => {
    const res = await getMetaSaveApi(Number(params.id), values)
    if(res?.success) {
      message.success(res.message)
    }else{
      message.error(res.message)
    }
  }

  return (
      <div>
        <ShopBasisTab type={ShopBasisType.SEO}/>
       <div className="container">
         <div className="tdk-box">
           <h4>
             分页设置TDK
           </h4>
           <div className="t-content">
              <div className="t-menu">
                <SeoTab type={ShopTDKType.PRODUCT}/>
              </div>
            <div className="t-form">
              <Form.Item>
                <WildcatForm
                  editDataSource={editData}
                  config={formConfig}
                  submit={sumbit}
                  className="default-form"/>
              </Form.Item>
            </div>
           </div>
         </div>
       </div>
      </div>
    );
}





