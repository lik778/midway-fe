# B2B 客户接视频说明（非标）

在视频需求上线前，只能通过改数据库这种非常规操作给客户接入视频，具体流程如下。

## 基本流程

1. 拿到客户视频（一个）以及视频封面（一张移动端封面和一张电脑端封面）
2. 压缩图片（压缩到 150kb 左右）
3. 压缩视频（压缩到 5MB 左右）
4. 企业微信找一光上传图片，获得图片地址
5. TAPD 提需求给金辉上传视频，获得视频地址
6. 整理数据发给成磊
7. 线上验证是否接入成功

## 详细步骤

1. 获取客户视频（一个）以及视频封面（一张移动端封面，一张电脑端封面）

2. 压缩及上传封面图片

   2.1 先将 PNG 图片[转为 JPG](https://png2jpg.com/)

   2.2 [压缩图片](https://tinypng.com/)

   2.3 找一光上传图片，获得视频封面地址

3. 压缩及上传视频

   3.1 [登录又拍云](https://console.upyun.com/)，账号 lionad-test，密码 lionad-test

   3.2 找到文件管理，[上传视频](https://console.upyun.com/services/bax-test-video/filemanage/)

   3.3 找到音视频处理，[创建一个视频压缩任务](https://console.upyun.com/services/bax-test-video/mediaCreateTask/)

   3.4 压缩完成后，将视频下载到本地

   3.5 计算出文件的[哈希](http://www.metools.info/other/o21.html)，将视频重命名（防止视频重名）

   3.6 在TAPD提交[上传视频需求](https://www.tapd.cn/20095781/prong/stories/stories_list)，格式可参考[《上传视频需求》](https://www.tapd.cn/20095781/prong/stories/view/1120095781001038871?url_cache_key=012a9fa60a93db23451608f30e524100)，处理人可选：唐金辉、李如磊

   3.7 将视频用压缩软件压成 zip 包，企业微信发送给金辉（防止视频再被企业微信压缩）

   3.8 金辉会将视频上传到线上，完成后，拿到返回的视频地址

4. 整理数据发给成磊，数据格式见下一小节

5. 线上验证是否接入成功

## 数据格式

以下是发给成磊的数据格式，尖括号内是需要手动填写的东西。

```
店铺地址（B2B）：<店铺地址>

PC端改关于我们
视频封面：<电脑端视频封面>
视频链接：<视频地址>

WAP端改轮播，放到第一张
视频封面：<移动端视频封面>
视频链接：<视频地址>
```

一个完成的示例如下：

```
店铺地址（B2B）：https://weianqinyi.shop.baixing.com/

PC端改关于我们：
视频封面：8b320ef7e6797fa58cb1c11ef935a545.jpg#up
视频链接：http://img4.baixing.net/9d7057618abd0a1cc92c169a27763c01.mov

WAP端改轮播，放到第一张：
视频封面：0a7ddd65463eda1804db9aceb6b555e6.jpg#up
视频链接：http://img4.baixing.net/9d7057618abd0a1cc92c169a27763c01.mov
```