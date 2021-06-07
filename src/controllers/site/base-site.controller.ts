import { Get, HostParam, Param, Query, Req, Res } from '@nestjs/common';
import { SiteService } from '../../services/site.service';
import { Request, Response } from 'express';
import { UserAgent } from '../../decorator/user-agent.decorator';
import { DomainTypeEnum } from '../../enums';
import { TrackerService } from '../../services/tracker.service';
import { TrackerType } from '../../enums/tracker';
import { COOKIE_HASH_KEY, COOKIE_TOKEN_KEY, COOKIE_USER_KEY } from '../../constant/cookie';

//模板页面基础控制器，进行数据请求和打点
export class BaseSiteController {
  private whiteList: string[] = ['baomuyuesao', 'zhongheruijia', 'jikang', 'weichai', 'ndjx', 'hnfjhbsb']
  constructor(protected readonly midwayApiService: SiteService,
    protected readonly trackerService: TrackerService,
    protected domainType: DomainTypeEnum) { }

  private async getUserInfo(req: Request, domain: string): Promise<any> {
    const cookies = req.cookies
    let userInfo = null
    if (cookies && cookies[COOKIE_HASH_KEY] && cookies[COOKIE_USER_KEY] && cookies[COOKIE_TOKEN_KEY]) {
      try {
        const { data } = await this.midwayApiService.getUserInfo(req, domain);
        userInfo = data
      } catch (e) {
        console.log(e)
      }
    }
    return userInfo
  }

  private setData(data) {
    if (!data.basic.company) {
      data.basic.company = {
        name: '',
        address: ''
      }
    }
    if (!data.basic.contact) {
      data.basic.contact = {
        qq: {}, phone: { content: '' }, phone2: { content: '' }, weChat: {}, contactName: {}, kf53StyleUrl: '', kf53: ''
      }
    }

    data.basic.company.about = data.basic.company.about || '我们公司拥有雄厚的资本和资源，是经过长时间积累而成长壮大起来的企业，一直以来，坚持不断创新，提高公司核心竞争优势。重视用户的服务体验，将客户、产品与服务三合一放在同一重点维度上，以提升客户满意度为宗旨，欢迎大家来电咨询。'

    data.autoConfig = data.autoConfig && data.autoConfig.length > 0 ? data.autoConfig : [{ mainModuleTitle: '企业优势', subModuleBos: [{ fontColor: 0, title: '质量在心中', content: '将产品质量与企业荣耀挂钩，踏踏实实地进行至今' }, { fontColor: 0, title: '名牌在手中', content: '以诚心待客户，口碑已积累在多年，当前在行业内小有名气，有口皆碑' }, { fontColor: 0, title: '责任在肩上', content: '坚持做到物美价廉，物有所值，让消费者放心' }, { fontColor: 0, title: '诚信在言行中', content: '重承诺，重言行，拿客户满意作为衡量服务的标准' }] }]
    //红白头开关
    if (this.whiteList.indexOf(data.basic.shop.domain) !== -1) {
      data.isRedTopbar = true
    }
    return data
  }


