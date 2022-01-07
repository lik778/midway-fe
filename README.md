# 商户后台项目

该项目前端分为后台和前台，分别位于 mvip-manager 文件夹和 views 文件夹。  
无论要调试哪方面代码都需先启动 nest（中间层做路由转发，看 controllers）。
调试后台管理页面还需启动 mvip-manager 项目。  
模板页启动 nest 即可。  
mvip-manager 与模板页的打包产物会放到 nest 的打包产物的 public 文件夹内（具体看 build/webpack.base.config.js、.gitlab-ci.yml 与 dockerfile 文件）

## 【目录结构】

- node 目录  
  midway-fe  
  ├── app //前端后台代码  
  ├── assets //审核后台、B2C、B2B 模板 js、css 所在  
  ├── build //打包配置  
  ├── src //node 代码  
  │   ├── base //Sentry 初始化  
  │   ├── config //全局配置  
  │   ├── constant //全局常量  
  │   ├── controllers //控制器，路由编写处  
  │   ├── decorator //装饰器  
  │   ├── dto //类 interface，描述输入输出的模型  
  │   ├── enums //枚举值  
  │   ├── exceptions //访问异常  
  │   ├── filters //过滤处理访问异常  
  │   ├── interface //普通 interface  
  │   ├── pipes //管道，对 dto 接口的校验  
  │   ├── services //服务，转发向后端请求  
  │   ├── util //常用方法  
  │   ├── view-helpers //定义了 pug 编译时相关的处理  
  │   ├── app.module.ts //node module 注册处  
  │   └── main.ts //全局入口  
  ├── views //审核后台、B2C、B2B 模板页面所在  
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
  mvip-manager //后台代码  
  ├── src //主体代码  
  │   ├── api //AJAX 封装  
  │   ├── components //全局组件  
  │   ├── config //全局配置  
  │   ├── constants //全局常量  
  │   ├── enums //全局枚举值  
  │   ├── hooks //自定义 hooks  
  │   ├── interfaces //全局 interface  
  │   ├── layouts //项目 layout，在里面做全局初始化  
  │   ├── locales //全球化  
  │   ├── models //dva 数据管理  
  │   ├── pages //页面  
  │   ├── styles //全局样式  
  │   ├── utils //工具方法  
  │   ├── wrappers //鉴权  
  │   └── app.ts //入口文件  
  ├── .editorconfig  
  ├── .env  
  ├── .nvmrc  
  ├── .prettierignore  
  ├── .prettierrc  
  ├── .umirc.ts //umi 框架全局配置  
  ├── package.json  
  ├── README.md  
  ├── tsconfig.json  
  └── typings.d.ts

## 【本地开发注意】

### 开发前

#### 依赖安装问题

- 多半是网络不行。使用公司的网，或用自己的 vpn（全局模式）。

#### 【views 模板层启动】

- 在 midway-fe 文件下：npm start

#### 【管理后台启动】

- 在 midway-fe 文件下：npm run start:mvip
- 在 midway-fe/app/mvip-manager 下：npm start

### 开发时

#### 确定调用哪个环境的接口
- 查看 src/config 下的文件
- local.ts 用于配置本地的开发配置
```javascript
'midway-service': {
  host: 'http://172.30.2.14:31257',// dev环境 ，如果连后端本地服务也要选这个
  host: 'http://172.30.2.14:30257',// test环境
  host: 'http://172.30.2.14:30260',// test1环境
  host: 'http://172.30.2.14:30263',// test2环境
},
```
#### 确认 domain 值

调用不同环境的接口需要不同的 domain

- 详见 src/services/site.service.ts 文件`getDomain`函数


#### 线下开发确认是否已模拟 cookies

无法打开后台管理页面或打开后跳转百姓网主站。

