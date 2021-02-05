import moment from 'moment'

import { createOptions } from '@/utils'
import {
  SearchEngineType,
  BaxProductType,
  DisplayType
} from '@/enums/report'
import {
  SearchEngineLabelMap,
  BaxProductLabelMap,
  DisplayLabelMap
} from '@/constants/report'

const SearchEngineOptions = createOptions(SearchEngineLabelMap)
const ProductOptions = createOptions(BaxProductLabelMap)
const DisplayOptions = createOptions(DisplayLabelMap)

interface Config {
  form: any
  dataSource?: any
}

export const keywordRankListConfig = ({
  form,
  dataSource
}: Config) => ({
  form,
  dataSource,
  query: [
    {
      label: '搜索引擎',
      name: 'search',
      type: 'select',
      value: '',
      options: [
        { label: '全部', value: '' },
        ...SearchEngineOptions
      ],
      required: true
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
    {
      label: '展示端',
      name: 'mobile',
      type: 'select',
      value: '',
      options: [
        { label: '全部', value: '' },
        ...DisplayOptions
      ],
      required: true
    },
  ],
  table: {
    columns: [
      {
        title: '关键词',
        dataIndex: 'keyword',
        key: 'keyword',
      },
      {
        title: '搜索引擎',
        dataIndex: 'search',
        key: 'search',
        render: (t: SearchEngineType) => SearchEngineLabelMap[t]
      },
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
      },
      {
        title: '展示端',
        dataIndex: 'display',
        key: 'display',
        render: (t: DisplayType) => DisplayLabelMap[t]
      },
      {
        title: '所属产品',
        dataIndex: 'product',
        key: 'product',
        render: (t: BaxProductType) => BaxProductLabelMap[t]
      }
    ]
  }
})
