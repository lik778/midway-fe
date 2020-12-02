import React, { useEffect, useState } from 'react';
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import ModuleEmpty from '@/components/shop-module-empty';
import ArticleBox from '@/components/article-box';
import { ShopModuleType } from '@/enums';
import './index.less';
import { Button, Modal, Select, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ShopModuleGroup from '@/components/shop-module-group';
import ArticleList from './components/list';
import { getArticleListApi } from '@/api/shop';
import { addKeyForListData } from '@/utils';
import { RouteParams } from '@/interfaces/shop';
import { useParams } from 'umi';
const Option = Select.Option;

const NavBox = (props: any) => {
  return (
    <div className="nav-container">
      <div style={{ float: 'left' }}>
        <Select
          showSearch
          size="large"
          style={{ width: 200 }}
          placeholder="选择文章"
          optionFilterProp="children"
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
          <Option value="文章1">文章1</Option>
          <Option value="文章2">文章2</Option>
          <Option value="文章3">文章3</Option>
        </Select>
      </div>
      <div style={{ float: 'right' }}>
        <Button onClick={props.getGroup} size="large" style={{ marginRight: 36 }}>文章分组</Button>
        <Button onClick={props.createModuleItem} icon={<PlusOutlined />} size="large" type="primary">新建文章</Button>
      </div>
    </div>
  )
}

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
    <ShopModuleTab type={ShopModuleType.article}/>
    <div className="container">
      <NavBox getGroup={() => setModuleGroupVisible(true)}
              createModuleItem={() => alert('创建')} />
      <ShopModuleGroup
        title="文章分组"
        createBtnText="新建文章"
        cateList={[]}
        onClose={() => setModuleGroupVisible(false)}
        visible={moduleGroupVisible}
        save={() => { console.log('保存') }}
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
