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
    // 对shop中的color做兜底
    if(data.basic.shop.color === null) {
      data.basic.shop.color =    { // 蓝色版本
        officialInfo: {  // 头部-公司名称右侧
          icon: '//file.baixing.net/202204/31715156aa6c8440f1a3e27ea78a9045.png',
          telC: '#336FFF'
        },
        officialNav: { // 导航栏
          navBg: '#336FFF',
          navHv: '#0153FF'
        },
        baseSwiper: '#336FFF', // swiper
        totalTip: '#336FFF', // 全局的主题色
        serveAd1: { // 最上方服务优势
          adColor: '#3376FF',
          adTip: '#FCAB04',
          adHv: '#336FFF'
        },
        productHv: '#336FFF', //热门产品
        about: '#336FFF', // 关于我们
        serveTel: { // 24小时服务热线
          consultImg: '//file.baixing.net/202205/3fa7596d8dc95e75f768d92e1979e0a4.png',
          consultCo: '#FFFFFF',
          consultBg: '#FDAB00'
        },
        serveAd2: {
          serviceThe: '#3571FF',
          serviceNum: '#3571FF'
        }, // 最下方服务优势
        productCat: { // 热门产品分类
          catTheme: '#336FFF',
          catHo: '#336FFF',
          catBg: '//file.baixing.net/202204/c29c21254f8b758904d6e0236f91372b.png',
          catIcon: '//file.baixing.net/202204/eadcd4817ac82657b4b73fe21a8aa10e.png',
        },
        newsAd: '#336FFF', // 新闻优势
        contact: { // 联系方式
          concatTheme: '#336FFF',
          concatBg: '//file.baixing.net/202204/dbc59b195c64f3e2583ffbce6bc0a4ca.png',
          buttonColor: '#477DFF',
          buttonBg: '#336FFF'
        },
        wap: {
          contactUs: '//file.baixing.net/202205/621b496ea6ba538d0e71335a4cb00a74.png',
          advisoryMe: '//file.baixing.net/202205/61cd853628e62921bcdaf2445a721d7e.png',
          people: '//file.baixing.net/202205/6ac29c804640447497ecc4ed2f1de822.png',
          weixin: '//file.baixing.net/202205/bbf84d26b7326c13bff306c8d92202cd.png',
          tag: '#FDAA02',
          SecondaryMenu: 'rgba(234, 241, 255, 1)',
          introduce: 'linear-gradient(121deg, #FAEBDB 0%, #FEF8F0 100%)',
          contactBg: 'linear-gradient(90deg, #5C8AFF 0%, #336FFF 100%)',
        }
      }
    }
    /**
    [
      { // 红色版本
        officialInfo: {  // 头部-公司名称右侧
          icon: '//file.baixing.net/202204/3cc0a982890ee12761aa8f6e5d20e7ea.png',
          telC: '#C50306'
        },
        officialNav: { // 导航栏
          navBg: 'linear-gradient(180deg, #515254 0%, #363537 100%)',
          navHv: '#D8010D'
        },
        baseSwiper: '#D20306', // swiper
        totalTip: '#D8010D', // 每个模块标题下面的tip背景色
        serveAd1: { // 最上方服务优势
          adColor: '#323233',
          adTip: '#D20306',
          adHv: '#323233 '
        },
        productHv: '#D8010D', //热门产品
        about: '#323233', // 关于我们
        serveTel: { // 24小时服务热线
          consultImg: '//file.baixing.net/202205/fb63d2dc6e08e697f2169b9006eb5e58.png',
          consultCo: '#D20306',
          consultBg: '#FFFFFF '
        },
        serveAd2: {  // 最下方服务优势
          serviceThe: '#D8010D',
          serviceNum: '#D8010D'
        },
        productCat: { // 热门产品分类
          catTheme: '#D8010D',
          catHo: '#D8010D',
          catBg: '//file.baixing.net/202204/fb63d2dc6e08e697f2169b9006eb5e58.png',
          catIcon: '//file.baixing.net/202204/f890c8e2db6c9191a0b7f135be477d87.png',
        },
        newsAd: '#D8010D', // 新闻优势
        contact: { // 联系方式
          concatTheme: '#D8010D',
          concatBg: '//file.baixing.net/202204/4c54c51c97c23845ddffd180bbff42c1.png',
          buttonColor: '#E42732',
          buttonBg: '#E42732'
        },
        wap: {
          contactUs: '//file.baixing.net/202205/2cd08f2e6d3465dc7ab60ebf4d0b737e.png',
          advisoryMe: '//file.baixing.net/202205/c0219e24f017498fe85f11d9eda5245a.png',
          people: '//file.baixing.net/202205/c8b696931303ef5fd2623c23fcf7ae22.png',
          weixin: '//file.baixing.net/202205/12c84eed52415156c3635d6d426c5392.png',
          tag: '#FA6601',
          SecondaryMenu: 'rgba(255, 241, 241, 1)',
          introduce: 'linear-gradient(121deg, #FAE2DB 0%, #FEF8F0 100%)',
          contactBg: 'linear-gradient(90deg, #FFA75C 0%, #EF1F1F 100%)',
        }
      },
      { // 蓝色版本
        officialInfo: {  // 头部-公司名称右侧
          icon: '//file.baixing.net/202204/31715156aa6c8440f1a3e27ea78a9045.png',
          telC: '#336FFF'
        },
        officialNav: { // 导航栏
          navBg: '#336FFF',
          navHv: '#0153FF'
        },
        baseSwiper: '#336FFF', // swiper
        totalTip: '#336FFF', // 全局的主题色
        serveAd1: { // 最上方服务优势
          adColor: '#3376FF',
          adTip: '#FCAB04',
          adHv: '#336FFF'
        },
        productHv: '#336FFF', //热门产品
        about: '#336FFF', // 关于我们
        serveTel: { // 24小时服务热线
          consultImg: '//file.baixing.net/202205/3fa7596d8dc95e75f768d92e1979e0a4.png',
          consultCo: '#FFFFFF',
          consultBg: '#FDAB00'
        },
        serveAd2: {
          serviceThe: '#3571FF',
          serviceNum: '#3571FF'
        }, // 最下方服务优势
        productCat: { // 热门产品分类
          catTheme: '#336FFF',
          catHo: '#336FFF',
          catBg: '//file.baixing.net/202204/c29c21254f8b758904d6e0236f91372b.png',
          catIcon: '//file.baixing.net/202204/eadcd4817ac82657b4b73fe21a8aa10e.png',
        },
        newsAd: '#336FFF', // 新闻优势
        contact: { // 联系方式
          concatTheme: '#336FFF',
          concatBg: '//file.baixing.net/202204/dbc59b195c64f3e2583ffbce6bc0a4ca.png',
          buttonColor: '#477DFF',
          buttonBg: '#336FFF'
        },
        wap: {
          contactUs: '//file.baixing.net/202205/621b496ea6ba538d0e71335a4cb00a74.png',
          advisoryMe: '//file.baixing.net/202205/61cd853628e62921bcdaf2445a721d7e.png',
          people: '//file.baixing.net/202205/6ac29c804640447497ecc4ed2f1de822.png',
          weixin: '//file.baixing.net/202205/bbf84d26b7326c13bff306c8d92202cd.png',
          tag: '#FDAA02',
          SecondaryMenu: 'rgba(234, 241, 255, 1)',
          introduce: 'linear-gradient(121deg, #FAEBDB 0%, #FEF8F0 100%)',
          contactBg: 'linear-gradient(90deg, #5C8AFF 0%, #336FFF 100%)',
        }
      },
      { // 绿色版本
        officialInfo: {  // 头部-公司名称右侧
          icon: '//file.baixing.net/202205/232a354ebf9c22d96b8493015b665d1f.png',
          telC: '#30B015'
        },
        officialNav: { // 导航栏
          navBg: '#30B015',
          navHv: '#23950C'
        },
        baseSwiper: '#6CB436', // swiper
        totalTip: '#30B015', // 全局的主题色
        serveAd1: { // 最上方服务优势
          adColor: '#323233',
          adTip: '#30B015',
          adHv: '#30B015'
        },
        productHv: '#30B015', //热门产品
        about: '#30B015', // 关于我们
        serveTel: { // 24小时服务热线
          consultImg: '//file.baixing.net/202205/8eb45d1639e11cc2595051b381932e60.png',
          consultCo: '#30B015',
          consultBg: '#FFFFFF'
        },
        serveAd2: { // 最下方服务优势
          serviceThe: '#30B015',
          serviceNum: '#30B015'
        }, 
        productCat: { // 热门产品分类
          catTheme: '#30B015',
          catHo: '#30B015',
          catBg: '//file.baixing.net/202205/ba7f44d7a193681417c6aa1fbcf2ebb0.png',
          catIcon: '//file.baixing.net/202205/ba3911a882c97924a29a3d8797eb904a.png',
        },
        newsAd: '#30B015', // 新闻优势
        contact: { // 联系方式
          concatTheme: '#30B015',
          concatBg: '//file.baixing.net/202205/72ce9e2f83df7eb5f71e693e4f45de11.png',
          buttonColor: '#3FC323',
          buttonBg: '#30B015'
        },
        wap: {
          contactUs: '//file.baixing.net/202205/9ffd9468c14f9f3fcab167eb0757cb7d.png',
          advisoryMe: '//file.baixing.net/202205/28cfd07f68cc479ff12c8d7d203c97d6.png',
          people: '//file.baixing.net/202205/dbce28e4723b92550ca2da7b1fd7bafe.png',
          weixin: '//file.baixing.net/202205/9d572335a95c50791d4cf1720a5a1c59.png',
          tag: '#FF9300',
          SecondaryMenu: 'rgba(233, 247, 230, 1)',
          introduce: 'linear-gradient(121deg, #FAF1DB 0%, #FEF8F0 100%)',
          contactBg: 'linear-gradient(90deg, #54DF15 0%, #30B015 100%)',
        }
      },
      { // 金色版本
        officialInfo: {  // 头部-公司名称右侧
          icon: '//file.baixing.net/202205/44463e2df73e1d62f424bd1c3edde5f4.png',
          telC: '#BF8452'
        },
        officialNav: { // 导航栏
          navBg: '#BF8452',
          navHv: 'linear-gradient(180deg, #515254 0%, #363537 100%)'
        },
        baseSwiper: '#BF8452', // swiper
        totalTip: '#BF8452', // 全局的主题色
        serveAd1: { // 最上方服务优势
          adColor: '#323233',
          adTip: '#BF8452',
          adHv: '#323233'
        },
        productHv: '#BF8452', //热门产品
        about: '#323233', // 关于我们
        serveTel: { // 24小时服务热线
          consultImg: '//file.baixing.net/202205/c916735f1e923964fbf83af6bcf86fb0.png',
          consultCo: '#BF8452',
          consultBg: '#FFFFFF'
        },
        serveAd2: { // 最下方服务优势
          serviceThe: '#BB8556',
          serviceNum: '#BB8556'
        },  
        productCat: { // 热门产品分类
          catTheme: '#BF8452',
          catHo: '#BF8452',
          catBg: '//file.baixing.net/202205/4b2540943533bed4bbd009f2fc986ed4.png',
          catIcon: '//file.baixing.net/202205/3acdda45e9730d05f1a90fb6e36ef338.png',
        },
        newsAd: '#BF8452', // 新闻优势
        contact: { // 联系方式
          concatTheme: '#BF8452',
          concatBg: '//file.baixing.net/202205/4621a33433792e45cddbf7fe90fa600c.png',
          buttonColor: '#D29663',
          buttonBg: '#BF8452'
        },
        wap: { // 金色的wap后期补上
          contactUs: '//file.baixing.net/202205/92203a062ba495ec2c39f19f993e545f.png',
          advisoryMe: '//file.baixing.net/202205/96021411cfc87deb495210913010d367.png',
          people: '//file.baixing.net/202205/5564dc05ce8c7fcaa53859d8f9b4c7b5.png',
          weixin: '//file.baixing.net/202205/2194065bd563af976340e1560f6f1129.png',
          tag: '#BF8452',
          SecondaryMenu: 'rgba(253, 247, 238, 1)',
          introduce: 'linear-gradient(121deg, #FAF1DB 0%, #FEF8F0 100%)',
          contactBg: 'linear-gradient(90deg, #CE884D 0%, #A66A38 100%)',
        }
      },
      { // 黑蓝版本
        officialInfo: {  // 头部-公司名称右侧
          icon: '//file.baixing.net/202204/3cc0a982890ee12761aa8f6e5d20e7ea.png',
          telC: '#336FFF'
        },
        officialNav: { // 导航栏
          navBg: '#343434',
          navHv: '#336FFF'
        },
        baseSwiper: '#343434', // swiper
        totalTip: '#336FFF', // 全局的主题色
        serveAd1: { // 最上方服务优势
          adColor: '#343434',
          adTip: '#336FFF',
          adHv: '#343434'
        },
        productHv: '#343434', //热门产品
        about: '#343434', // 关于我们
        serveTel: { // 24小时服务热线
          consultImg: '//file.baixing.net/202205/ee397cd7c530e64d1a470b4aa2d19006.png',
          consultCo: '#FFFFFF',
          consultBg: '#3571FF'
        },
        serveAd2: {
          serviceThe: '#3571FF',
          serviceNum: '#343434'
        },   // 最下方服务优势
        productCat: { // 热门产品分类
          catTheme: '#BF8452',
          catHo: '#343434',
          catBg: '//file.baixing.net/202205/ba7f44d7a193681417c6aa1fbcf2ebb0.png',
          catIcon: '//file.baixing.net/202205/ba3911a882c97924a29a3d8797eb904a.png',
        },
        newsAd: '#336FFF', // 新闻优势
        contact: { // 联系方式
          concatTheme: '#BF8452',
          concatBg: '//file.baixing.net/202205/355c77262a579036146e415e9442c1ca.png',
          buttonColor: '#D29663',
          buttonBg: '#343434'
        },
        wap: { // 
          contactUs: '//file.baixing.net/202205/621b496ea6ba538d0e71335a4cb00a74.png',
          advisoryMe: '//file.baixing.net/202205/61cd853628e62921bcdaf2445a721d7e.png',
          people: '//file.baixing.net/202205/6ac29c804640447497ecc4ed2f1de822.png',
          weixin: '//file.baixing.net/202205/bbf84d26b7326c13bff306c8d92202cd.png',
          tag: '#336FFF', // 店铺介绍标签色
          SecondaryMenu: 'rgba(242, 245, 255, 1)', // 二级菜单标签背景色
          introduce: 'linear-gradient(121deg, #FAF1DB 0%, #FEF8F0 100%)', // 店铺介绍背景色
          contactBg: 'linear-gradient(90deg, #5C8AFF 0%, #336FFF 100%)', // 拨打电话渐变背景色
          specialIcon: '#336FFF' // 指针对黑蓝版本的另一种颜色
        }
      }
    ]
      */
    // '#336FFF' // 蓝色
    // '#D8010D' // 红色
    // '#30B015' // 绿色
    // '#BF8452' // 金色
    // '#343434' // 黑蓝
    // currentTheme:  '#336FFF'// currentTheme是当前店铺的主题色


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
      const newAutoConfig = {
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
    data.basic.shop.templateId = 'f5760fe337070e8b9b8f3fdcd9ca1c32'
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
    // const pageTemplate = 'site-template-4'
    const templateUrl = `${pageTemplate}/${device}/home/index`
    const { kf53 } = data.basic.contact;
    const currentPathname = req.originalUrl;
    const trackId = this.trackerService.getTrackId(req, res)
    this.checkCn(HostDomain)
    return res.render(templateUrl, { title: '首页', renderData: { ...data, shopName, domainType: this.domainType, currentPathname, kf53, shopId, trackId, userInfo }, isHome: true, isSem, isCn, isAccount, pageTemplate, pageType: 'home', contentType: '', pageStartRenderTime: new Date().getTime() });
  }

  @Get(['/nl.html', '/nl-:id.html'])
  async newsListing(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)

    const currentPage = query.page || 1;

    const id = params.id

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

  @Get('/n-:id.html')
  async newschild(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)

    const newsId = params.id

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
  }

  @Get(['/pl.html', '/pl-:id.html'])
  async productListing(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const currentPage = query.page || 1

    const id = params.id

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

  @Get('/p-:id.html')
  async productchild(@Param() params, @HostParam('shopName') HostShopName: string, @HostParam('domain') HostDomain: string,
    @Query() query, @Req() req: Request, @Res() res: Response, @UserAgent('device') device) {
    const isSem = this.checkSem(query.sem, query.bannerId, query.account)
    const isCn = this.checkCn(HostDomain)
    const isAccount = query.account
    const domain = req.hostname
    const shopName = this.midwayApiService.getShopName(params.shopName || HostShopName)
    const userInfo = await this.getUserInfo(req, domain)
    const productId = params.id
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
  }

  //关于我们
  @Get('/about.html')
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
