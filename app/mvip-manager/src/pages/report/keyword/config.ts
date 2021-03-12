import { createOptions } from '@/utils'
import { KeywordDetailListData } from '@/interfaces/report'
import {
  PlatformLabelMap,
  BaxProductLabelMap,
  CateProductLabelMap,
  DisplayLabelMap
} from '@/constants/report'
import { BaxProductType, CateProductType } from '@/enums/report'

const SearchEngineOptions = createOptions(PlatformLabelMap)
const ProductOptions = createOptions({...BaxProductLabelMap, ...{
  [CateProductType.SHOP]: '主营'
}})
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
      name: 'platform',
      type: 'select',
      value: '',
      format: Number,
      options: [
        { label: '全部', value: '' },
        ...SearchEngineOptions
      ],
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
    },
    {
      label: '展示端',
      name: 'device',
      type: 'select',
      value: '',
      format: Number,
      options: [
        { label: '全部', value: '' },
        ...DisplayOptions
      ],
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
        dataIndex: 'platform',
        key: 'platform',
        render: (_: any, row: KeywordDetailListData) => PlatformLabelMap[row.platform]
      },
      {
        title: '排名',
        dataIndex: 'ranking',
        key: 'ranking',
        render: (_: any, row: KeywordDetailListData) => {
          if (row.product === BaxProductType.YI_HUI_TUI) {
            return '已上词'
          }
          return row.ranking
        }
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
