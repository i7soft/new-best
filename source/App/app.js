//app.js
var Util = require('./utils/util.js');
var WeToast = require('./wetoast/wetoast.js');
var _toast;
var _sessionid;
var _loginCallback;
var _loging = false;
var _isLoginSuccess = false;
var _callbacks = [];
var appConfig = require('./appConfig.js');
var homeUrl = appConfig.homeUrl || '/pages/index/index';

//todo:electron 在 node 环境下打开多线程会崩溃
// const worker = wx.createWorker('pages/test/framework/worker/workers/request/index2.js')

// worker.postMessage({
//   msg: 'hello from AppService',
//   buffer: Util.str2ab('hello arrayBuffer from AppService')
// })

// worker.onMessage(function (msg) {
//   console.log('[AppService] onWorkerMessage', msg)
//   const buffer = msg.buffer
//   console.log('[AppService] on worker buffer', Util.ab2str(buffer))

// })

// console.log(`[AppService] on worker create: ${worker.onMessage}`)

// var ORIGIN = 'https://wm.shiqiren.com';
var ORIGIN = 'https://wm.rrtdc.cn';

var agentId = "";//代理商 id bobo2

// function Mailbox(props) {
//   const unreadMessages = props.unreadMessages;
//   return (
//     <div>
//       <h1>Hello!</h1>
//       {unreadMessages.length > 0 &&
//         <h2>
//           You have {unreadMessages.length} unread messages.
//         </h2>
//       }
//     </div>
//   );
// }

// function ListItem(props) {
//   // 对啦！这里不需要指定key:
//   return <li>{props.value}</li>;
// }

// function NumberList(props) {
//   const numbers = props.numbers;
//   const listItems = numbers.map((number) =>
//     // 又对啦！key应该在数组的上下文中被指定
//     <ListItem key={number.toString()}
//               value={number} />

//   );
//   return (
//     <ul>
//       {listItems}
//     </ul>
//   );
// }

// const numbers = [1, 2, 3, 4, 5];
// ReactDOM.render(
//   <NumberList numbers={numbers} />,
//   document.getElementById('root')
// );

var desktopApplication;
var desktopWindow;
if(typeof Remote !='undefined'){
  desktopApplication=Remote.app;
  desktopWindow=Remote.getCurrentWindow();
}

