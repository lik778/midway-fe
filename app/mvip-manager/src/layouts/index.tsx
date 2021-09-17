import React, { useState, useEffect } from 'react'
import { Layout, Menu, ConfigProvider, Skeleton } from 'antd'
import { Link } from 'umi'
import { connect } from 'dva'
import { isNull } from 'lodash'
import zhCN from 'antd/lib/locale/zh_CN'
import { removeOverflowY, inIframe, notInIframe, isLogin, isNotLocalEnv } from '@/utils'
import { baseMapStateToProps, baseMapDispatchToProps } from '@/models/base'
import { userMapStateToProps, userMapDispatchToProps } from '@/models/user'
import { ConnectState } from '@/models/connect'
import { MidMenuItem } from '@/interfaces/base'
import './index.less'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Layouts = (props: any) => {
  const { userInfo, menuList, getMenuList, getCompanyInfo, getUserInfo } = props
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
    setSelectedKeys([isShopRoute ? 'shop-manage' : routeList[2]])
  }, [props.location.pathname])

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider theme="light">
          <Header className="sideHeader">
            <div className="logo"></div>
          </Header>
          {isNull(menuList) && (
            <div style={{ padding: 20 }}>
              <Skeleton active title={false} paragraph={{ rows: 4 }} />
            </div>
          )}
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
                          <Link to={menu.path || ''}>{menu.menuName}</Link>
                        </Menu.Item>
                      )
                    })}
                  </SubMenu>
                )
              })
            }
            <SubMenu style={{ marginBottom: '10px' }} key={'ai-module'} title={'Ai内容发布'}
              className={'ai-module'}>
              <Menu.Item key='ai-list'>
                <Link to='/ai-module/ai-list'>创建推广</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ minWidth: notInIframe() ? 1350 : '' }}>
          <Header className="layoutHeader">
            <div>{userInfo && userInfo.userName}</div>
          </Header>
          <Content>{props.children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default connect((state: ConnectState) => {
  return {
    ...baseMapStateToProps(state),
    ...userMapStateToProps(state)
  }
}, (dispatch) => {
  return {
    ...baseMapDispatchToProps(dispatch),
    ...userMapDispatchToProps(dispatch)
  }
})(Layouts)
