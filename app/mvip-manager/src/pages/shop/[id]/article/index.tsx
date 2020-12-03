import React, { useEffect, useState } from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import { ContentCateType, ShopModuleType } from '@/enums';
import './index.less';
import ShopModuleGroup from '@/components/shop-module-group';
import ArticleList from './components/list';
import ArticleNav from './components/nav';
import { getArticleListApi } from '@/api/shop';
import { addKeyForListData } from '@/utils';
import { RouteParams } from '@/interfaces/shop';
import { useParams } from 'umi';


export default (props: any) => {
  const [moduleGroupVisible, setModuleGroupVisible] = useState(false);
  const [articleFormVisible, setArticleFormVisible] = useState(false);
  const [articleList, setArticleList] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [contentCateId, setContentCateId] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  // 获取店铺id
  const params: RouteParams = useParams();

  useEffect(() => {
    (async () => {
      const { success, data, message } = await getArticleListApi(Number(params.id), { page, contentCateId, size: 10 })
      if (success) {
        setArticleList(addKeyForListData(data.articleList.result) || [])
        setCateList(addKeyForListData(data.cateList) || [])
        setTotal(data.articleList.totalRecord)
      } else {
        message.error(message);
      }
    })()
  }, [page, contentCateId])

  return (<div>
    <MainTitle title="百姓网店铺"/>
    <ShopModuleTab type={ShopModuleType.ARTICLE}/>
    <div className="container">
      <ArticleNav
        cateList={cateList}
        onChange={(cateId: number) => { setPage(1); setContentCateId(cateId) }}
        getGroup={() => setModuleGroupVisible(true)}
        createModuleItem={() => alert('创建')} />
      <ShopModuleGroup
        type={ContentCateType.ARTICLE}
        title="文章分组"
        createBtnText="新建文章"
        cateList={cateList}
        onClose={() => setModuleGroupVisible(false)}
        visible={moduleGroupVisible}
        save={() => { setModuleGroupVisible(false) }}
      />
      <ArticleList
        total={total}
        dataSource={articleList}
        update={(list) => {
          setArticleList(addKeyForListData(list) || [])
        }}
        onChange={(page) => setPage(page)}/>
      {/*<ArticleBox/>*/}
    </div>
  </div>)
}
