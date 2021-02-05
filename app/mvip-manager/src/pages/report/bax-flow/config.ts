import moment from 'moment'

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
      value: [
        moment(new Date()).subtract(1,'months'),
        moment()
      ],
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
        dataIndex: 'pageURL',
        key: 'pageURL',
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