- 前往线下百姓网，登录线下账号（如需超人权限，线下可找后端询问，线上前往游龙申请，[线上超人申请参考文档](https://baixing.yuque.com/gyehgs/rxumnv/royfq2)）。
- 打开控制台->Application ，复制调试账户 cookies 里的 3 个字段\_\_c、\_\_u、\_\_t 。
  ![获取\_\_c、\_\_u、\_\_t ](https://file.baixing.net/202201/6ef420379b41130d281a125177701e90.png)
- 找一个店铺网页（例如：http://172.17.15.38:7001/zmlc/），打开本地环境的控制台，cookies 里设置\_\_c、\_\_u、\_\_t 个字段。
- 再打开后台管理页面

#### 【测试账号】

- 注册百姓网线下账号（短信注册，短信输入百姓网新三板号码 836012），通过[购买线下 vip](http://www.qatest3.baixing.cn/p/mock/index.php)。将自己的账号转为付费账号。（开始建议让测试帮忙，后面自己弄。）
  18516566605/baixing123

### 开发后

#### 【测试环境】

代码提交到 fenlei 对应分支后，走[提测平台](https://test-platform.baixing.cn/)。  
dev 分支测试环境：`http://shop-dev.baixing.cn/management/shop`（暂停使用等待后端修复 domain 为 shop-dev.baixing.cn）
test 分支测试环境：http://shop-test.baixing.cn/management/shop
test1 分支测试环境：http://shop-test1.baixing.cn/management/shop
test2 分支测试环境：http://shop-test2.baixing.cn/management/shop

## 【后端接口】

在不同环境下的端口地址请看`./src/config`下配置。

下面是接口文档
midway-service: http://172.30.2.14:30257/doc.html#/home  
zhidao-service：http://172.30.2.14:31252/doc.html#/home  
post-tool-service：http://172.30.2.14:31204/doc.html#/home

全局参数设置里添加（下方`X-Api-Hash`、`X-Api-Token`、`X-Api-User`可替换为开发者的）  
X-Api-Domain : agui.shop.baixing.cn（此处 domain 参考`site.service.ts`文件）  
X-Api-Device : pc  
X-Api-Shop-Name : agui  
X-Api-Hash : d2131474e6758d58b0cb1a8123f9253ae157fb56  
content-type : application/json;charset=UTF-8  
X-Api-User : 226337262  
X-Api-Token : ut60616cfbacfd27.86398476  
X-Api-Src : web  
X-Api-Shop-Id : 366

## 【Mock 数据】

- 需要有某种店铺的类型及数量：后端打 api/midway/internal/ticket/yht/buy 接口
- 需要有店铺 Ai 权限：买套餐或请求后端协助
- 需要有问答 Ai 权限：haojing 仓库 BusinessRule.php 文件 23 行注释掉，可以买家电维修带问答 Ai 的套餐

## 【数据表】

- chaoge 里 inno-my(店铺）inno-zd(问答)

## 新模板添加须知

`site-template-${n}`：新模板文件夹名称，n 为数字，表示第几号模板。  
`device`：wap/pc，模板分 wap 与 pc 端。  
`B2X`：B2C/B2B 当前模板是 B2C 类型还是 B2B 类型。

- 在`views`下添加`site-template-${n}`文件夹作为新模板页面编写地方
- 在`assets`下添加`site-tamplate-n`文件夹作为新模板 css、js 编写地方
- 新模板基础文件夹布局参考已有模板，基础页面的文件夹名称与文件名有具体要求
  - 首页：`site-template-${n}/${device}/home/index`
  - 产品列表页面：`site-template-${n}/${device}/product/index`
  - 产品详情页面：`site-template-${n}/${device}/product-detail/index`
  - 新闻列表页面：`site-template-${n}/${device}/news/index`
  - 新闻详情页面：`site-template-${n}/${device}/news-detail/index`
  - 关于我们：`site-template-${n}/${device}/about/index`
  - 搜索页面：`site-template-${n}/${device}/about/index`
- 在`views/common/pc`下是 pc 模板的一些公共组件（customer-service：右下 qq、手机号、微信，footer：公共底部，pagination：分页，topbar：顶部黑色条状区域）
- 在`src/services/site.service.ts`的`templateMapping`里添加新模板 id 为 key（id 由后端提供，新模板文件夹名称），值为模板文件夹名称。
- 在`build/constant.js`添加新模板的内容，序号则和文件夹里的`n`保持一致，`TB_PAGE_NAMES_${B2X}_n`则是这个模板所有页面文件夹的名称（作为 wabpack 打包入口）
- 在`webpack.base.config.js`的 entry 入口里添加`genSiteTemplateEntry(TB_TYPE_${B2X}_n, TB_PAGE_NAMES_${B2X}_n)`
- 需要打点的页面方法可以参考`assets/common/pc/customer-service/index/js`

## CI 相关说明

CI 文件以及说明文档见 `.gitlab.yml`


## 业务代码开发注意点
- 请详细阅读 src/controllers/site/base-site.controller.ts。
  - 店铺投放页面区分cn与com，现在只有footer内容不一样了，可以搜索isCn来查看相关代码。（checkCn函数：判断是否时cn）
  - sem = 0 | 1 | 2 | undefined ，这是做投放时为了规避、合规做的处理，0和undefined则不做任何处理，1 按照百度的要求做的处理，2 按头条的要求去做处理。（checkSem函数：判断是否时sem）
  - 如果要对数据做处理兼容，兜底，请在node里做（setData函数：做数据兼容与兜底），不要去模板页做。

- 模板页开发注意  
  - 重构代码或者替换代码一定要注意里面是否有isCn、isSem，需要告知产品需要注意的。  
  - 导航里有个叫联系我们，他和首页的 id:contactFormBox的div关联，跳转到留资那里。

- 开发后台管理页面注意 (@/ = app/mvip-manager/src)
  - 请不要随意在 @/styles/common.less里添加非基础类型的公共css，会污染全局。
  - 组件内请使用`import styles from './index.less';`这种模式引用css，避免css污染。
  - @/components下是 公共组件，修改公共组件请务必回归一遍所有使用的地方（也需要通知测试回归）。
  - 请写给对象写上明确的 interface或类型别名，请不要随意使用any，以便维护。
