import React from 'react'
import { hasReportAuth, inIframe } from '@/utils';
import EmptyReport from '@/pages/report/components/empty-report';
import { Redirect } from 'umi';

export default (props: any) => {
  const { route: { path: urlPath } } = props
  const whiteList = ['/report/keyword', '/report/bax-flow', '/report/remain']
  const onlineList = ['/report/keyword']
  if (((hasReportAuth() && whiteList.includes(urlPath)) || inIframe())) {
    return onlineList.includes(urlPath) ? <div>{ props.children }</div> : <EmptyReport />
  } else {
    return <Redirect to="/" />;
  }
}
