import * as React from 'react';
import { Route, Switch } from "react-router-dom";
import Layout from './components/Layout';
import VerifyWord from './pages/VerifyWord';

export default () => {
  return (<Switch>
    <Layout>
      <Route path="/verify-word" component={VerifyWord} />

    </Layout>
  </Switch>)
}
