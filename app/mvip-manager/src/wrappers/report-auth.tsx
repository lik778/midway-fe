import React from 'react'
import { hasReportAuth, inIframe } from '@/utils';
import { Redirect } from 'umi';

export default (props: any) => {
  if (hasReportAuth() || inIframe()) {
    return <div>{ props.children }</div>;
  } else {
    return <Redirect to="/" />;
  }
}
