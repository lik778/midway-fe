
const QAwordsItemConfig: any = {
  area: {
    label: '地区',
    name: 'area',
    placeholder: '举例：\n浦东新区\n东方明珠\n南京西路',
    min: 7,
    max: 20,
    rules: '7-20个'
  },
  prefix: {
    label: '前缀',
    name: 'prefix',
    placeholder: '举例：\n修饰词：\n靠谱的\n附近的\n\n行业细分词：\n公司注册：科技公司、游戏公司',
    min: 7,
    max: 20,
    rules: '7-20个'
  },
  coreWords: {
    label: '核心词',
    name: 'coreWords',
    placeholder: '举例：\n冰箱维修\n气动隔膜泵',
    min: 7,
    max: 20,
    rules: '7-20个'
  },
  suffix: {
    label: '疑问词',
    name: 'suffix',
    placeholder: '',
    min: 30,
    max: 50,
    rules: '3-5个类型'
  },
  modal: {
    label: '辅助词',
    name: 'modal',
    placeholder: '举例：\n在线等！\n有大佬知道的吗？\n求高手帮助',
    min: 3,
    max: 10,
    rules: ''
  }
}

export const aiDefaultWord: any = {
  QAwordsItemConfig: QAwordsItemConfig,
}
