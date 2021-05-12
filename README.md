# 商户后台项目
该项目前端分为后台和前台，分别位于mvip-manager文件夹和views文件夹
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


