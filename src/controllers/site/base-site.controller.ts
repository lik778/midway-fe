import { Get, HostParam, Param, Query, Req, Res } from '@nestjs/common';
import { SiteService } from '../../services/site.service';
import { query, Request, Response } from 'express';
import { UserAgent } from '../../decorator/user-agent.decorator';
import { DomainTypeEnum, SearchTypeEnum } from '../../enums';
import { TrackerService } from '../../services/tracker.service';
import { TrackerType } from '../../enums/tracker';
import { COOKIE_HASH_KEY, COOKIE_TOKEN_KEY, COOKIE_USER_KEY } from '../../constant/cookie';

//模板页面基础控制器，进行数据请求和打点
export class BaseSiteController {
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

  private checkCn(HostDomain: string) {
    // https://www.tapd.cn/20097551/prong/stories/view/1120097551001038611
    return HostDomain === 'cn' ? true : undefined
  }

  private checkSem(sem: string | undefined, bannerId: string | undefined, account: string) {
    // https://www.tapd.cn/20097551/prong/stories/view/1120097551001039216
    // sem = 2 头条
    // sem = 1 百度处理过的样式


    //sem = 2 头条投放
    if (sem === '2') {
      return '2'
    }

    // 
    if (account === '0' || account === '2') {
      return '1'
    } else if (account === '1') {
      return undefined
    }

    // 其他
    return undefined
  }

  private replaceMobile(string: string) {
    // https://www.tapd.cn/20095111/prong/stories/view/1120095111001038653 内容去掉手机号
    return string.replace(/\d{3,}/ig, function (sMatch) {
      return sMatch.replace(/./g, "*");
    })
  }

  // 对数据做兼容 ， 防止报错
  private setData(data, isSem, isCn) {
    if (!data.basic.company) {
      data.basic.company = {
        name: '',
        address: ''
      }
    }
    if (!data.basic.contact) {
      data.basic.contact = {
        qq: {}, phone: { content: '' }, phone2: { content: '' }, weChat: {}, contactName: {}, kf53StyleUrl: '', kf53: '', union400: []
      }
    }

    if (!data.basic.shop.navInfo) {
      data.basic.shop.navInfo = {
        qrImg: '',
        slogan: ''
      }
    }

    data.basic.company.about = data.basic.company.about || '我们公司拥有雄厚的资本和资源，是经过长时间积累而成长壮大起来的企业，一直以来，坚持不断创新，提高公司核心竞争优势。重视用户的服务体验，将客户、产品与服务三合一放在同一重点维度上，以提升客户满意度为宗旨，欢迎大家来电咨询。'
    // 如果是sem情况下需要对数据做联系方式过滤
    if (isSem === '1') {
      data.basic.company.about = this.replaceMobile(data.basic.company.about)
    }

    const defaultAutoConfig1 = {
      mainModuleTitle: '企业优势', show: true,
      subModuleBos: [
        { title: '质量在心中', content: '将产品质量与企业荣耀挂钩，踏踏实实地进行至今' },
        { title: '名牌在手中', content: '以诚心待客户，口碑已积累在多年，当前在行业内小有名气，有口皆碑' },
        { title: '责任在肩上', content: '坚持做到物美价廉，物有所值，让消费者放心' },
        { title: '诚信在言行中', content: '重承诺，重言行，拿客户满意作为衡量服务的标准' }]
    }

    const defaultAutoConfig2 = {
      mainModuleTitle: '服务优势', show: true,
      subModuleBos: [{ title: '口碑载道', content: '重视信誉和口碑，客户忠实度高', urlImg: '//file.baixing.net/202110/9851dfe60a5df417b85788ba393460e7.png' }, { title: '资质正规', content: '相关资质均有工商备案，资质可查，公司正规', urlImg: '//file.baixing.net/202110/a86515893a4e2bf9d2dda1dd51d94d1a.png' }, { title: '贴心服务', content: '全方位的售前售后服务，提高客户满意度', urlImg: '//file.baixing.net/202110/43373c5e79d64d90db73dff93ac82721.png' }, { title: '售后保障', content: '完善的售后服务体系和严格的管理制度，客户至上', urlImg: '//file.baixing.net/202110/b8f7486b576631f5d13d9f3ec7f5b1b1.png' }]
    }

    if (!data.autoConfig) {
      data.autoConfig = {
        1: defaultAutoConfig1,
        2: defaultAutoConfig2
      }
    } else {
      let newAutoConfig = {
        3: data.autoConfig[3]
      }
      if (!data.autoConfig[1] || (data.autoConfig[1].show && (!data.autoConfig[1].subModuleBos || data.autoConfig[1].subModuleBos.length === 0))) {
        newAutoConfig[1] = defaultAutoConfig1
      } else {
        newAutoConfig[1] = data.autoConfig[1]
      }
      if (!data.autoConfig[2] || (data.autoConfig[2].show && (!data.autoConfig[2].subModuleBos || data.autoConfig[2].subModuleBos.length === 0))) {
        newAutoConfig[2] = defaultAutoConfig2
      } else {
        newAutoConfig[2] = data.autoConfig[2]
      }
      data.autoConfig = newAutoConfig
    }

    data.navigation.forEach(item => {
      if (item.content.endsWith('/contact/')) {
        item.content = `${data.navigation[0].content}#contactFormBox`
      }
    })

    return data
  }

