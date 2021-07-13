import * as React from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import './index.styl';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const routerKey = {
  '/verify-word': 'verify-word',
  '/switch-shop-type': 'switch-shop-type'
}
export default withRouter((props) => {
  const menuKey = routerKey[props.location.pathname]
  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh', minWidth: 1400 }}>
        <Sider theme="light">
          <Header className="layout-side-header">
            <p>优选推管理后台</p>
          </Header>
          <Menu mode="inline" id="base-menu" defaultSelectedKeys={[menuKey]}>
            <SubMenu key="verify" title="审核">
              <Menu.Item key="verify-word">
                <Link to="/verify-word" key="verify-word" >词根审核</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="switch-shop-type">
              <Link to="/switch-shop-type" key="switch-shop-type">模板切换</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="layout-header">
            <p>管理员用户</p>
          </Header>
          <Content className="layout-content-box">
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
})
