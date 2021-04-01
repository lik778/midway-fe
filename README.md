## 站内千词项目

该项目前端分为后台和前台，分别位于mvip-manager文件夹和views文件夹
 ### 【本地开发注意】
 #### 确认domain值
 - 不同类型的店铺，后端所在的环境，决定了localhost开发时我们使用哪个domain
详见 src/services/site.service.ts文件36行
#### 确认是否已模拟cookies
 - 在localhost本地开发环境，开发mvip-manager管理后台时, 前端需要在浏览器Application中复制调试账户cookies里的3个字段
__c、__u、__t
#### 【测试账号】
18516566605/baixing123

### 【views模板层启动】
- 在midway-fe文件下：npm run dev
### 【管理后台启动】
- 在midway-fe/app/mvip-manager下：yarn start
### 【测试环境】
代码提交到fenlei对应分支后，
test分支测试环境：http://shop-test.baixing.cn/management/shop
dev分支测试环境：http://shop.baixing.cn/management/shop

### 【后端接口】
http://172.30.2.14:31257/doc.html#/home
全局参数设置里添加
X-Api-Domain  agui.shop.baixing.cn（此处domain参考site.service.ts文件）
X-Api-Device  pc
X-Api-Shop-Name  agui
X-Api-Hash   d2131474e6758d58b0cb1a8123f9253ae157fb56
content-type    application/json;charset=UTF-8
X-Api-User   226337262
X-Api-Token   ut60616cfbacfd27.86398476
X-Api-Src   web
X-Api-Shop-Id  366
### 【Mock数据】
- 需要有某种店铺的类型及数量：后端打api/midway/internal/ticket/yht/buy接口
- 需要有店铺Ai权限：买套餐或请求后端协助
- 需要有问答Ai权限：haojing仓库BusinessRule.php文件23行注释掉，可以买家电维修带问答Ai的套餐

### 【数据表】
- chaoge里inno-my(店铺）inno-zd(问答)



