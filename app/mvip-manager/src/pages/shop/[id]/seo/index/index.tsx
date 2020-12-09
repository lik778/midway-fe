import React, { useState } from 'react';
import ShopBasisTab from '@/components/shop-basis-tab';
import SeoTab from '@/components/seo-tab';
import WildcatForm from '@/components/wildcat-form';
import { ShopBasisType, ShopTDKType } from '@/enums';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { tdkForm } from '@/config/form';
import { Form, Menu } from 'antd';
import './index.less'
export default (props: any) => {
  const [formConfig, setformConfig] = useState<FormConfig>(tdkForm)
  const sumbit = async () => {
    // if (!values.price) { values.price = '面议' }
    // values.contentImg = ''
    // if (Array.isArray(values.tags)) { values.tags = values.tags.join(',') }
    // let resData: any;
    // if (editData) {
    //   resData = await updateArticleApi(Number(params.id), { id: editData.id, ...values })
    // } else {
    //   resData = await createArticleApi(Number(params.id), values)
    // }
    // if (resData.success) {
    //   message.success(resData.message)
    //   if (editData) {
    //     updateArticleList(resData.data)
    //   } else {
    //     addArticleList(resData.data)
    //   }
    //   onClose()
    // } else {
    //   message.error(resData.message)
    // }
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
                <SeoTab type={ShopTDKType.INDEX}/>
              </div>
            <div className="t-form">
              <Form.Item>
                <WildcatForm
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





