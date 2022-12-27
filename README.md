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

- 

#### 【views 模板层启动】

- 在 midway-fe 文件下：npm start

#### 【管理后台启动】

- 在 midway-fe 文件下：npm run start:mvip
- 在 midway-fe/app/mvip-manager 下：npm start

### 开发时

#### 确定调用哪个环境的接口
- 查看 src/config 下的文件
- local.ts 用于配置本地的开发配置
```
#### 确认 domain 值

调用不同环境的接口需要不同的 domain

- 详见 src/services/site.service.ts 文件`getDomain`函数


## 【后端接口】

在不同环境下的端口地址请看`./src/config`下配置。


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
