import React, { useState, useEffect } from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import { Link } from 'umi';
import { connect } from 'dva';
import './index.less'
import { getUserBaseInfoApi } from '@/api/user'
import { UserInfo } from '@/interfaces/user';
import { getCreateShopStatusApi } from '@/api/shop';
import { ShopStatus } from '@/interfaces/shop';
import zhCN from 'antd/lib/locale/zh_CN';
import { removeOverflowY } from '@/utils';
import { GETSHOPINFO_OUT_ACTION } from '@/models/shop';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Layouts =  (props: any) => {
  const [userInfo, setUserInfo] = useState<UserInfo | any>({})
  const [shopStatus, setShopStatus] = useState<ShopStatus | any>({})
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  // 处理overflow: hidden问题
  useEffect(() => removeOverflowY());

  useEffect(() => {
    (async () => {
      const res = await getUserBaseInfoApi();
      if (res?.success) {
        setUserInfo({...res.data})
      }
    })();
    (async () => {
      const res = await getCreateShopStatusApi()
      if (res?.success) {
        setShopStatus(res.data)
      }
    })()
  }, [])

  const getCurrentShopInfo = () => {
    const shopIdItem = RegExp(/\d+/).exec(props.location.pathname)
    if (shopIdItem) {
      const id = Number(shopIdItem[0])
      props.dispatch({ type: GETSHOPINFO_OUT_ACTION, payload: { id }})
    }
  }

  useEffect(() => {
    const routeList = props.location.pathname.split('/')
    const isShopRoute = (routeList[1] === 'shop')
    setOpenKeys([routeList[1]])
    setSelectedKeys([ isShopRoute ? 'list' : routeList[2]])
    // 获取当前店铺信息
    getCurrentShopInfo()
  }, [props.location.pathname])

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider theme="light">
          <Header className="sideHeader">
            <div className="logo"></div>
          </Header>
          <Menu mode="inline" openKeys={openKeys} selectedKeys={selectedKeys}
                onOpenChange={(openKeys: any) => {setOpenKeys(openKeys) }} id="base-menu">
            <SubMenu style={{ marginBottom: '10px' }} key="company-info" title="企业资料" className="company-info">
              <Menu.Item key="base">
                <Link to="/company-info/base">基础资料</Link>
              </Menu.Item>
              <Menu.Item key="auth">
                <Link to="/company-info/auth">认证资料</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu style={{ marginBottom: '10px' }} key="shop" title="店铺管理" className="shop-manage">
              <Menu.Item key="list">
                <Link to="/shop">我的店铺</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu style={{ marginBottom: '10px' }} key="ai-content" title="AI内容生成" className="ai-content">
              <Menu.Item key="create-job">
                <Link to="/ai-content/create-job">新建任务</Link>
              </Menu.Item>
              <Menu.Item key="job-list">
                <Link to="/ai-content/job-list">管理任务</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="layoutHeader">
            <div>{userInfo.userName}</div>
          </Header>
          <Content>
            { React.cloneElement(props.children, { userInfo, shopStatus }) }
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default connect()(Layouts)
