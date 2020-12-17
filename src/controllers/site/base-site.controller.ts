import { Get, HostParam, Param, Query, Req, Res } from '@nestjs/common';
import { MidwayService } from '../../services/midway.service';
import { Request, Response } from 'express';
import { UserAgent } from '../../decorator';
import { DomainTypeEnum } from '../../enums';

export class BaseSiteController {
  constructor(protected readonly midwayApiService: MidwayService, protected domainType: DomainTypeEnum) {}

  @Get('/')
  public async home(@Param() params, @HostParam('shopName') HostShopName: string, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    let shopName = ''
    const domain = req.hostname
    if (this.domainType === DomainTypeEnum.FUWU) {
      shopName = this.midwayApiService.getShopName(params.shopName)
      if (!/\/$/.test(req.path)) {
        res.redirect(`/${shopName}/`)
        return
      }
    } else if (this.domainType === DomainTypeEnum.B2B) {
      shopName = HostShopName
    }
    const templateUrl = `site-template-1/${device}/home/index`
    const { data } = await this.midwayApiService.getHomePageData(shopName, device, domain);
    return res.render(templateUrl, { title: '首页', renderData: { ...data, shopName, domainType: this.domainType }, isHome: true });
  }

  @Get('/n')
  async listing(@Param() params, @HostParam('shopName') HostShopName: string,
      @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const currentPage = query.page || 1;
    const { data } = await this.midwayApiService.getNewsPageData(shopName, device, { page: currentPage, size: 0 }, domain);
    const templateUrl = `site-template-1/${device}/news/index`;
    const currentPathname = req.originalUrl;
    return res.render(templateUrl, { title: '新闻资讯', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname } });
  }

  @Get('/n-:id')
  async newschild(@Param() params, @HostParam('shopName') HostShopName: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    if (/.html$/.test(req.url)) {
      const newsId = params.id.split(".")[0]
      const { data } = await this.midwayApiService.getNewsDetailData(shopName, device, { id: newsId }, domain);
      const templateUrl = `site-template-1/${device}/news-detail/index`
      return res.render(templateUrl, { title: '资讯详情', renderData: { ...data, shopName, domainType: this.domainType } });
    } else {
      const currentPage = query.page || 1;
      const { data } = await this.midwayApiService.getNewsCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0 }, domain);
      const templateUrl = `site-template-1/${device}/news-child/index`;
      const currentPathname = req.originalUrl;
      return res.render(templateUrl, { title: '资讯子类', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname } });
    }
  }

  @Get('/p')
  async product(@Param() params, @HostParam('shopName') HostShopName: string,
      @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const currentPage = query.page || 1
    const { data } = await this.midwayApiService.getProductPageData(shopName, device, { page: currentPage, size: 5 }, domain);
    const templateUrl = `site-template-1/${device}/product/index`;
    const currentPathname = req.originalUrl;
    return res.render(templateUrl, { title: '产品服务', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname } });
  }

  @Get('/p-:id')
  async productchild(@Param() params, @HostParam('shopName') HostShopName: string,
           @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    if (/.html$/.test(req.url)) {
      const productId = params.id.split(".")[0]
      const { data } = await this.midwayApiService.getProductDetailData(shopName, device, { id: productId }, domain);
      const templateUrl = `site-template-1/${device}/product-detail/index`
      return res.render(templateUrl, { title: '产品详情页', renderData: { ...data, shopName, domainType: this.domainType } });
    } else {
      const currentPage = query.page || 1;
      const { data } = await this.midwayApiService.getProductCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0 }, domain);
      const templateUrl = `site-template-1/${device}/product-child/index`;
      const currentPathname = req.originalUrl;
      return res.render(templateUrl, { title: '服务子类', renderData: { ...data, shopName, domainType: this.domainType, currentPage, currentPathname } });
    }
  }
}
