import * as React from 'react';
import { Route, Switch } from "react-router-dom";
import Layout from './components/Layout';

import AuditImage from './pages/AuditImage';
import VerifyWord from './pages/VerifyWord';
import SwitchShopType from './pages/SwitchShopType';

export default () => {
  return (
    <Layout>
      <Switch>
        <Route path="/audit-image" component={AuditImage} key="audit-image" />
        <Route path="/verify-word" component={VerifyWord} key="verify-word" />
        <Route path="/switch-shop-type" component={SwitchShopType} key="switch-shop-type" />
      </Switch>
    </Layout>
  )
}
