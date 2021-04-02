import React, { useState, useEffect } from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import { Link } from 'umi';
import { connect } from 'dva';
import zhCN from 'antd/lib/locale/zh_CN';
import { removeOverflowY, inIframe, notInIframe, hasReportAuth, isLogin, isNotLocalEnv } from '@/utils';
import { baseMapStateToProps, baseMapDispatchToProps } from '@/models/base'
import { USER_NAMESPACE, userMapDispatchToProps } from '@/models/user'
import { ConnectState } from '@/models/connect'
import { MidMenuItem } from '@/interfaces/base'

import './index.less'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Layouts = (props: any) => {
  const { userInfo, menuList, getMenuList,
    getCompanyInfo, getUserInfo, getShopStatus } = props
  if (inIframe()) {
    return <Layout className="site-layout">
      <Content>
        {React.cloneElement(props.children)}
      </Content>
    </Layout>
  }
  // 用户未登录
  if (!isLogin() && isNotLocalEnv()) {
    // const haojingHost = config().env;
    const haojingHost = '//www.baixing.com'
    location.href = `${haojingHost}/oz/login?redirect=${encodeURIComponent(location.href)}`
    return <></>;
  }

  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // 处理overflow: hidden问题
  useEffect(() => removeOverflowY());

  useEffect(() => {
    getUserInfo()
    getCompanyInfo()
    getMenuList()
  }, [])

  useEffect(() => {
    const routeList = props.location.pathname.split('/')
    const isShopRoute = (routeList[1] === 'shop')
    setOpenKeys([routeList[1]])
    setSelectedKeys([isShopRoute ? 'list' : routeList[2]])
  }, [props.location.pathname])

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider theme="light">
          <Header className="sideHeader">
            <div className="logo"></div>
          </Header>
          <Menu mode="inline" openKeys={openKeys} selectedKeys={selectedKeys}
            onOpenChange={(openKeys: any) => { setOpenKeys(openKeys) }} id="base-menu">
            {
              menuList && menuList.map((subMenu: MidMenuItem) => {
                return (
                  <SubMenu style={{ marginBottom: '10px' }} key={subMenu.key} title={subMenu.menuName}
                           className={subMenu.key}>
                    { subMenu.menuList && subMenu.menuList.map((menu: MidMenuItem) => {
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
            {hasReportAuth() && <SubMenu style={{ marginBottom: '10px' }} key="report" title="营销报表" className="report">
              <Menu.Item key="keyword">
                <Link to="/report/keyword">关键词</Link>
              </Menu.Item>
            </SubMenu>}
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ minWidth: notInIframe() ? 1240 : '' }}>
          <Header className="layoutHeader">
            <div>{userInfo && userInfo.userName}</div>
          </Header>
          <Content>{ props.children }</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default connect((state: ConnectState) => {
  return {
    ...baseMapStateToProps(state),
    companyInfo: state[USER_NAMESPACE].companyInfo,
    userInfo: state[USER_NAMESPACE].userInfo,
  }
}, (dispatch) => {
  return {
    ...baseMapDispatchToProps(dispatch),
    ...userMapDispatchToProps(dispatch),
  }
})(Layouts)
