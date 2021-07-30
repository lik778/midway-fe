# 商户后台项目
该项目前端分为后台和前台，分别位于mvip-manager文件夹和views文件夹

## 【目录结构】
- node目录  
midway-fe  
├── app                             //前端后台代码  
├── assets                          //审核后台、B2C、B2B模板js、css所在  
├── build                           //打包配置  
├── src                             //node代码  
│   ├── base                        //Sentry初始化  
│   ├── config                      //全局配置  
│   ├── constant                    //全局常量  
│   ├── controllers                 //控制器，路由编写处  
│   ├── decorator                   //装饰器  
│   ├── dto                         //类interface，描述输入输出的模型  
│   ├── enums                       //枚举值  
│   ├── exceptions                  //访问异常  
│   ├── filters                     //过滤处理访问异常  
│   ├── interface                   //普通interface  
│   ├── pipes                       //管道，对dto接口的校验  
│   ├── services                    //服务，转发向后端请求  
│   ├── util                        //常用方法  
│   ├── view-helpers                //定义了pug编译时相关的处理  
│   ├── app.module.ts               //node module注册处  
│   └── main.ts                     //全局入口  
├── views                           //审核后台、B2C、B2B模板页面所在  
├── .dockerignore  
├── .eslintrc.js  
├── .nvmrc  
├── .prettierrc  
├── dev.Dockerfile  
├── Dockerfile  
├── nest-cli.json  
├── package-lock.json  
├── package.json  
├── README.md  
├── tsconfig.build.json  
└── tsconfig.json  

- 后台代码  
mvip-manager                        //后台代码  
├── src                             //主体代码  
│   ├── api                         //AJAX封装  
│   ├── components                  //全局组件  
│   ├── config                      //全局配置  
│   ├── constants                   //全局常量  
│   ├── enums                       //全局枚举值  
│   ├── hooks                       //自定义hooks  
│   ├── interfaces                  //全局interface  
│   ├── layouts                     //项目layout，在里面做全局初始化  
│   ├── locales                     //全球化  
│   ├── models                      //dva数据管理  
│   ├── pages                       //页面  
│   ├── styles                      //全局样式  
│   ├── utils                       //工具方法  
│   ├── wrappers                    //鉴权  
│   └── app.ts                      //入口文件  
├── .editorconfig    
├── .env  
├── .nvmrc  
├── .prettierignore  
├── .prettierrc  
├── .umirc.ts                       //umi框架全局配置  
├── package.json  
├── README.md  
├── tsconfig.json  
└── typings.d.ts  

## 【本地开发注意】

### 确认domain值
 - 不同类型的店铺，后端所在的环境，决定了localhost开发时我们使用哪个domain
详见 src/services/site.service.ts文件36行

### 确认是否已模拟cookies
 - 在localhost本地开发环境，开发mvip-manager管理后台时, 前端需要在浏览器Application中复制调试账户cookies里的3个字段
__c、__u、__t

### 【测试账号】
18516566605/baixing123

## 【views模板层启动】
- 在midway-fe文件下：npm run dev

## 【管理后台启动】
- 在midway-fe/app/mvip-manager下：yarn start

## 【测试环境】
代码提交到fenlei对应分支后，
test分支测试环境：http://shop-test.baixing.cn/management/shop  
dev分支测试环境：http://shop.baixing.cn/management/shop

## 【后端接口】
在不同环境下的端口地址请看`./src/config`下配置。

midway-service: http://172.30.2.14:31257/doc.html#/home  
zhidao-service：http://172.30.2.14:31252/doc.html#/home  

全局参数设置里添加（下方`X-Api-Hash`、`X-Api-Token`、`X-Api-User`可替换为开发者的）  
X-Api-Domain : agui.shop.baixing.cn（此处domain参考`site.service.ts`文件）  
X-Api-Device : pc  
X-Api-Shop-Name : agui  
X-Api-Hash  : d2131474e6758d58b0cb1a8123f9253ae157fb56  
content-type  :  application/json;charset=UTF-8  
X-Api-User : 226337262  
X-Api-Token : ut60616cfbacfd27.86398476  
X-Api-Src : web  
X-Api-Shop-Id : 366  

## 【Mock数据】
- 需要有某种店铺的类型及数量：后端打api/midway/internal/ticket/yht/buy接口
- 需要有店铺Ai权限：买套餐或请求后端协助
- 需要有问答Ai权限：haojing仓库BusinessRule.php文件23行注释掉，可以买家电维修带问答Ai的套餐

## 【数据表】
- chaoge里inno-my(店铺）inno-zd(问答)

## 新模板添加须知
`site-template-n`：新模板文件夹名称，n为数字，表示第几号模板。  
`device`：wap/pc，模板分wap与pc端。  
`B2X`：B2C/B2B 当前模板是B2C类型还是B2B类型。  
- 在`views`下添加`site-template-n`文件夹作为新模板页面编写地方
- 在`assets`下添加`site-tamplate-n`文件夹作为新模板css、js编写地方
- 新模板基础文件夹布局参考已有模板，基础页面的文件夹名称与文件名有具体要求
  * 首页：`site-template-n/${device}/home/index`
  * 产品列表页面：`site-template-n/${device}/product/index`
  * 产品列表某子类目页面：`site-template-n/${device}/product-child/index`(参考过去product、product-child页面编写)
  * 产品详情页面：`site-template-n/${device}/product-detail/index`
  * 新闻列表页面：`site-template-n/${device}/news/index`
  * 新闻列表某子类目页面：`site-template-n/${device}/news-child/index`(参考过去news、news-child页面编写)
  * 新闻详情页面：`site-template-n/${device}/news-detail/index`
  * 关于我们：`site-template-n/${device}/about/index`
- 在`views/common/pc`下是pc模板的一些公共组件（customer-service：右下qq、手机号、微信，footer：公共底部，pagination：分页，topbar：顶部黑色条状区域）
- 在`src/services/site.service.ts`的`templateMapping`里添加新模板id为key（id由后端提供，新模板文件夹名称），值为模板文件夹名称。
- 在`build/constant.js`添加新模板的内容，序号则和文件夹里的`n`保持一致，`TB_PAGE_NAMES_${B2X}_n`则是这个模板所有页面文件夹的名称（作为wabpack打包入口）
- 在`webpack.base.config.js`的entry入口里添加`genSiteTemplateEntry(TB_TYPE_${B2X}_n, TB_PAGE_NAMES_${B2X}_n)`
- 需要打点的页面方法可以参考`assets/common/pc/customer-service/index/js`
