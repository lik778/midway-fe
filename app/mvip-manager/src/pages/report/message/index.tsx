import React from 'react'
import { Form } from 'antd'
import Loading from '@/components/loading'
import MainTitle from '@/components/main-title'
import Query from '../components/search-list'

import { useApi } from '@/hooks/api'
import { getLeaveMessageList } from '@/api/report'
import { LeaveMessageSearchListConfig } from './config'

import { ReportListResData, getLeaveMessageListParams, LeaveMessageListData } from '@/interfaces/report'

function LeaveMessagePage() {
  const [queryForm] = Form.useForm()
  const [lists, loading, refreshList] = useApi<ReportListResData<getLeaveMessageListParams[]> | null, LeaveMessageListData>(null, getLeaveMessageList)

  return (
    <div className="page-report page-report-keyword">
      <MainTitle title="留资报表" />
      <div className="container">
        { loading && <Loading/> }
        <div className={"segment" + ' ' + (loading ? 'hide' : '')}>
          <h2>留资报表</h2>
          <Query
            onQuery={refreshList}
            config={LeaveMessageSearchListConfig({
              form: queryForm,
              dataSource: lists?.result
            })}
          />
        </div>
      </div>
    </div>
  )
}

LeaveMessagePage.wrappers = ['@/wrappers/path-auth']

export default LeaveMessagePage
