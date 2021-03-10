import React, { useEffect, useState } from 'react';
import { AiShopList } from '@/interfaces/ai-content';
import { Link } from 'umi';
import { CateItem } from '@/interfaces/shop';
import { getAiShopListApi } from '@/api/ai-content';
import { checkHasShow } from '@/utils';
import { Form, Select, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import Loading from '@/components/loading';
import Recharge from '@/components/recharge';
import './index.less';
import { errorMessage } from '@/components/message';

const Option = Select.Option;
const FormItem = Form.Item;


interface Props {
  form: FormInstance<any>,
  showPanel(): void;
}
export const CreateAiContentNav = (props: Props): any => {
    const { form, showPanel } = props
    const [shopList, setShopList] = useState<AiShopList[] | null>(null)
    const [shopId, setShopId] = useState<number | null>(null)
    const [articleList, setArticleList] = useState<CateItem[] | null>(null)
    //const [modalVisible, setModalVisible] = useState<boolean>(false)
    useEffect(() => {
      (async () => {
        const res = await getAiShopListApi()
        if (res?.success) {
          showGroupWordPanel(res.data)
          setShopList(res.data || [])
        } else {
          errorMessage(res.message)
        }
      })()
    }, [])


    const showGroupWordPanel = (list: AiShopList[]) => {
      if (list && list.length > 0 && list.some(x => (x.articleCates.length > 0))) {
        showPanel();
      }
    }

    const onShopChange = async (shopId: number) => {
      setShopId(shopId)
      const item = shopList && shopList.find((x: AiShopList) => (x.id === shopId && x.isSupportAi) )
      //if (item && item.isSupportAi) {
      //  console.log('此处应该弹窗',item.isSupportAi)
      //  Modal.error({
      //    content: '该店铺不支持AI功能，请重新选择...',
      //  });
      //}

      const articleCates = (item && item.articleCates) || []
      if (articleCates.length > 0) {
        showPanel();
      }
      form.resetFields(['contentCateId'])
      setArticleList((item && item.articleCates) || [])
    }

    return (
      <div className="ai-filters-box">
        { checkHasShow<AiShopList>(shopList) === 'loading' && <Loading/> }
        { checkHasShow<AiShopList>(shopList) === 'show' &&
            <Form layout="inline" form={form}>
              <FormItem label="所属店铺" name="shopId" key="shopId">
                <Select  style={{ width: 200, marginRight: 40 }} placeholder="请选择所属店铺" onChange={onShopChange}>
                  { shopList && shopList.length > 0 && shopList.map((shop: any) => {
                    return (<Option key={shop.id} value={shop.id}>{shop.name}</Option>)
                  }) }
                </Select>
              </FormItem>
              { checkHasShow<CateItem>(articleList) === 'show' &&
                <FormItem label="所属文章分组" name="contentCateId" key="contentCateId">
                  <Select  style={{ width: 200 }} placeholder="请选择所属文章分组" >
                    { articleList && articleList.length > 0 && articleList.map((article: any) => {
                      return (<Option key={article.id} value={article.id}>{article.name}</Option>)
                    }) }
                  </Select>
                </FormItem>
              }
              { checkHasShow<CateItem>(articleList) === 'hide' &&
                <div className="ai-no-article-tips">所属文章分组: 您当前店铺下还没有可用店铺，去创建分组，<Link to={`/shop/${shopId}/article`}>去创建分组</Link></div>
              }
            </Form>
        }
        { checkHasShow<AiShopList>(shopList) === 'hide' &&
            <p className="ai-no-shop-tips" >先去创建店铺和文章分组才能新建任务，<Link to="/shop">去创建店铺</Link></p>}
        <Recharge shopId={shopId}/>
      </div>
    )
}
