import moment from 'moment'
import { QueryConfigItem } from '@/components/quick-form/interface'

interface Config {
  form: any
  dataSource?: any,
  query?: QueryConfigItem[]
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
      value: [
        moment(new Date()).subtract(1,'months'),
        moment()
      ],
      format: (value: [moment.Moment, moment.Moment], query: any) => {
        query.startTime = +value[0]
        query.endTime = +value[1]
      },
      required: true
    }
  ]
})

export const pvListConfig = ({
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
      value: [
        moment(new Date()).subtract(1,'months'),
        moment()
      ],
      required: true
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
    ]
  }
})
