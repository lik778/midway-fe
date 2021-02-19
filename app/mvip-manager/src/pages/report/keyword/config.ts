import { createOptions } from '@/utils'
import { KeywordDetailListData } from '@/interfaces/report'
import {
  PlatformLabelMap,
  BaxProductLabelMap,
  CateProductLabelMap,
  DisplayLabelMap
} from '@/constants/report'

const SearchEngineOptions = createOptions(PlatformLabelMap)
const ProductOptions = createOptions({...BaxProductLabelMap,...CateProductLabelMap})
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
        dataIndex: 'platformType',
        key: 'platformType',
        render: (_: any, row: KeywordDetailListData) => PlatformLabelMap[row.platformType]
      },
      {
        title: '排名',
        dataIndex: 'ranking',
        key: 'ranking',
      },
      {
        title: '展示端',
        dataIndex: 'display',
        key: 'display',
        render: (_: any, row: KeywordDetailListData) => DisplayLabelMap[row.device]
      },
      {
        title: '所属产品',
        dataIndex: 'product',
        key: 'product',
        render: (_: any, row: KeywordDetailListData) => ({
          ...BaxProductLabelMap,
          ...CateProductLabelMap
        }[row.product])
      }
    ]
  }
})
