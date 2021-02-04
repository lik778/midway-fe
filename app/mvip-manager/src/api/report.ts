/* 关键词 */

export const getKeywordStatics = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        fm: 60,
        bw: 70,
        qc: 134,
        cate: 234
      }
    })
  })
}

export const getKeywordRankList = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          key: i,
          keyword: ['后曲小学桥架','江西鹰潭桥架','八一乡桥架材质'][~~(Math.random() * 3)],
          rank: ~~(Math.random() * 100),
          display: [1,2][~~(Math.random() * 2)],
          product: ['fm','bw','qc'][~~(Math.random() * 3)],
          search: ['baidu','360','shenma','sougou'][(~~(Math.random() * 3))],
        }))
      }
    })
  })
}

export const getPVData = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          date: String(20210101 + i).replace(/^(\d{4})(\d{2})/, '$1-$2-'),
          pv: ~~(Math.random() * 1000)
        }))
      }
    })
  })
}

export const getRemainCapital = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        all: 216,
        filtered: 112
      }
    })
  })
}

export const getPVList = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          key: i,
          pageURL: `https://shop.baixing.com/yhfangshui/n-${~~(Math.random()*10000)}.html`,
          ip: '183.21.240.***',
          time: '2021-01-19 21:10:08'
        }))
      }
    })
  })
}

export const getPublishData = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          key: i,
          date: String(20210101 + i).replace(/^(\d{4})(\d{2})/, '$1-$2-'),
          counts: [
            ~~(Math.random() * 200),
            ~~(Math.random() * 500),
            ~~(Math.random() * 1000),
            ~~(Math.random() * 800),
          ]
        }))
      }
    })
  })
}

export const getPublishDetails = (params: any): Promise<any> => {
  return new Promise(resolve => {
    resolve({
      code: 200,
      data: {
        result: Array(10).fill('').map((x,i) => ({
          key: i,
          date: String(20210101 + i).replace(/^(\d{4})(\d{2})/, '$1-$2-'),
          tiezi: ~~(Math.random() * 100),
          wenda: ~~(Math.random() * 100),
          article: ~~(Math.random() * 100),
          product: ~~(Math.random() * 100),
          all: ~~(Math.random() * 100),
        }))
      }
    })
  })
}
