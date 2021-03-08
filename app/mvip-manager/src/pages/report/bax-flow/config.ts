import { PlatformLabelMap } from '@/constants/report'
import { FlowDetailData } from '@/interfaces/report'
import { getLastMonth, formatDateRange } from '@/utils'

interface Config {
  form: any
  dataSource?: any
}

export const flowConfig = ({
  form
}: Config) => ({
  form,
  query: [
    {
      label: '时间区间',
      name: 'date',
      type: 'range-picker',
      value: getLastMonth(),
      format: formatDateRange,
    }
  ]
})

export const visitListConfig = ({
  form,
  dataSource
}: Config) => ({
  form,
  dataSource,
  query: [
    {
      label: '时间区间',
      name: 'date',
      type: 'range-picker',
      value: getLastMonth(),
      format: formatDateRange,
    }
  ],
  table: {
    columns: [
      {
        title: '访问页面',
        dataIndex: 'webPage',
        key: 'webPage',
      },
      {
        title: '访问IP',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: '访问时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '搜索引擎',
        dataIndex: 'platform',
        key: 'platform',
        render: (_: any, row: FlowDetailData) => PlatformLabelMap[row.platform]
      },
      {
        title: '关键词',
        dataIndex: 'keyword',
        key: 'keyword',
      },
    ]
  }
})
