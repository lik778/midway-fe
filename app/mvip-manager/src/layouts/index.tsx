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
  // 用户未登录
  if (!isLogin() && isNotLocalEnv()) {
    // const haojingHost = config().env;
    const haojingHost = '//www.baixing.com'
    location.href = `${ haojingHost }/oz/login?redirect=${encodeURIComponent(location.href)}`
    return <div></div>;
  }

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
      const res = await getMenuApi()
      console.log(res)
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
            <SubMenu style={{ marginBottom: '10px' }} key="company-info" title="企业资料" className="company-info">
              <Menu.Item key="base">
                <Link to="/company-info/base">基础资料</Link>
              </Menu.Item>
              <Menu.Item key="auth">
                <Link to="/company-info/auth">认证资料</Link>
              </Menu.Item>
              <Menu.Item key="zhidao">
                <Link to="/company-info/zhidao">问答素材</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu style={{ marginBottom: '10px' }} key="shop" title="店铺管理" className="shop-manage">
              <Menu.Item key="list">
                <Link to="/shop">我的店铺</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu style={{ marginBottom: '10px' }} key="ai-content" title="AI内容生成" className="ai-content">
              {/*<Menu.Item key="create-job">
                <Link to="/ai-content/create-job">新建任务</Link>
              </Menu.Item>
              <Menu.Item key="job-list">
                <Link to="/ai-content/job-list">管理任务</Link>
              </Menu.Item>*/}
              <Menu.Item key="ai-shop">
                <Link to="/ai-content/ai-shop">店铺AI</Link>
              </Menu.Item>
              <Menu.Item key="ai-zhidao">
                <Link to="/ai-content/ai-zhidao">问答AI</Link>
              </Menu.Item>
              {/*<Menu.Item key="base-information">
                <Link to="/ai-content/base-information">基础资料填写</Link>
              </Menu.Item>*/}
            </SubMenu>
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
