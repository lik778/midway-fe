import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { UserAgent } from '../decorator';
import { MidwayService } from '../services/midway.service';
import { Request, Response } from 'express';

@Controller('/:shopName')
export class SiteController {
  constructor(private midwayApiService: MidwayService) {}

  @Get('/')
  public async home(@Param() params, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
      const shopName = this.midwayApiService.getShopName(params.shopName)
      const templateUrl = `site-template-1/${device}/home/index`
      const { data } = await this.midwayApiService.getHomePageData(shopName, device);
      return res.render(templateUrl, { title: '首页', renderData: { ...data, shopName }, isHome: true });
  }

  @Get('/n')
  async listing(@Param() params, @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    //console.log(req.originalUrl)
    const shopName = this.midwayApiService.getShopName(params.shopName)
    const currentPage = query.page || 1;
    const { data } = await this.midwayApiService.getNewsPageData(shopName, device, { page: currentPage, size: 0 });
    const templateUrl = `site-template-1/${device}/news/index`;
    const currentPathname = req.originalUrl;
    return res.render(templateUrl, { title: '新闻资讯', renderData: { ...data, shopName, currentPage, currentPathname } });
  }

  @Get('/n-:id')
  async newschild(@Param() params, @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    if (/.html$/.test(req.url)) {
        const shopName = this.midwayApiService.getShopName(params.shopName)
        const newsId = params.id.split(".")[0]
        const { data } = await this.midwayApiService.getNewsDetailData(shopName, device, { id: newsId });
        const templateUrl = `site-template-1/${device}/news-detail/index`
      return res.render(templateUrl, { title: '资讯详情', renderData: { ...data, shopName } });
    } else {
      //console.log(req.path)
      const shopName = this.midwayApiService.getShopName(params.shopName)
      const currentPage = query.page || 1;
      const { data } = await this.midwayApiService.getNewsCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0 });
      const templateUrl = `site-template-1/${device}/news-child/index`;
      const currentPathname = req.originalUrl;
      return res.render(templateUrl, { title: '资讯子类', renderData: { ...data, shopName, currentPage, currentPathname } });
    }
  }

  @Get('/p')
  async product(@Param() params, @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    //console.log(req.path)
    const shopName = this.midwayApiService.getShopName(params.shopName)
    const currentPage = query.page || 1
    const { data } = await this.midwayApiService.getProductPageData(shopName, device, { page: currentPage, size: 5 });
    const templateUrl = `site-template-1/${device}/product/index`;
    const currentPathname = req.originalUrl;
    return res.render(templateUrl, { title: '产品服务', renderData: { ...data, shopName, currentPage, currentPathname } });
  }

  @Get('/p-:id')
  async productchild(@Param() params, @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    if (/.html$/.test(req.url)) {
      const shopName = this.midwayApiService.getShopName(params.shopName)
      const productId = params.id.split(".")[0]
      const { data } = await this.midwayApiService.getProductDetailData(shopName, device, { id: productId });
      const templateUrl = `site-template-1/${device}/product-detail/index`
      return res.render(templateUrl, { title: '产品详情页', renderData: { ...data, shopName } });
    } else {
      //console.log('11',req.res)
      const shopName = this.midwayApiService.getShopName(params.shopName)
      const currentPage = query.page || 1;
      const { data } = await this.midwayApiService.getProductCateData(shopName, device, { cateId: params.id, page: currentPage, size: 0 });
      const templateUrl = `site-template-1/${device}/product-child/index`;
      const currentPathname = req.originalUrl;
      return res.render(templateUrl, { title: '服务子类', renderData: { ...data, shopName, currentPage, currentPathname } });
    }
  }
}