App({
  onWindowAllClosed:function(){
    console.log('onWindowAllClosed');
    // desktopApplication.quit();
  },
  onPageTitleUpdated:function(){
    console.log('onPageTitleUpdated');
  },
  onClose:function(){
    console.log('onClose');
    desktopApplication.quit();
  },
  onClosed:function(){
    console.log('onClosed');
  },
  onBlur:function(){
    console.log('onBlur');
  },
  onFocus:function(){
    console.log('onFocus');
  },
  onMaximize:function(){
    console.log('onMaximize');
  },
  onUnmaximize:function(){
    console.log('onUnmaximize');
  },
  onMinimize:function(){
    console.log('onMinimize');
  },
  onRestore:function(){
    console.log('onRestore');
  },
  onMove:function(){
    console.log('onMove');
  },
  onEnterFullScreen:function(){
    console.log('onEnterFullScreen');
  },
  onLeaveFullScreen:function(){
    console.log('onLeaveFullScreen');
  },
  onAppCommand:function(){
    console.log('onAppCommand');
  },
  onError:function(e){
    console.log('get catch');
  },
  onPageNotFound:function(res){
    console.log(res);
  },
  onLaunch: function (options) {
   
    console.log(ORIGIN);
    // throw new Error('8888');
    console.log(options);
    // var scene = decodeURIComponent(options.scene);
    agentId = options.query.agentId;
    _callbacks = [];

    // this.login(function () {
    //     for (var i = 0; i < _callbacks.length; i++) {
    //         var cb = _callbacks[i];
    //         cb && cb();
    //     }

    //     _callbacks = [];
    // });

    //清除定位缓存
    wx.setStorageSync('APP_LBS', null);
  },

  getUserInfoSync: function () {
    return this.globalData.userInfo;
  },

  onShow: function (options) {
    console.log(2);
    console.log("app-onShow");
    console.log(options);
  },

  onInit: function (callback) {
    // if (this.globalData.userInfo) { // 已登录
    //     callback && callback();
    // } else if (_loging) { // 登录中
    //     callback && _callbacks.push(callback);
    // } else { // 登录失败
    //     // nothing
    //   callback && callback();
    // }
    var that = this;

    var totalCallback = function () {

      var lbs = null;
      if (that.globalData.lbs == null) {
        lbs = wx.getStorageSync('APP_LBS') || null;
        if (!!lbs) {
          that.globalData.lbs = {
            cityId: lbs.cityId,
            lat: lbs.lat,
            lng: lbs.lng,
            reload: true
          };

        }
      }


      if (!!that.globalData.lbs && that.globalData.lbs.lat) {

        callback && callback();
      } else {

        that.getLocation(callback);
      }


    };

    _loginCallback = totalCallback;

    if (_isLoginSuccess) {//已经登录过，则直接执行回调
      that.getUserInfo();
      return;
    }

    wx.login({
      success: function (res) {
        console.log(res);
        var code = res.code;

        if (code) {
          //成功
          that.loginApp(code);
        } else {

          wx.showModal({
            showCancel: false,
            title: '温馨提示',
            content: '小程序初始化出错，原因：' + res.errMsg
          });
        }
      },
      fail: function () {

        wx.showModal({
          showCancel: false,
          title: '温馨提示',
          content: '小程序初始化出错'
        });
      }
    });
  },

  



  loginApp: function (code) {
    var that = this;

    var data = {
      code: code
    };

    if (agentId && agentId != '') {
      data.agentId = agentId;//从代理商的二维码进入
    }

    this.request({
      url: 'API/onLogin',
      method: 'POST',
      data: data,
      loading: '载入中...',
      success: function (error, data, res) {
        if (error) {
          _loging = false;
          wx.showModal({
            showCancel: false,
            title: '温馨提示',
            content: '登录失败，请返回再试',
          });
          return;
        }

        _sessionid = data.sessionid;

        // 缓存sessionid到storage
        // wx.setStorageSync('APP_SESSIONID', _sessionid);

        that.globalData.isBindPhone = data.isbindphone == 1;

        _isLoginSuccess = true;

        //微信授权获取用户信息
        that.getUserInfo();

        // wx.getUserInfo({
        //     success: function (res2) {
        //         console.log('userInfo 1: ');
        //         console.log(res2);
        //         that.updateUserInfo(res2);
        //     },
        //     fail: function () {


        //     },
        //     complete:function(res){
        //         console.log(res);
        //         if (res.errMsg !='getUserInfo:ok'){
        //           _loging = false;
        //         }
        //     }
        // });
      },
      fail: function () {
        _loging = false;
        wx.showModal({
          showCancel: false,
          title: '温馨提示',
          content: '登录失败，请返回再试',
        });
      }
    });
  },

  getUserInfo: function () {

    var currentPageObj = getCurrentPages();
    var currentPage = null;
    if (currentPageObj) {
      currentPage = currentPageObj[currentPageObj.length - 1].route;
    }



    var that = this;

    //先获取一次用户数据，小程序实际环境，在打开授权窗口后，会自动再触发一次 onshow
    wx.getUserInfo({
      success: function (res5) {
        // console.log('重新获取用户数据-success');
        // console.log(res5);
        //清除定位缓存
        // wx.setStorageSync('APP_LBS', null);
        // that.i7_pageNeedReload = true;
        if (!that.globalData.userInfo) {
          that.updateUserInfo(res5);
        }
        else {
          _loginCallback && _loginCallback();
        }
      },
      complete: function (res5) {

        // if (currentPageObj.length > 1) {
        //   //重其他页面返回来的
        //   callback && callback();
        //   return;
        // }

        console.log('重新获取用户数据-complete');
        console.log(res5);
        if (res5.errMsg != 'getUserInfo:ok') {
          // that.i7_onShow();
          //每次进入这里，都查询是否已经获取用户的数据
          if (!that.globalData.userInfo) {
            wx.showModal({
              title: '微信授权',
              content: '日日头等舱需要获取您必要的信息，才能为您提供优质高端的订餐服务。请放心，日日头等舱不会向任何第三方透露您的信息。是否重新授权登录？',
              cancelText: '先逛逛',
              cancelColor: '#999',
              confirmText: '重新授权',
              success: function (res3) {
                if (res3.confirm) {
                  // console.log('用户点击确定') ;
                  wx.openSetting({
                    success: function (res4) {
                      console.log(res4);
                      if (res4.authSetting['scope.userInfo']) {
                        //如果新的授权窗口是以对话框的形式打开，如开发者工具
                        console.log(res4);
                        // that.updateUserInfo(res4);
                        wx.getUserInfo({
                          success: function (res5) {
                            // console.log('重新获取用户数据-success');
                            // console.log(res5);
                            //清除定位缓存
                            wx.setStorageSync('APP_LBS', null);
                            that.updateUserInfo(res5);
                            // callback && callback();
                          },
                          complete: function (res5) {
                            // console.log('重新获取用户数据-complete');
                            // console.log(res5);
                            // if (res5.errMsg != 'getUserInfo:ok') {
                            //   // that.i7_onShow();
                            // }
                          }
                        });
                      }
                      else {
                        //用户没选择权限
                        _loging = false;
                        if (currentPage == homeUrl) {
                          _loginCallback && _loginCallback();
                          // callback && callback();
                        }
                        else {
                          if (appConfig.goHome) appConfig.goHome()
                          else wx.switchTab({
                            url: homeUrl
                          });
                        }

                      }
                    }
                  });
                }
                // else {
                //   //用户点击取消
                //   _loging = false;
                //   if (currentPage == homeUrl) {

                //     _loginCallback && _loginCallback();
                //     // callback && callback();
                //   }
                //   else {
                //     if (appConfig.goHome) appConfig.goHome()
                //     else wx.switchTab({
                //       url: homeUrl
                //     });
                //   }
                // }
              }
            });
          }
        }
      }
    });
  },

  updateUserInfo: function (info) {
    var that = this;

    that.request({
      url: 'API/setUserInfo',
      method: 'POST',
      data: {
        encryptedData: info.encryptedData,
        iv: info.iv
      },
      loading: '载入中...',
      success: function (error, data, res) {
        if (error) {
          _loging = false;
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: data
          });
          return;
        }

        that.globalData.userInfo = info.userInfo;
        _loginCallback && _loginCallback();


        // http://lbs.qq.com/qqmap_wx_jssdk/method-getsuggestion.html

        /**
         2  * 各地图API坐标系统比较与转换;
         3  * WGS84坐标系：即地球坐标系，国际上通用的坐标系。设备一般包含GPS芯片或者北斗芯片获取的经纬度为WGS84地理坐标系,
         4  * 谷歌地图采用的是WGS84地理坐标系（中国范围除外）;
         5  * GCJ02坐标系：即火星坐标系，是由中国国家测绘局制订的地理信息系统的坐标系统。由WGS84坐标系经加密后的坐标系。
         6  * 谷歌中国地图和搜搜中国地图采用的是GCJ02地理坐标系; BD09坐标系：即百度坐标系，GCJ02坐标系经加密后的坐标系;
         7  * 搜狗坐标系、图吧坐标系等，估计也是在GCJ02基础上加密而成的。 
         8  */

        // var lbs = wx.getStorageSync('APP_LBS') || null;

        // if (!!lbs) {
        //     that.globalData.lbs = {
        //         cityId: lbs.cityId,
        //         lat: lbs.lat,
        //         lng: lbs.lng,
        //         reload: false
        //     };

        //     that.globalData.userInfo = info.userInfo;
        //     _loginCallback && _loginCallback();

        //     _loging = false;
        // } else {
        //     console.log('userInfo 2: ');
        //     console.log(info.userInfo);
        //     that.getLocation(info);
        // }
      },
      fail: function () {
        _loging = false;
        wx.showModal({
          showCancel: false,
          title: '温馨提示',
          content: '登录失败，请返回再试',
        });
      }
    });
  },
  getLocation_times: 50,//定位的重试次数
  getLocation: function (callback) {
    var that = this;

    // setTimeout(function () {
    //     wx.showLoading({
    //         title: '定位中...'
    //     });
    // }, 100);

    wx.getLocation({
      type: 'gcj02',
      success: function (loc) {
        // wx.hideLoading();

        // 大于1KM,提示
        // if (!loc || loc.accuracy > 1000) {
        //   that.getLocation_times--;
        //   if (that.getLocation_times>0){
        //     that.getLocation();
        //   }
        //   else{
        //     console.log('定位数据：');
        //     console.log(loc);
        //        wx.showModal({
        //         title: '提示',
        //         content: '为了为您提供更好的服务，请重新获取您的位置。',
        //         success: function(res) {
        //             if (res.confirm) {
        //                 that.getLocation();
        //             } else if (res.cancel) {
        //                 that.getLocationCallback(loc, info);
        //             }
        //         }
        //     });
        //   }

        // } else {
        //     that.getLocationCallback(loc, info);
        // }
        console.log('获取经纬度：');
        console.log(loc);
        that.getLocationCallback(loc, callback);
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '微信授权',
          content: '日日头等舱需要获取您的定位信息，才能为您提供准确的订餐服务。是否重新获取您现在的位置？',
          cancelText: '先逛逛',
          cancelColor: '#999',
          confirmText: '重新获取',
          success: function (res3) {
            if (res3.confirm) {
              console.log('用户点击确定-重新获取经纬度');
              wx.openSetting({
                success: function (res4) {
                  console.log(res4);
                  if (res4.authSetting['scope.userLocation']) {
                    console.log(res4);
                    wx.getLocation({
                      type: 'gcj02',
                      success: function (loc) {
                        console.log('重新获取经纬度：');
                        console.log(loc);
                        that.getLocationCallback(loc, callback);
                      }
                    });
                  }
                  else {
                    //默认位置为海心沙
                    that.getLocationCallback({}, callback);
                  }
                }
              });
            }
            else {
              //用户点击取消
              //默认位置为海心沙
              that.getLocationCallback({}, callback);
            }
          }
        });
      }
    });
  },

  getLocationCallback: function (loc, callback) {
    loc = loc || {};
    var lat = loc.latitude;
    var lng = loc.longitude;

    if (!lat || !lng) {
      // 海心沙
      lat = '23.110965';
      lng = '113.324496';
    }

    // 缓存lbs
    wx.setStorageSync('APP_LBS', {
      cityId: 440100, // TODO: 暂时写死
      lng: lng,
      lat: lat
    });

    this.globalData.lbs = {
      lat: lat,
      lng: lng,
      cityId: 440100, // TODO: 暂时写死
      reload: true//false
    };

    // console.log(this.globalData.lbs);

    // if (info && info.userInfo) this.globalData.userInfo = info.userInfo;
    callback && callback();

    // console.log('userInfo 3: ');
    // console.log(info.userInfo);

    _loging = false;
  },

  showToast: function (options) {
    if (!_toast) {
      _toast = new WeToast.WeToast();
    }

    _toast.toast({
      title: options.title
    });
  },
  getFullUrl: function (url) {
    return ORIGIN
      + (url.substr(0, 1) == '/' ? url : '/' + url)
      + '?datatype=json&wa_app_id=' + appConfig.appId;
  },
  /**
   * 扩展参数
   * loading: false/String,默认false
   * success(error, data, res)
   */
  request: function (options) {
    if (!/^https?:\/\//i.test(options.url)) {
      options.url = ORIGIN
        + (options.url.substr(0, 1) == '/' ? options.url : '/' + options.url)
        + '?datatype=json&wa_app_id=' + appConfig.appId;
    }

    if (typeof (options.data) == 'string') {
      options.data += '&random=' + Math.random();

      if (_sessionid) {
        options.data += '&sessionid' + _sessionid;
      }
    } else {
      options.data = Util.extend({
        'random': Math.random()
      }, options.data || {});

      if (_sessionid) {
        options.data = Util.extend({
          'sessionid': _sessionid
        }, options.data);
      }
    }

    options.header = Util.extend({
      'content-type': 'application/x-www-form-urlencoded'
    }, options.header || {});

    // var complete = options.complete;
    // options.complete = function () {
    //     if (options.loading) {
    //         wx.hideLoading();
    //     }

    //     complete && complete();
    // };

    var success = options.success;
    options.success = function (res) {
      if (options.loading) {
        wx.hideLoading();
      }

      success && success(res.data.error, res.data.msg, res);
    };

    var fail = options.fail;
    options.fail = function (res) {
      if (options.loading) {
        wx.hideLoading();
      }

      fail && fail(res);
    };

    if (options.loading) {
      wx.showLoading({
        title: options.loading,
      });
    }

    wx.request(options);
  },

  getUrl: function (url) {
    url = url || '';
    // url需要含/才处理
    // 过滤掉一些如下地址
    // action:location
    // action:order/delorder
    if (!/^https?:\/\//i.test(url) && url.indexOf('action:') != 0) {
      url = ORIGIN + (url.substr(0, 1) == '/' ? url : '/' + url);
    }

    return url;
  },

  // URL映射
  getPageUrl: function (url) {
    url = this.getUrl(url);

    // /pages/order/order?id=店铺id
    // /pages/order/order?id=店铺id&cartType=groupBuy&empty_orderid=xx
    // /pages/order/order?id=店铺id
    // /pages/order/order_ts?id=店铺id
    // /pages/me/order_detail?id=订单id
    // /pages/me/order_ts?id=订单id


    // 分类
    // /wxsite/shoplist/typelx/wm/typeid/229
    // /wxsite/shoplist/typelx/wm/cartType/groupBuy/empty_orderId/91 团体订餐第一步,typeid=0
    // /pages/cat/cat
    if (url.indexOf('/wxsite/shoplist/') != -1) {
      var info = Util.getPathInfo(url, ['typeid', 'cartType', 'empty_orderId', 'empty_orderid', 'for_lady']);

      if (info.cartType == 'groupBuy') {
        url = '/pages/group/shop?cartType=groupBuy'
          + '&empty_orderid=' + (info.empty_orderId || info.empty_orderid);
      } else {
        url = '/pages/cat/cat?id=' + info.typeid
          + '&cartType=' + info.cartType
          + '&empty_orderid=' + (info.empty_orderId || info.empty_orderid);
      }
      if (info.for_lady != "") url += "&for_lady=1";
    }

    // 店铺
    // /wxsite/shopshow/typelx/wm/id/204
    // /wxsite/shopshow/typelx/wm/id/204/goodstype/0 (goodstype=0表示激活第1个tab,不需要)
    // wxsite/shopshow/typelx/wm/id/218/empty_orderid/101/cartType/groupBuy (团体订餐进入)
    // /pages/shop/shop?id=店铺id
    else if (url.indexOf('/wxsite/shopshow/') != -1) {
      var info = Util.getPathInfo(url, ['typelx', 'id', 'goodstype', 'cartType', 'empty_orderId', 'empty_orderid', 'for_lady']);
      url = '/pages/shop/shop?typelx=' + info.typelx
        + '&id=' + info.id
        + '&cartType=' + info.cartType
        + '&empty_orderid=' + (info.empty_orderId || info.empty_orderid);
      if (info.for_lady != "") url += "&for_lady=1";
      if (info.goodstype != "") url += "&goodstype=" + info.goodstype;
    }

    // 商品
    // /wxsite/foodshow/id/2004
    // /wxsite/foodshow/id/1999/cartType/directBuy
    // /wxsite/foodshow/id/2042/cartType/groupBuy/empty_orderid/185
    // /pages/shop/product?id=商品id
    else if (url.indexOf('/wxsite/foodshow/') != -1) {
      var info = Util.getPathInfo(url, ['id', 'cartType', 'empty_orderid', 'for_lady']);
      url = '/pages/shop/product?id=' + info.id
        + '&cartType=' + info.cartType
        + '&empty_orderid=' + info.empty_orderid;
      if (info.for_lady != "") url += "&for_lady=1";
    }

    // 商家介绍
    // /wxsite/getdetailinfo/typelx/wm/shopid/218
    // /pages/shop/intro?id=店铺id
    else if (url.indexOf('/wxsite/getdetailinfo/') != -1) {
      var info = Util.getPathInfo(url, ['typelx', 'shopid']);
      url = '/pages/shop/intro?typelx=' + info.typelx
        + '&id=' + info.shopid;
    }

    // 去支付
    // /wxsite/subshow/orderid/333
    // /pages/order/pay?id=订单id
    else if (url.indexOf('/wxsite/subshow/') != -1) {
      var info = Util.getPathInfo(url, ['orderid', 'payByOthers']);
      if (info.payByOthers == "") url = '/pages/order/pay?id=' + info.orderid;
      else url = '/pages/order/payByOthers?id=' + info.orderid;
    }

    // 订单详情
    // /wxsite/ordershow/orderid/337
    // /wxsite/ordershow/orderid/337/cartType/directBuy
    // /pages/me/order_detail?id=订单id
    else if (url.indexOf('/wxsite/ordershow/') != -1) {
      var info = Util.getPathInfo(url, ['orderid', 'cartType']);

      if (info.cartType == 'directBuy') {
        url = '/pages/me/order_ts?id=' + info.orderid;
      } else {
        url = '/pages/me/order_detail?id=' + info.orderid;
      }
    }

    // 团体订餐-第1步
    // /wxsite/groupbuy_step1?page_title=xxx
    // /pages/group/step1
    else if (url.indexOf('/wxsite/groupbuy_step1') != -1) {
      var info = Util.getPathInfo(url, ['for_lady']);
      url = '/pages/group/step1';
      if (info.for_lady != "") url = '/pages/group/step1_for_lady?for_lady=1';
    }

    // 团体订餐-第2步
    // /wxsite/groupbuy_step2/shopid/218 店铺直接跳过去,会自动生成empty_orderid
    // /wxsite/groupbuy_step2/shopid/218/empty_orderid/90
    // /pages/group/step2?shopid=xx&empty_orderid=xxx
    else if (url.indexOf('/wxsite/groupbuy_step2/') != -1) {
      var info = Util.getPathInfo(url, ['shopid', 'empty_orderId', 'empty_orderid', 'for_lady']);
      url = '/pages/group/step2?shopid=' + info.shopid
        + '&empty_orderid=' + (info.empty_orderId || info.empty_orderid);
      if (info.for_lady != "") url += "&for_lady=1";
    }

    //
    // https://wm.shiqiren.com/wxsite/news/id/44
    else if (url.indexOf('/wxsite/news/') != -1) {
      var info = Util.getPathInfo(url, ['id']);
      url = '/pages/me/msg?id=' + info.id;
    }

    //组饭局
    // /wxsite/fanju_detail?id=
    else if (url.indexOf('/wxsite/fanju_detail/') != -1) {
      var info = Util.getPathInfo(url, ['id']);
      url = '/pages/fanju/invite?id=' + info.id;
    }

    else if (url.indexOf('/wxsite/fanju_photos/') != -1) {
      var info = Util.getPathInfo(url, ['id']);
      url = '/pages/fanju/photos_view?id=' + info.id;
    }

    else if (url.indexOf('/wxsite/fanju_circle') != -1) {

      url = '/pages/fanju/circle';
    }

    // 没有映射的合法url,跳首页
    // 非法的url不做处理
    else if (url.indexOf('/wxsite') >= 0) {
      url = homeUrl;
    }

    return url;
  },

  parseShare: function (share) {
    share = share || {};

    var shareData = {
      title: share.sharetitle || '日日头等舱',
      path: this.getPageUrl(share.sharelink) || homeUrl,
    };

    var systemInfo = wx.getSystemInfoSync();
    if (systemInfo.platform == 'Web') {
      shareData = {
        title: share.sharetitle || '日日头等舱',
        link: ORIGIN + '/wxsite/App?module=App&path=' + (this.getPageUrl(share.sharelink) || homeUrl).substr(1).replace('?', '&'),//公众号
        desc: share.sharedesc,//公众号
        imgUrl: share.shareimgUrl//公众号
      };
    }

    return shareData;
  },

  isTabbarItem: function (url) {
    url = (url.indexOf('/') == 0) ? url : '/' + url;

    var arr = [
      homeUrl,
      '/pages/group/step1',
      '/pages/me/home'
    ];

    var result = false;
    for (var i = 0; i < arr.length; i++) {
      var path = arr[i];

      if (url.indexOf(path) == 0) {
        result = true;
        break;
      }
    }

    return result;
  },

  // i7_pageNeedReload:false,

  // i7_onShow: function (callback){



  //   _callbacks.push(callback);

  //   // if (_loging) return;

  //   console.log('shiqiren');
  //   console.log(getCurrentPages());

  //   var currentPageObj=getCurrentPages();
  //   var currentPage=null;
  //   if(currentPageObj){
  //     currentPage=currentPageObj[currentPageObj.length-1].route;
  //   }



  //   var that=this;

  //   //先获取一次用户数据，小程序实际环境，在打开授权窗口后，会自动再触发一次 onshow
  //   wx.getUserInfo({
  //     success: function (res5) {
  //       // console.log('重新获取用户数据-success');
  //       // console.log(res5);
  //       //清除定位缓存
  //       // wx.setStorageSync('APP_LBS', null);
  //       // that.i7_pageNeedReload = true;
  //       if (!that.globalData.userInfo){
  //         that.updateUserInfo(res5);
  //       }
  //       else{
  //         callback && callback();
  //       }
  //     },
  //     complete: function (res5) {

  //       // if (currentPageObj.length > 1) {
  //       //   //重其他页面返回来的
  //       //   callback && callback();
  //       //   return;
  //       // }

  //       console.log('重新获取用户数据-complete');
  //       console.log(res5);
  //       if (res5.errMsg != 'getUserInfo:ok') {
  //         // that.i7_onShow();
  //         //每次进入这里，都查询是否已经获取用户的数据
  //         if (!that.globalData.userInfo){
  //           wx.showModal({
  //             title: '微信授权',
  //             content: '日日头等舱需要获取您必要的信息，才能为您提供优质高端的订餐服务。请放心，日日头等舱不会向任何第三方透露您的信息。是否重新授权登录？',
  //             cancelText: '先逛逛',
  //             cancelColor: '#999',
  //             confirmText: '重新授权',
  //             success: function (res3) {
  //               if (res3.confirm) {
  //                 // console.log('用户点击确定') ;
  //                 wx.openSetting({
  //                   success: function (res4) {
  //                     console.log(res4);
  //                     if (res4.authSetting['scope.userInfo']) {
  //                       //如果新的授权窗口是以对话框的形式打开，如开发者工具
  //                       console.log(res4);
  //                       // that.updateUserInfo(res4);
  //                       wx.getUserInfo({
  //                         success: function (res5) {
  //                           // console.log('重新获取用户数据-success');
  //                           // console.log(res5);
  //                           //清除定位缓存
  //                           wx.setStorageSync('APP_LBS', null);
  //                           that.updateUserInfo(res5);
  //                           // callback && callback();
  //                         },
  //                         complete: function (res5) {
  //                           // console.log('重新获取用户数据-complete');
  //                           // console.log(res5);
  //                           // if (res5.errMsg != 'getUserInfo:ok') {
  //                           //   // that.i7_onShow();
  //                           // }
  //                         }
  //                       });
  //                     }
  //                     else {
  //                       //用户没选择权限
  //                       _loging = false;
  //                       if (currentPage =="pages/index/index"){
  //                         that.getLocationCallback();
  //                         // callback && callback();
  //                       }
  //                       else{
  //                         wx.switchTab({
  //                           url: '/pages/index/index',
  //                           success: function(res) {},
  //                           fail: function(res) {},
  //                           complete: function(res) {},
  //                         })
  //                       }

  //                     }
  //                   }
  //                 });
  //               }
  //               else {
  //                 //用户点击取消
  //                 _loging = false;
  //                 if (currentPage == "pages/index/index") {

  //                   that.getLocationCallback();
  //                   // callback && callback();
  //                 }
  //                 else {
  //                   wx.switchTab({
  //                     url: '/pages/index/index',
  //                     success: function (res) { },
  //                     fail: function (res) { },
  //                     complete: function (res) { },
  //                   })
  //                 }
  //               }
  //             }
  //           });
  //         }
  //       }
  //     }
  //   });
  // },

  globalData: {
    // QQ MAP key
    QQ_MAP_KEY: 'TJYBZ-Y363D-BHG4I-PZ5E3-AJVL6-KTFKB',

    // 是否绑定手机
    isBindPhone: false,

    userInfo: null,

    // 标识页面需要刷新
    reload: false,

    // 购物车地址选择后缓存的数据
    address: null,

    // 传给编辑地址的参数
    editAddress: null,

    // 手机绑定成功后的缓存
    mobile: null,

    // 订单详情被删除的订单id
    deleteOrderId: 0,

    // 消息被读数
    message: 0,

    // 当前lbs信息
    // {
    //     cityId: 1, // 城市ID
    //     lat: null,
    //     lng: null,
    //     reload: true // 是否需要刷新定位信息
    // } 
    lbs: null
  }
})