## NewBest 是什么?
一个可以把微信小程序代码直接在浏览器上跑的 sdk，基本上支持大多数的微信小程序组件和 API

这是个人的项目，挺辛苦的，主要是开始开发小程序，还要在 web 上再搞一次，市面上没有自己想要的框架，就业余时间写了一个

NewBest 的特点是，直接把小程序开发的文件夹丢进来就可以直接用了，不需要经过其他中间代码来进行转换，原始的工程就是小程序 IDE 的工程

NewBest 的商标申请中

## 现在进行中任务
目标是拓展到以下生产环境，争取做到 write once,run anywhere

1. `iOS App、Android App` - 使用 `react native`
2. `PC 上的 Mac、Windows、Linux` - 使用 `electron`（`Sciter`、`Proton` 的集成方案也在考虑）
3. 转换其他平台的小程序
4. 转换成 PWA
5. 更进一步，会把 js 代码直接编译成二进制文件给原生代码调用 - 有了初步头绪

## DEMO
在使用中有任何问题，欢迎反馈给我

* http://nb.shiqiren.com/NB.index.html 打开首页
* http://nb.shiqiren.com/NB.index.html?path=pages/test/component/text/index/index 打开指定的页面


## 初始化项目
1. 把文件下载下来
2. 把小程序源代码目录里面的子目录和文件，复制到 `./source/App` 里面
3. 把一个 png 格式的 logo 文件命名为 `logo.png` 复制到 `./source` 里面
4. 用 `vscode` 打开目录 `project`
5. 在 `./project` 目录执行终端命令 `npm install`，如果因为网络原因执行命令太慢，可以直接下载 http://nb.shiqiren.com/project.zip
6. 在 `./project/localhost` 目录执行终端命令 `npm install`
7. 在 `./project` 目录执行终端命令 `node init`
8. 打开 `source/project.config.json` 配置 `appName`、`version`
9. 打开 `source/NB.config.js` 配置 `NBConfig`
    *  `home`: 配置默认主页
    *  `url`: 配置网页的域名
    *  `rootPath`: 配置网页的运行根目录
    *  需要后台代码支持，并配置跨域规则 `NBConfig.runtime.web.crossDomain`，需要跨域的原始 url 会放在请求头 `nb-origin-url`
10. 打开 `./localhost/web.config.js` 配置你自己的域名和端口

## 运行项目
1. 在 ./project 目录执行终端命令 node watch
2. vscode 点击调试按钮，或者在 ./project 目录执行终端命令 node localhost/index

在浏览器打开以下的人一个地址

    * https://localhost:4002/NB.index.html?debug=true debug 模式（SSL）
    * http://localhost:4001/NB.index.html?debug=true  debug 模式
    * https://localhost:4002/NB.index.html            release 模式（SSL）
    * http://localhost:4001/NB.index.html             release 模式

要指定在线调试工具，在 url 后面加上`devtools=eruda` 或 `devtools=vconsole`

注：修改代码，只要修改 `./source` 里面的内容即可

## 发布项目
1. 在 `./project` 目录执行终端命令 `node build`，会在 `./release/web` 生成打包压缩的可以发布的代码
2. 把 `./release/web` 里面的文件（web 文件夹对应的是你网站的根目录）全部复制到你的网站根目录即可

## 修改图标
1. 把一个 png 格式的 logo 文件命名为 `logo.png` 复制到 `./source` 里面
2. 在 `./project` 目录执行终端命令 `node changeLogo`

## 目录结构说明
+ `localhost` 快速建立一个可运行的后台
    - `ssl`如果需要 ssl 证书，可以把证书文件夹放这里（证书的文件夹需要命名为“域名”）
      - `www.shiqiren.com`举例的证书文件夹，自己自行修改
    - `index.js`简易后台入口文件
    - `web.config.js`后台域名配置和端口配置，为了便于本地调试，可以修改本地的 host 文件，或者在路由器直接修改 host（本人用的是 360 的路由器，可以在路由的层面上直接修改 host）
+ `debug`
    - `platform`
        - `web` debug 模式下的代码
+ `release`
    - `platform`
        - `web` release 模式下的代码
+ `source` 小程序源代码放的地方
    - `App` 直接把小程序的代码放进里面
        - `__NB__` 为了在 web 上运行小程序的代码，各种 API 和组件的支持库
    - `logo.png` 整个工程的 logo
    - `NB.config.js` 运行环境配置
    - `NB.sdk.js` new best SDK
    - `project.config.json` 工程配置
+ `source-es5` 小程序源代码编译成 ES5 的地方
+ `test` 自己测试各种功能、玩意的地方
+ `build.js` 编译为 release
+ `changeLogo.js` 修改 logo
+ `watch.js` 工程的后台服务

## PHP 后台代码跨域例子（未处理 post 请求）

```php
//js 跨域访问的代理
function domainAgent(){
  $headers=$this->getAllHeaders();
  $key="nb-origin-url";//固定的跨域请求头
  if(!array_key_exists($key,$headers)) exit;
  $originUrl=$headers[$key];
  $query=parse_url($originUrl,PHP_URL_QUERY);
  if($this->isPostRequest()){
    //todo:post 请求 
  }
  else{
    $url=$originUrl;
    foreach($_GET as $key=>$value)  
    {
      if(!$query[$key]){
        $url.=(strpos($url,'?')===false?'?':'&').$key.'='.$value;
      }
      // echo   "Key: $key; Value: $value <br/>\n ";
    }
    $result=file_get_contents($url);
    foreach($http_response_header as $key => $value){
      Header ($value ); 
    }
			
      echo $result;
    }
    exit;
}
```

