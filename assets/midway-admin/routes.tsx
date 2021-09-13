import * as React from 'react';
import { Route, Switch } from "react-router-dom";
import Layout from './components/Layout';

import AuditImage from './pages/AuditImage';
import AuditVideo from './pages/AuditVideo';
import VerifyWord from './pages/VerifyWord';
import SwitchShopType from './pages/SwitchShopType';
import StoreWhitelist from './pages/StoreWhitelist';
import CleanCache from './pages/CleanCache';
import ModifyStore from './pages/ModifyStore';


export default () => {
  return (
    <Layout> 
      <Switch>
        <Route path="/audit-image" component={AuditImage} key="audit-image" />
        <Route path="/audit-video" component={AuditVideo} key="audit-video" />
        <Route path="/verify-word" component={VerifyWord} key="verify-word" />
        <Route path="/switch-shop-type" component={SwitchShopType} key="switch-shop-type" />
        <Route path="/store-whitelist" component={StoreWhitelist} key="store-whitelist" />
        <Route path="/clean-cache" component={CleanCache} key="clean-cache" />
        <Route path="/modify-the-store" component={ModifyStore} key="modify-the-store" />
      </Switch>
    </Layout>
  )
}
