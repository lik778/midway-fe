export const prefixDefaultData: string[] = [
  "实惠的",
  "平价的",
  "专业的",
  "正规的",
  "靠谱的",
  "放心的",
  "知名的",
  "老牌的",
  "有实力的",
  "大型的",
  "规模大的",
  "口碑好的",
  "好口碑的",
  "性价比高的",
  "平价的",
  "服务好的",
  "服务专业的",
  "有名气的",
  "名气大的",
  "实惠的",
  "好的",
  "大品牌",
  "品牌",
  "质量好的",
  "价格低的",
  "很好的",
  "优质的",
  "优良的",
  "优惠的",
  "省心的",
  "齐全的",
  "技术好的",
  "应用多的",
  "效果好的",
  "稳定的",
  "耐用的",
  "好用的",
  "规模大的"
]

export const auxiliaryDefaultData: string[] = [
  "在线等！",
  "有大佬知道的嘛？",
  "求高手帮助",
  "信赖推荐",
  "值得信赖",
  "货真价实",
  "量大从优",
  "厂家供应",
  "询问报价",
  "免费咨询",
  "价格行情",
  "厂家直供",
  "品质售后无忧",
  "今日行情",
  "承诺守信",

]

const QAwordsItemConfig : any = {
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

const suffixitems : any = {
  brandPublicity: {
    id:1,
    name: '品牌宣传',
    value: 'brandPublicity',
    child: [
      {
        id:1,
        name :'1词语a'
      },
      {
        id:2,
        name:'1词语b'
      },
      {
        id:3,
        name:'1词语c'
      },
      {
        id:4,
        name:'1词语d'
      },
      {
        id:5,
        name:'1词语e'
      },
      {
        id:6,
        name :'1词语a'
      },
      {
        id:7,
        name:'1词语b'
      },
      {
        id:8,
        name:'1词语c'
      },
      {
        id:9,
        name:'1词语d'
      },
      {
        id:10,
        name:'1词语e'
      },
    ],
  },
  priceDecision: {      
    id:2,
    name: '价格决策',
    value: 'priceDecision',
    child: [
      {
        id:1,
        name:'2词语a'
      },
      {
        id:2,
        name:'2词语b'
      },
      {
        id:3,
        name:'2词语c'
      },
      {
        id:4,
        name:'2词语d'
      },
      {
        id:5,
        name:'2词语e'
      },
      {
        id:6,
        name:'2词语a'
      },
      {
        id:7,
        name:'2词语b'
      },
      {
        id:8,
        name:'2词语c'
      },
      {
        id:9,
        name:'2词语d'
      },
      {
        id:10,
        name:'2词语e'
      },
    ],
  },
  qualityDecision: {
    name: '品质决策',
    value: 'qualityDecision',
    child: [
      {
        id:1,
        name:'3词语a'
      },
      {
        id:2,
        name:'3词语b'
      },
      {
        id:3,
        name:'3词语c'
      },
      {
        id:4,
        name:'3词语d'
      },
      {
        id:5,
        name:'3词语e'
      },
      {
        id:6,
        name:'3词语a'
      },
      {
        id:7,
        name:'3词语b'
      },
      {
        id:8,
        name:'3词语c'
      },
      {
        id:9,
        name:'3词语d'
      },
      {
        id:10,
        name:'3词语e'
      }
    ],
  },
  contactWay: {
    name: '联系方式',
    value: 'contactWay',
    child: [
      {
        id:1,
        name:'4词语a'
      },
      {
        id:2,
        name:'4词语b'
      },
      {
        id:3,
        name:'4词语c'
      },
      {
        id:4,
        name:'4词语d'
      },
      {
        id:5,
        name:'4词语e'
      },
      {
        id:6,
        name:'4词语a'
      },
      {
        id:7,
        name:'4词语b'
      },
      {
        id:8,
        name:'4词语c'
      },
      {
        id:9,
        name:'4词语d'
      },
      {
        id:10,
        name:'4词语e'
      }
    ],
  },
  attention: {
    name: '注意事项',
    value: 'attention',
    child: [
      {
        id:1,
        name:'5词语a'
      },
      {
        id:2,
        name:'5词语b'
      },
      {
        id:3,
        name:'5词语c'
      },
      {
        id:4,
        name:'5词语d'
      },
      {
        id:5,
        name:'5词语e'
      },
      {
        id:6,
        name:'5词语a'
      },
      {
        id:7,
        name:'5词语b'
      },
      {
        id:8,
        name:'5词语c'
      },
      {
        id:9,
        name:'5词语d'
      },
      {
        id:10,
        name:'5词语e'
      }
    ],
  }
}

export const aiDefaultWord: any = {
  QAwordsItemConfig:QAwordsItemConfig,
  suffixitems:suffixitems,
  prefix: prefixDefaultData,
  modal: auxiliaryDefaultData
}
