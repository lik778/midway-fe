import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'umi';
import styles from './index.less'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default (props: any) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <Header className={styles.sideHeader}>
          <div className={styles.logo}></div>
        </Header>
        <Menu mode="inline" >
          <SubMenu style={{ marginBottom: '10px' }} key="sub1" title="企业资料">
            <Menu.Item key="1">
              <Link to="/company-info/base">基础资料</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/company-info/auth">认证资料</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu style={{ marginBottom: '10px' }} key="sub2" title="店铺管理">
            <Menu.Item key="3">
              <Link to="/shops/list">我的店铺</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className={styles.layoutHeader}>
          <div>百姓网用户2020</div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          { props.children }
        </Content>
      </Layout>
    </Layout>
  );
}