  @Get('/')
  public async home(@Param() params, @HostParam('shopName') HostShopName: string, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    let shopName = ''
    const domain = req.hostname
    if (this.domainType === DomainTypeEnum.B2C) {
      shopName = this.midwayApiService.getShopName(params.shopName)
      if (!/\/$/.test(req.path)) {
        res.redirect(`/${shopName}/`)
        return
      }
    } else if (this.domainType === DomainTypeEnum.B2B) {
      shopName = HostShopName
    }
    const userInfo = await this.getUserInfo(req, domain)
    const { data: originData } = await this.midwayApiService.getHomePageData(shopName, device, domain);
    const data = this.setData(originData)
    // 打点
    const shopId = data.basic.shop.id
    this.trackerService.point(req, res, {
      eventType: TrackerType.BXMAINSITE, data: {
        event_type: TrackerType.BXMAINSITE,
        site_id: 'dianpu',
        shop_id: shopId,
        pageType: 'view_home',
        _platform: device,
        tracktype: 'pageview',
      }
    })

    //按约定，根据后端返回的模板id来选择跳转到哪个前端模板
    const { templateId } = data.basic.shop
    const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/home/index`
    const { kf53 } = data.basic.contact;
    const currentPathname = req.originalUrl;
    const trackId = this.trackerService.getTrackId(req, res)

    return res.render(templateUrl, { title: '首页', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId, userInfo }, isHome: true });
  }

  @Get('/n')
  async listing(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const currentPage = query.page || 1;
    const { data: originData } = await this.midwayApiService.getNewsPageData(shopName, device, { page: currentPage }, domain);
    const data = this.setData(originData)

    // 打点
    const shopId = data.basic.shop.id
    this.trackerService.point(req, res, {
      eventType: TrackerType.BXMAINSITE, data: {
        event_type: TrackerType.BXMAINSITE,
        site_id: 'dianpu',
        shop_id: shopId,
        pageType: 'view_listing',
        contentType: 'article',
        category: '',
        _platform: device,
        tracktype: 'pageview',
      }
    })
    const { templateId } = data.basic.shop
    const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/news/index`
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)
    return res.render(templateUrl, { title: '新闻资讯', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo } });
  }

  @Get('/n-:id')
  async newschild(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    if (/.html$/.test(req.url)) {
      const newsId = params.id.split(".")[0]
      const { data: originData } = await this.midwayApiService.getNewsDetailData(shopName, device, { id: newsId }, domain);
      const data = this.setData(originData)

      // 打点
      const shopId = data.basic.shop.id
      this.trackerService.point(req, res, {
        eventType: TrackerType.BXMAINSITE, data: {
          event_type: TrackerType.BXMAINSITE,
          site_id: 'dianpu',
          shop_id: shopId,
          pageType: 'view_ad',
          tracktype: 'pageview',
          _platform: device,
          contentType: 'article',
          category: '',
        }
      })

      const { templateId } = data.basic.shop
      const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/news-detail/index`
      const { kf53 } = data.basic.contact;
      const currentPathname = req.originalUrl;
      const trackId = this.trackerService.getTrackId(req, res)
      return res.render(templateUrl, { title: '资讯详情', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId, userInfo }, isDetail: true });
    } else {
      const currentPage = query.page || 1;
      const { data: originData } = await this.midwayApiService.getNewsCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0 }, domain);
      const data = this.setData(originData)

      // 打点
      const shopId = data.basic.shop.id
      this.trackerService.point(req, res, {
        eventType: TrackerType.BXMAINSITE, data: {
          event_type: TrackerType.BXMAINSITE,
          site_id: 'dianpu',
          shop_id: shopId,
          pageType: 'view_ad',
          _platform: device,
          tracktype: 'pageview',
          contentType: 'article',
          category: '',
        }
      })
      const { templateId } = data.basic.shop
      const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/news/index`;
      const currentPathname = req.originalUrl;
      const { kf53 } = data.basic.contact;
      const trackId = this.trackerService.getTrackId(req, res)
      return res.render(templateUrl, { title: '资讯子类', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo } });
    }
  }

  @Get('/p')
  async product(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const currentPage = query.page || 1
    const { data: originData } = await this.midwayApiService.getProductPageData(shopName, device, { page: currentPage, size: 5 }, domain);
    const data = this.setData(originData)
    // 打点
    const shopId = data.basic.shop.id
    this.trackerService.point(req, res, {
      eventType: TrackerType.BXMAINSITE, data: {
        event_type: TrackerType.BXMAINSITE,
        site_id: 'dianpu',
        shop_id: shopId,
        pageType: 'view_listing',
        _platform: device,
        tracktype: 'pageview',
        contentType: 'product',
        category: '',
      }
    })
    const { templateId } = data.basic.shop
    const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/product/index`;
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)
    return res.render(templateUrl, { title: '产品服务', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo } });
  }

  @Get('/p-:id')
  async productchild(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    if (/.html$/.test(req.url)) {
      const productId = params.id.split(".")[0]
      const { data: originData } = await this.midwayApiService.getProductDetailData(shopName, device, { id: productId }, domain);
      const data = this.setData(originData)
      // 打点
      const shopId = data.basic.shop.id
      this.trackerService.point(req, res, {
        eventType: TrackerType.BXMAINSITE, data: {
          event_type: TrackerType.BXMAINSITE,
          site_id: 'dianpu',
          shop_id: shopId,
          pageType: 'view_ad',
          _platform: device,
          tracktype: 'pageview',
          contentType: 'product',
          category: '',
        }
      })
      const { templateId } = data.basic.shop
      const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/product-detail/index`
      const { kf53 } = data.basic.contact;
      const currentPathname = req.originalUrl;
      const trackId = this.trackerService.getTrackId(req, res)
      return res.render(templateUrl, { title: '产品详情', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId, userInfo }, isDetail: true });
    } else {
      const currentPage = query.page || 1;
      const { data: originData } = await this.midwayApiService.getProductCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0 }, domain);
      const data = this.setData(originData)
      // 打点
      const shopId = data.basic.shop.id
      this.trackerService.point(req, res, {
        eventType: TrackerType.BXMAINSITE, data: {
          event_type: TrackerType.BXMAINSITE,
          site_id: 'dianpu',
          shop_id: shopId,
          pageType: 'view_ad',
          _platform: device,
          tracktype: 'pageview',
          contentType: 'product',
          category: '',
        }
      })
      const { templateId } = data.basic.shop
      const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/product/index`;
      const currentPathname = req.originalUrl;
      const { kf53 } = data.basic.contact;
      const trackId = this.trackerService.getTrackId(req, res)
      return res.render(templateUrl, { title: '服务子类', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo } });
    }
  }

  //关于我们
  @Get('/about')
  async about(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const { data: originData } = await this.midwayApiService.getAboutPageData(shopName, device, domain);
    const data = this.setData(originData)

    // 打点
    const shopId = data.basic.shop.id
    this.trackerService.point(req, res, {
      eventType: TrackerType.BXMAINSITE, data: {
        event_type: TrackerType.BXMAINSITE,
        site_id: 'dianpu',
        shop_id: shopId,
        pageType: 'view_listing',
        contentType: 'article',
        category: '',
        _platform: device,
        tracktype: 'pageview',
        refer: ''
      }
    })
    const { templateId } = data.basic.shop
    const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/about/index`;
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)

    return res.render(templateUrl, { title: '关于我们', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId, userInfo } });
  }


  // 处理搜索来的数据 因为页面需要切换分类，pc端还需要人工分页，而js与pug又很难交互，通过jq去拷贝节点循环渲染感觉很绕，所以选择点击分页重新渲染页面，这种胶水层统一处理数据，通过contentList 来输出页面需要的list。
  // 产品列表页 单页数量  b2b:24    b2c:6
  // 文章列表页 单页数量  b2b:8    b2c:8
  private setSearchData(data, @UserAgent('device') device, currentPage: number, type: 'product' | 'news', key: string) {
    let pageNum = 8
    data.contentList = {
      result: [],
      totalPage: 0
    }
    const start = (currentPage - 1) * pageNum
    const { articleResults, productResults, keyword } = data.searchResult
    if (type === 'news') {
      data.contentList.result = articleResults.slice(start, start + pageNum)
      data.contentList.totalPage = Math.ceil(articleResults.length / pageNum)
      data.contentList.totalRecord = articleResults.length
    } else {
      // 模板二 
      //  "5fb387d2f2db3f6b8e7080e5": "site-template-1",
      // "5fb387d2f2db3f6b8e7080e6": "site-template-2",
      // "7397650bdc5446a36d6d643e": "site-template-3"
      if (data.basic.shop.templateId === '5fb387d2f2db3f6b8e7080e6') {
        pageNum = 24
      } else {
        pageNum = 6
      }
      data.contentList.result = productResults.slice(start, start + pageNum)
      data.contentList.totalPage = Math.ceil(productResults.length / pageNum)
      data.contentList.totalRecord = productResults.length
    }
    data.contentType = type
    data.contentKey = keyword
    return data
  }


  // 搜索聚合页
  @Get('/search')
  async search(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const currentPage = query.page || 1
    const searchKey = query.key || ''
    const searchType = query.type || 'product'
    const { data: originData } = await this.midwayApiService.getSearchPageData(shopName, device, {
      keyword: searchKey
    }, domain);
    // 这里做统一处理
    const data = this.setSearchData(this.setData(originData), device, currentPage, searchType, searchKey)
    // 打点
    const shopId = data.basic.shop.id
    this.trackerService.point(req, res, {
      eventType: TrackerType.BXMAINSITE, data: {
        event_type: TrackerType.BXMAINSITE,
        site_id: 'dianpu',
        shop_id: shopId,
        pageType: 'view_listing',
        _platform: device,
        tracktype: 'pageview',
        contentType: 'search',
        category: '',
      }
    })
    const { templateId } = data.basic.shop
    const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/search/index`;
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)
    return res.render(templateUrl, { title: '搜索', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo } });
  }
}