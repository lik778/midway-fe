import dayjs from 'dayjs'
import { createOptions } from '@/utils'
import { CateProductLabelMap } from '@/constants/report'
import { getLastMonth, formatDateRange } from '@/utils'

const ProductOptions = createOptions(CateProductLabelMap)

interface Config {
  form: any
  dataSource?: any
}

export const publishConfig = ({
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
      disabledDate: (date: dayjs.Dayjs) => date > dayjs().endOf('day')
    },
    {
      label: '所属产品',
      name: 'product',
      type: 'select',
      value: '',
      format: Number,
      options: [
        { label: '全部', value: '' },
        ...ProductOptions
      ],
      required: true
    },
  ]
})

export const publishListConfig = ({
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
      disabledDate: (date: dayjs.Dayjs) => date > dayjs().endOf('day')
    },
    {
      label: '所属产品',
      name: 'product',
      type: 'select',
      value: '',
      options: [
        { label: '全部', value: '' },
        ...ProductOptions
      ],
      required: true
    },
  ],
  table: {
    columns: [
      {
        title: '时间',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: '帖子发布量',
        dataIndex: 'tiezi',
        key: 'tiezi',
      },
      {
        title: '问答发布量',
        dataIndex: 'wenda',
        key: 'wenda',
      },
      {
        title: '店铺文章发布量',
        dataIndex: 'article',
        key: 'article',
      },
      {
        title: '店铺产品发布量',
        dataIndex: 'product',
        key: 'product',
      },
      {
        title: '总发布量',
        dataIndex: 'all',
        key: 'all',
        render: (_: any, r: any) => r.tiezi + r.wenda + r.article + r.product
      },
    ]
  }
})
