import React, { useEffect, useState } from 'react';
import { AiShopList } from '@/interfaces/ai-module';
import { Link } from 'umi';
import { CateItem } from '@/interfaces/shop';
import { getAiShopListApi } from '@/api/ai-module';
import { checkHasShow } from '@/utils';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import Loading from '@/components/loading';
import Recharge from '@/components/recharge';
import styles from './index.less';
import { errorMessage, warnMessage } from '@/components/message';

const Option = Select.Option;
const FormItem = Form.Item;


interface Props {
  form: FormInstance<any>,
  showPanel(): void;
  handleChangeShop(shopInfo: AiShopList): void
}
export const CreateAiContentNav = (props: Props): any => {
  const { form, showPanel, handleChangeShop } = props
  const [shopList, setShopList] = useState<AiShopList[] | null>(null)
  const [shopId, setShopId] = useState<number | null>(null)
  const [articleList, setArticleList] = useState<CateItem[] | null>(null)
  useEffect(() => {
    (async () => {
      const res = await getAiShopListApi()
      if (res?.success) {
        showGroupWordPanel(res.data || [])
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

  const onShopChange = (shopId: number, prevValue: number | undefined) => {
    const item = shopList && shopList.find((x: AiShopList) => x.id === shopId)

    if (item?.isSupportAi) {
      // 要把选中的店铺告诉父组件
      handleChangeShop(shopList!.find(item => item.id === shopId)!)
      setShopId(shopId)
      const articleCates = (item && item.articleCates) || []
      if (articleCates.length > 0) {
        showPanel();
      }
      form.resetFields(['contentCateId'])
      setArticleList((item && item.articleCates) || [])
      return shopId
    } else {
      warnMessage('您选择的店铺没有AI发文权限')
      //然后选择框回退到上个状态
      if (!prevValue) {
        form.resetFields(['shopId'])
      }
      return prevValue
    }
  }

  return (
    <div className={styles["ai-filters-box"]}>
      { checkHasShow<AiShopList>(shopList) === 'loading' && <Loading />}
      { checkHasShow<AiShopList>(shopList) === 'show' &&
        <Form className={styles["ai-form"]} layout="inline" form={form}>
          <FormItem label="所属店铺" name="shopId" key="shopId" normalize={(value: number, prevValue: number | undefined) => onShopChange(value, prevValue)}>
            <Select style={{ width: 200, marginRight: 40 }} placeholder="请选择所属店铺">
              {/* 待选项里，会先过滤掉，购买时套餐不含AI发文的店铺 */}
              {shopList && shopList.length > 0 && shopList.map((shop: any) => {
                return (<Option key={shop.id} value={shop.id}>{shop.name}</Option>)
              })}
            </Select>
          </FormItem>
          {checkHasShow<CateItem>(articleList) === 'show' &&
            <FormItem label="所属文章分组" name="contentCateId" key="contentCateId">
              <Select style={{ width: 200 }} placeholder="请选择所属文章分组" >
                {articleList && articleList.length > 0 && articleList.map((article: any) => {
                  return (<Option key={article.id} value={article.id}>{article.name}</Option>)
                })}
              </Select>
            </FormItem>
          }
          {checkHasShow<CateItem>(articleList) === 'hide' &&
            <div className={styles["ai-no-article-tips"]}>所属文章分组: 您当前店铺下还没有可用分组，去创建分组，<Link to={`/shop/${shopId}/article`}>去创建分组</Link></div>
          }
        </Form>
      }
      { checkHasShow<AiShopList>(shopList) === 'hide' &&
        <p className={styles["ai-no-shop-tips"]}>先去创建店铺和文章分组才能新建任务，<Link to="/shop">去创建店铺</Link></p>}
      <Recharge shopId={shopId} />
    </div>
  )
}
