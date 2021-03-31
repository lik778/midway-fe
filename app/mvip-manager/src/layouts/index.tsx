import React, { useState, useEffect } from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import { Link } from 'umi';
import { connect } from 'dva';
import { getUserBaseInfoApi } from '@/api/user'
import { getMenuApi } from '@/api/common'
import { UserInfo } from '@/interfaces/user';
import { getCreateShopStatusApi } from '@/api/shop';
import { ShopStatus } from '@/interfaces/shop';
import zhCN from 'antd/lib/locale/zh_CN';
import { removeOverflowY, inIframe, notInIframe, hasReportAuth, isLogin, isNotLocalEnv } from '@/utils';
import './index.less';
import { errorMessage } from '@/components/message';
import { MidMenuItem } from '@/interfaces/base';
// import config from '@/config/env';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Layouts = (props: any) => {
  if (inIframe()) {
    return <Layout className="site-layout">
      <Content>
        { React.cloneElement(props.children) }
      </Content>
    </Layout>
  }
  console.log('321')
  // 用户未登录
  if (!isLogin() && isNotLocalEnv()) {
    // const haojingHost = config().env;
    const haojingHost = '//www.baixing.com'
    location.href = `${ haojingHost }/oz/login?redirect=${encodeURIComponent(location.href)}`
    return <div></div>;
  }
  const [menuList, setMenuList] = useState<MidMenuItem[]>([])
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

  useEffect(() => {
    (async () => {
      const { success, data, message } = await getMenuApi()
      success ? setMenuList(data.menuList) : errorMessage(message)
    })()
  }, [])

  useEffect(() => {
      const routeList = props.location.pathname.split('/')
      const isShopRoute = (routeList[1] === 'shop')
      setOpenKeys([routeList[1]])
      setSelectedKeys([ isShopRoute ? 'list' : routeList[2]])
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
            {
              menuList && menuList.map(subMenu => {
                  return (
                    <SubMenu style={{ marginBottom: '10px' }} key={subMenu.key} title={subMenu.menuName}
                             className={subMenu.key}>
                      { subMenu.menuList && subMenu.menuList.map(menu => {
                        return (
                          <Menu.Item key={menu.key}>
                            <Link to={menu.path || ''}>{ menu.menuName }</Link>
                          </Menu.Item>
                        )
                      }) }
                    </SubMenu>
                  )
              })
            }
            { hasReportAuth() && <SubMenu style={{ marginBottom: '10px' }} key="report" title="营销报表" className="report">
              {/*<Menu.Item key="dashboard">*/}
              {/*  <Link to="/report/dashboard">总览</Link>*/}
              {/*</Menu.Item>*/}
              <Menu.Item key="keyword">
                <Link to="/report/keyword">关键词</Link>
              </Menu.Item>
              {/*<Menu.Item key="bax-flow">*/}
              {/*  <Link to="/report/bax-flow">流量</Link>*/}
              {/*</Menu.Item>*/}
              {/*<Menu.Item key="cate-flow">*/}
              {/*  <Link to="/report/cate-flow">快照流量</Link>*/}
              {/*</Menu.Item>*/}
              {/*<Menu.Item key="cate-publish">*/}
              {/*  <Link to="/report/cate-publish">快照发布</Link>*/}
              {/*</Menu.Item>*/}
              {/*<Menu.Item key="remain">*/}
              {/*  <Link to="/report/remain">留资</Link>*/}
              {/*</Menu.Item>*/}
            </SubMenu> }
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ minWidth: notInIframe() ? 1240 : '' }}>
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
