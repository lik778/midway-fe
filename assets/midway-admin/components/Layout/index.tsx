import * as React from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import { Link } from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import './index.styl';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default (props: any) => {
  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh', minWidth: 1400 }}>
        <Sider theme="light">
          <Header className="layout-side-header">
            <p>优选推管理后台</p>
          </Header>
          <Menu mode="inline" id="base-menu">
            <SubMenu  key="verify" title="审核">
              <Menu.Item key="list">
                <Link to="/verify-word">词根审核</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="layout-header">
            <p>管理员用户</p>
          </Header>
          <Content className="layout-content-box">
            { React.cloneElement(props.children) }
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
