import React from 'react'
import { hasReportRole, inIframe } from '@/utils';
import { Redirect } from 'umi';

export default (props: any) => {
  if (hasReportRole() || inIframe()) {
    return <div>{ props.children }</div>;
  } else {
    return <Redirect to="/" />;
  }
}
