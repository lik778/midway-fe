import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'umi';
import styles from './index.less'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default (props: any) => {
  const routeList = props.location.pathname.split('/')
  const isShopRoute = (routeList[1] === 'shop')
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <Header className={styles.sideHeader}>
          <div className={styles.logo}></div>
        </Header>
        <Menu mode="inline" defaultOpenKeys={[routeList[1]]} defaultSelectedKeys={[ isShopRoute ? 'list' : routeList[2]]}>
          <SubMenu style={{ marginBottom: '10px' }} key="company-info" title="企业资料">
            <Menu.Item key="base">
              <Link to="/company-info/base">基础资料</Link>
            </Menu.Item>
            <Menu.Item key="auth">
              <Link to="/company-info/auth">认证资料</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu style={{ marginBottom: '10px' }} key="shop" title="店铺管理">
            <Menu.Item key="list">
              <Link to="/shop/list">我的店铺</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu style={{ marginBottom: '10px' }} key="ai-content" title="AI内容生成">
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
        <Header className={styles.layoutHeader}>
          <div>百姓网用户2020</div>
        </Header>
        <Content>{ props.children }</Content>
      </Layout>
    </Layout>
  );
}
