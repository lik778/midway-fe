import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes'

export default () => {
  return (<div>
    <Router basename="/midway-admin">
      <Routes/>
    </Router>
  </div>)
}
