import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'umi';
import styles from './index.less'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default (props: any) => {
  const routeList = props.location.pathname.split('/')
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <Header className={styles.sideHeader}>
          <div className={styles.logo}></div>
        </Header>
        <Menu mode="inline" defaultOpenKeys={[routeList[1]]} defaultSelectedKeys={[routeList[2]]}>
          <SubMenu style={{ marginBottom: '10px' }} key="company-info" title="企业资料">
            <Menu.Item key="base">
              <Link to="/company-info/base">基础资料</Link>
            </Menu.Item>
            <Menu.Item key="auth">
              <Link to="/company-info/auth">认证资料</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu style={{ marginBottom: '10px' }} key="shops" title="店铺管理">
            <Menu.Item key="list">
              <Link to="/shops/list">我的店铺</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className={styles.layoutHeader}>
          <div>百姓网用户2020</div>
        </Header>
        <Content>{ props.children }</Content>
      </Layout>
    </Layout>
  );
}
