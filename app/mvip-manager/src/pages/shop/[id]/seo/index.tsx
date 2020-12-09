import React, { useState } from 'react';
import ShopBasisTab from '@/components/shop-basis-tab';
import WildcatForm from '@/components/wildcat-form';
import { ShopBasisType, ShopTDKType } from '@/enums';
import { FormConfig, FormItem } from '@/components/wildcat-form/interfaces';
import { tdkForm } from '@/config/form';
import { Form, Menu } from 'antd';
import './index.less'
export default (props: any) => {
  const [formConfig, setformConfig] = useState<FormConfig>(tdkForm)
  const [current, setCurrent] = useState('nav')
  const handleClick = (e: { key: any; }) => {
    setCurrent(e.key)
  };


  const menuList = [
    {
      link: ShopTDKType.INDEX,
      label: "首页",
      key: ShopTDKType.INDEX,
    },
    {
      link: ShopTDKType.PRODUCT,
      label: "服务页面",
      key: ShopTDKType.PRODUCT,
    },
    {
      link: ShopTDKType.ARTICLE,
      label: "文章页面",
      key: ShopTDKType.ARTICLE,
    }
  ]


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
                <Menu onClick={handleClick} selectedKeys={[current]} className="a-menu">
                  {menuList.map(item => {
                    return  <Menu.Item key={item.key}>{item.label}
                    </Menu.Item>
                  })}
                </Menu>
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