  private createParams(isSem, isCn) {
    return {
      semKeyWordFlag: isSem === "1" ? 1 : 0,
      cnKeyWordFlag: isCn ? 1 : 0
    }
  }


  @Get('/')
  public async home(@Query() query, @Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    // 当参数里添加sem 则说明要切换为sem页
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
    const { data: originData } = await this.midwayApiService.getHomePageData(shopName, device, this.createParams(isSem, isCn), domain);
    const data = this.setData(originData, isSem, isCn)
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
    const pageTemplate = SiteService.templateMapping[templateId]
    const templateUrl = `${pageTemplate}/${device}/home/index`
    const { kf53 } = data.basic.contact;
    const currentPathname = req.originalUrl;
    const trackId = this.trackerService.getTrackId(req, res)
    this.checkCn(HostDomain)
    return res.render(templateUrl, { title: '首页', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId, userInfo }, isHome: true, isSem, isCn, isAccount, pageTemplate, pageType: 'home', contentType: '', pageStartRenderTime: new Date().getTime() });
  }

  @Get('/n')
  async listing(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const currentPage = query.page || 1;
    const { data: originData } = await this.midwayApiService.getNewsPageData(shopName, device, { page: currentPage, ...this.createParams(isSem, isCn) }, domain);
    const data = this.setData(originData, isSem, isCn)

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
    const pageTemplate = SiteService.templateMapping[templateId]
    const templateUrl = `${pageTemplate}/${device}/news/index`
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)


    return res.render(templateUrl, { title: '新闻资讯', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo }, isSem, isCn, isAccount, pageTemplate, pageType: 'listing', contentType: 'article', pageStartRenderTime: new Date().getTime() });
  }

  @Get('/nl:id')
  async newsListing(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)

    const currentPage = query.page || 1;

    const id = params.id.replace('.html', '').replace('-', '')

    const { data: originData } = await this.midwayApiService[id ? 'getNewsCateData' : 'getNewsPageData'](shopName, device, { cateId: id, page: currentPage, ...this.createParams(isSem, isCn) }, domain);
    const data = this.setData(originData, isSem, isCn)

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
        contentType: 'article',
        category: '',
      }
    })
    const { templateId } = data.basic.shop
    const pageTemplate = SiteService.templateMapping[templateId]
    const templateUrl = `${pageTemplate}/${device}/news/index`
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)


    return res.render(templateUrl, { title: '新闻资讯', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo }, isSem, isCn, isAccount, pageTemplate, pageType: 'listing', contentType: 'article', pageStartRenderTime: new Date().getTime() });
  }

  @Get('/n-:id')
  async newschild(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)

    if (/.html/.test(req.url)) {
      const newsId = params.id.split(".")[0]
      const { data: originData } = await this.midwayApiService.getNewsDetailData(shopName, device, { id: newsId, ...this.createParams(isSem, isCn) }, domain);
      const data = this.setData(originData, isSem, isCn)

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
      const pageTemplate = SiteService.templateMapping[templateId]
      const templateUrl = `${pageTemplate}/${device}/news-detail/index`
      const { kf53 } = data.basic.contact;
      const currentPathname = req.originalUrl;
      const trackId = this.trackerService.getTrackId(req, res)

      if (isSem === '1') {
        if (data.articleInfo && data.articleInfo.content) {
          data.articleInfo.content = this.replaceMobile(data.articleInfo.content)
        }
      }
      return res.render(templateUrl, { title: '资讯详情', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId, userInfo }, isDetail: true, isSem, isCn, isAccount, pageTemplate, pageType: 'viewad', contentType: 'article', pageStartRenderTime: new Date().getTime() });
    } else {
      const currentPage = query.page || 1;
      const { data: originData } = await this.midwayApiService.getNewsCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0, ...this.createParams(isSem, isCn) }, domain);
      const data = this.setData(originData, isSem, isCn)

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
          contentType: 'article',
          category: '',
        }
      })
      const { templateId } = data.basic.shop
      const pageTemplate = SiteService.templateMapping[templateId]
      const templateUrl = `${pageTemplate}/${device}/news/index`;
      const currentPathname = req.originalUrl;
      const { kf53 } = data.basic.contact;
      const trackId = this.trackerService.getTrackId(req, res)
      return res.render(templateUrl, { title: '资讯子类', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo }, isSem, isCn, isAccount, pageTemplate, pageType: 'listing', contentType: 'article', pageStartRenderTime: new Date().getTime() });
    }
  }

  @Get('/p')
  async product(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const currentPage = query.page || 1
    const { data: originData } = await this.midwayApiService.getProductPageData(shopName, device, { page: currentPage, size: 5, ...this.createParams(isSem, isCn) }, domain);
    const data = this.setData(originData, isSem, isCn)
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
    const pageTemplate = SiteService.templateMapping[templateId]
    const templateUrl = `${pageTemplate}/${device}/product/index`;
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)

    return res.render(templateUrl, { title: '产品服务', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo }, isSem, isCn, isAccount, pageTemplate, pageType: 'listing', contentType: 'product', pageStartRenderTime: new Date().getTime() });
  }

  @Get('/pl:id')
  async productListing(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const currentPage = query.page || 1

    const id = params.id.replace('.html', '').replace('-', '')

    const { data: originData } = await this.midwayApiService[id ? 'getProductCateData' : 'getProductPageData'](shopName, device, { cateId: id, page: currentPage, size: 5, ...this.createParams(isSem, isCn) }, domain);
    const data = this.setData(originData, isSem, isCn)
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
    const pageTemplate = SiteService.templateMapping[templateId]
    const templateUrl = `${pageTemplate}/${device}/product/index`;
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)

    return res.render(templateUrl, { title: '产品服务', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo }, isSem, isCn, isAccount, pageTemplate, pageType: 'listing', contentType: 'product', pageStartRenderTime: new Date().getTime() });
  }

  @Get('/p-:id')
  async productchild(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)

    // TODO FIXME
    if (/.html/.test(req.url)) {
      const productId = params.id.split(".")[0]
      const { data: originData } = await this.midwayApiService.getProductDetailData(shopName, device, { id: productId, ...this.createParams(isSem, isCn) }, domain);
      const data = this.setData(originData, isSem, isCn)

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
      const pageTemplate = SiteService.templateMapping[templateId]
      const templateUrl = `${pageTemplate}/${device}/product-detail/index`
      const { kf53 } = data.basic.contact;
      const currentPathname = req.originalUrl;
      const trackId = this.trackerService.getTrackId(req, res)


      // 如果是sem情况下需要对数据做联系方式过滤
      if (isSem === '1') {
        if (data.productInfo && data.productInfo.content) {
          data.productInfo.content = this.replaceMobile(data.productInfo.content)
        }
      }

      return res.render(templateUrl, { title: '产品详情', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId, userInfo }, isDetail: true, isSem, isCn, isAccount, pageTemplate, pageType: 'viewad', contentType: 'product', pageStartRenderTime: new Date().getTime() });
    } else {
      const currentPage = query.page || 1;
      const { data: originData } = await this.midwayApiService.getProductCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0, ...this.createParams(isSem, isCn) }, domain);
      const data = this.setData(originData, isSem, isCn)
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
      const pageTemplate = SiteService.templateMapping[templateId]
      const templateUrl = `${pageTemplate}/${device}/product/index`;
      const currentPathname = req.originalUrl;
      const { kf53 } = data.basic.contact;
      const trackId = this.trackerService.getTrackId(req, res)
      return res.render(templateUrl, { title: '服务子类', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId, userInfo }, isSem, isCn, isAccount, pageTemplate, pageType: 'listing', contentType: 'product', pageStartRenderTime: new Date().getTime() });
    }
  }

  //关于我们
  @Get('/about')
  async about(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const { data: originData } = await this.midwayApiService.getAboutPageData(shopName, device, this.createParams(isSem, isCn), domain);
    const data = this.setData(originData, isSem, isCn)

    // 打点
    const shopId = data.basic.shop.id
    this.trackerService.point(req, res, {
      eventType: TrackerType.BXMAINSITE, data: {
        event_type: TrackerType.BXMAINSITE,
        site_id: 'dianpu',
        shop_id: shopId,
        pageType: 'about',
        contentType: '',
        category: '',
        _platform: device,
        tracktype: 'pageview',
        refer: ''
      }
    })
    const { templateId } = data.basic.shop
    const pageTemplate = SiteService.templateMapping[templateId]
    const templateUrl = `${pageTemplate}/${device}/about/index`;
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)


    return res.render(templateUrl, { title: '关于我们', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId, userInfo }, isSem, isCn, isAccount, pageTemplate, pageType: 'about', contentType: '', pageStartRenderTime: new Date().getTime() });
  }


  // 处理搜索来的数据 
  private setSearchData(data, @UserAgent('device') device, currentPage: number, type: 'product' | 'news', key: string) {
    data.contentList = data.searchResult.result
    data.contentType = type
    data.contentKey = key
    data.contentPage = currentPage
    return data
  }

  // 搜索聚合页
  @Get('/search')
  async search(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const currentPage = query.page || 1
    const searchKey = query.key || ''
    const searchType = query.type || 'product'
    const { data: originData } = await this.midwayApiService.getSearchPageData(shopName, device, {
      keyword: searchKey, page: currentPage, type: SearchTypeEnum[searchType as keyof SearchTypeEnum],
      ...this.createParams(isSem, isCn)
    }, domain);

    // 这里做统一处理
    const data = this.setSearchData(this.setData(originData, isSem, isCn), device, currentPage, searchType, searchKey)

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
    const pageTemplate = SiteService.templateMapping[templateId]
    const templateUrl = `${pageTemplate}/${device}/search/index`;
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)


    return res.render(templateUrl, {
      title: '搜索', renderData: { ...data, searchKey, shopName, kf53, shopId, trackId, userInfo, domainType: this.domainType, currentPage, currentPathname }, isSem, isCn, isAccount, pageTemplate, pageType: 'listing', contentType: 'search', pageStartRenderTime: new Date().getTime()
    })
  }
}