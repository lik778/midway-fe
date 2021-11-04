import * as React from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import './index.styl';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const routerKey = {
  '/audit-image': 'audit-image',
  '/verify-word': 'verify-word',
  '/switch-shop-type': 'switch-shop-type',
  '/store-whitelist': 'store-whitelist',
  '/clean-cache': 'clean-cache',
  '/modify-the-store': 'modify-the-store',
  "/advice-record": 'advice-record',
  "/template-upload": 'template-upload',
  "/status-change": 'status-change'
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
              <Menu.Item key="audit-image">
                <Link to="/audit-image" key="audit-image">图片审核</Link>
              </Menu.Item>
              <Menu.Item key="audit-video">
                <Link to="/audit-video" key="audit-video">视频审核</Link>
              </Menu.Item>
              <Menu.Item key="verify-word">
                <Link to="/verify-word" key="verify-word">词根审核</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="switch-shop-type">
              <Link to="/switch-shop-type" key="switch-shop-type">模板切换</Link>
            </Menu.Item>
            <SubMenu key="common-function" title="常用功能">
              <Menu.Item key="modify-the-store">
                <Link to="/modify-the-store" key="modify-the-store">修改店铺名称</Link>
              </Menu.Item>
              <Menu.Item key="store-whitelist">
                <Link to="/store-whitelist" key="store-whitelist">添加多店铺权限</Link>
              </Menu.Item>
              <Menu.Item key="clean-cache">
                <Link to="/clean-cache" key="clean-cache">清53kf缓存</Link>
              </Menu.Item>
              <Menu.Item key="status-change">
                <Link to="/status-change" key="status-change">店铺状态管理</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="advice-record">
              <Link to="/advice-record" key="advice-record">意见收集</Link>
            </Menu.Item>
            <SubMenu key="templates-management" title="素材库管理">
              <Menu.Item key="template-upload">
                <Link to="/template-upload" key="template-upload">素材上传</Link>
              </Menu.Item>
            </SubMenu>
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
