import { Get, HostParam, Param, Query, Req, Res } from '@nestjs/common';
import { SiteService } from '../../services/site.service';
import { Request, Response } from 'express';
import { UserAgent } from '../../decorator/user-agent.decorator';
import { DomainTypeEnum } from '../../enums';
import { TrackerService } from '../../services/tracker.service';
import { TrackerType } from '../../enums/tracker';

//模板页面基础控制器，进行数据请求和打点
export class BaseSiteController {
  constructor(protected readonly midwayApiService: SiteService,
    protected readonly trackerService: TrackerService,
    protected domainType: DomainTypeEnum) { }

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

    const { data } = await this.midwayApiService.getHomePageData(shopName, device, domain);

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
    return res.render(templateUrl, { title: '首页', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId }, isHome: true });
  }

  @Get('/n')
  async listing(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const currentPage = query.page || 1;
    const { data } = await this.midwayApiService.getNewsPageData(shopName, device, { page: currentPage }, domain);
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
    // let templateUrl
    // if(templateId === '7397650bdc5446a36d6d643e'){
    //   templateUrl = `site-template-1/${device}/news/index`;
    // }else {
    //   templateUrl = `${SiteService.templateMapping[templateId]}/${device}/news/index`
    // }
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)
    return res.render(templateUrl, { title: '新闻资讯', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId } });
  }

  @Get('/n-:id')
  async newschild(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    if (/.html$/.test(req.url)) {
      const newsId = params.id.split(".")[0]
      const { data } = await this.midwayApiService.getNewsDetailData(shopName, device, { id: newsId }, domain);
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
      // let templateUrl
      // if(templateId === '7397650bdc5446a36d6d643e'){
      //   templateUrl = `site-template-1/${device}/news-detail/index`;
      // }else {
      //   templateUrl = `${SiteService.templateMapping[templateId]}/${device}/news-detail/index`
      // }
      const { kf53 } = data.basic.contact;
      const currentPathname = req.originalUrl;
      const trackId = this.trackerService.getTrackId(req, res)
      //console.log(data.articleInfo.content)
      return res.render(templateUrl, { title: '资讯详情', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId }, isDetail: true });
    } else {
      const currentPage = query.page || 1;
      const { data } = await this.midwayApiService.getNewsCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0 }, domain);
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
      // let templateUrl
      // if(templateId === '7397650bdc5446a36d6d643e'){
      //   templateUrl = `site-template-1/${device}/news/index`;
      // }else {
      //   templateUrl = `${SiteService.templateMapping[templateId]}/${device}/news/index`
      // }
      const currentPathname = req.originalUrl;
      const { kf53 } = data.basic.contact;
      const trackId = this.trackerService.getTrackId(req, res)
      return res.render(templateUrl, { title: '资讯子类', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId } });
    }
  }

  @Get('/p')
  async product(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const currentPage = query.page || 1
    const { data } = await this.midwayApiService.getProductPageData(shopName, device, { page: currentPage, size: 5 }, domain);
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
    // let templateUrl
    // if(templateId === '7397650bdc5446a36d6d643e'){
    //   templateUrl = `site-template-1/${device}/product/index`;
    // }else {
    //   templateUrl = `${SiteService.templateMapping[templateId]}/${device}/product/index`
    // }
    const currentPathname = req.originalUrl;
    const { kf53 } = data.basic.contact;
    const trackId = this.trackerService.getTrackId(req, res)
    return res.render(templateUrl, { title: '产品服务', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId } });
  }

  @Get('/p-:id')
  async productchild(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    if (/.html$/.test(req.url)) {
      const productId = params.id.split(".")[0]
      const { data } = await this.midwayApiService.getProductDetailData(shopName, device, { id: productId }, domain);
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
      // let templateUrl
      // if(templateId === '7397650bdc5446a36d6d643e'){
      //   templateUrl = `site-template-1/${device}/product-detail/index`;
      // }else {
      //   templateUrl = `${SiteService.templateMapping[templateId]}/${device}/product-detail/index`
      // }
      const { kf53 } = data.basic.contact;
      const currentPathname = req.originalUrl;
      const trackId = this.trackerService.getTrackId(req, res)
      return res.render(templateUrl, { title: '产品详情页', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId }, isDetail: true });
    } else {
      const currentPage = query.page || 1;
      const { data } = await this.midwayApiService.getProductCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0 }, domain);
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
      const templateUrl = `${SiteService.templateMapping[templateId]}/${device}/product-child/index`;
      // let templateUrl
      // if(templateId === '7397650bdc5446a36d6d643e'){
      //   templateUrl = `site-template-1/${device}/product-child/index`;
      // }else {
      //   templateUrl = `${SiteService.templateMapping[templateId]}/${device}/product-child/index`
      // }
      const currentPathname = req.originalUrl;
      const { kf53 } = data.basic.contact;
      const trackId = this.trackerService.getTrackId(req, res)
      return res.render(templateUrl, { title: '服务子类', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname, kf53, shopId, trackId } });
    }
  }

  //关于我们
  @Get('/about')
  async about(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const { data } = await this.midwayApiService.getAboutPageData(shopName, device, domain);
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
    return res.render(templateUrl, { title: '关于我们', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId } });
  }
}

