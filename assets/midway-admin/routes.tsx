import * as React from 'react';
import { Route, Switch } from "react-router-dom";
import Verify from './pages/Verify'


export default () => {
  return (<Switch>
    <Route path="/verify-list" component={Verify} />
  </Switch>)
}
