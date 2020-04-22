NBConfig = {
    debug: true,//控制业务代码的是否调试
    devtools:{
        eruda:'//cdn.bootcss.com/eruda/1.5.7/eruda.min.js',
        VConsole:'//cdn.bootcss.com/vConsole/3.3.2/vconsole.min.js'
    },
    appId:"com.shiqiren.app",
    appName: "十七人世界",
    version:"1.0.17",
    themeColor:'#0894ec',//控件渲染的默认主题颜色
    scheme:"bobo",

    // http://cbutech.net/index.php/archives/264
    // or
    // https://polyfill.io/v3/url-builder/
    polyfill:"https://cdn.bootcss.com/babel-polyfill/7.8.7/polyfill.min.js",
    
    //首页（可以根据不同的情况设置不同的首页）
    home:{
       
        path:function(){
            return 'pages/test/component/view/index/index';
        },
        showGoHomeButton:true,//显示返回首页的按钮
    },
   
    url:{
        debug:'http://localhost:4001',
        release:'http://nb.shiqiren.com'
    },
    rootPath:{
        debug:'App',//正式发布时，建议将此目录删除，避免泄露您的源代码
        release:'App'
    },
    
    

    //框架准备好，在初始化模块之前
    onReady:function(){
        // console.log('hello bobo');
    },

    onBeforeLoadModule:function(){

    },

    onAfterLoadModule:function(){

    },

    onBeforeLoadPage:function(){

    },

    onAfterLoadPage:function(){

    },

    //页面动画优先顺序规则：
    //在 wx.navigateTo 和 wx.switchTab 可以追加参数 onPageLoadAnimation 和 onPageUnloadAnimation
    //onPageLoadAnimation 定义了在将要打开的页面和前一个页面，应该执行什么动画
    //onPageUnloadAnimation 定义了在将要卸载的页面和前一个页面，应该执行什么动画
    //优先顺序是：
    //1. 在 wx.navigateTo 和 wx.switchTab 定义的动画优先级最高
    //2. 如果上一条不满足，则执行下面的全局动画配置
    pageAnimation:{
        navigateTo:{
            onPageLoadAnimation:{//页面进入时动画
                fromPage:function(){
                    var animation = NB.createAnimation({
                        duration: 400,
                        timingFunction: 'ease',
                    });
                    animation.opacity(0).translateX('-10%').step({duration: 1000});
                    return animation.export();
                    // return NB.createAnimation({duration:1}).opacity(0).step().export();
                },
                toPage:function(){
                    var animation = NB.createAnimation({
                        duration: 0,
                        timingFunction: 'ease',
                    });
                    animation.translateX('100%').opacity(1).step();
                    animation.translateX(0).step({duration: 400});
                    return animation.export();
                }
            },
            onPageUnloadAnimation:{//页面退出时动画
                fromPage:function(){
                    var animation = NB.createAnimation({
                        duration: 400,
                        timingFunction: 'ease',
                    });
                    animation.translateX('100%').step();
                    return animation.export();
                },
                toPage:function(){
                    var animation = NB.createAnimation({
                        duration: 400,
                        timingFunction: 'ease',
                    });
                    animation.opacity(1).translateX(0).step({duration: 400});
                    return animation.export();
                }
            }
        },
        //switch 的动画只在 switch 的 tab 相互切换时有效
        switchTab:{
            onPageLoadAnimation:{//页面进入时动画
                fromPage:function(){
                    return NB.createAnimation({duration:0}).opacity(0).translateX('100%').step().export();
                },
                toPage:function(){
                    return NB.createAnimation({duration:0}).opacity(1).translateX(0).step().export();
                },
            }
        }
    },

    runtime:{//不同平台的独立配置
        web:{//浏览器应用
            //自行处理浏览器的跨域请求
            crossDomain:function(options){
                var flag_debug=NBConfig.debug;
                var domain=NBConfig.url[flag_debug?'debug':'release'];
                var url=options.url;
                if(url.indexOf(domain)==-1 ){
                    options.header["nb-origin-url"]=url;
                    options.url='https://www.shiqiren.com/API/domainAgent'
                }
               
            },
            showDevTools:(function(){//只在debug=true || location.hash=='showDevTools' 起作用
               
                return true;//也可以根据条件选择性打开，如针对某个用户等
            })(),
            map:{
                use:'amap',
                amap:{
                    key:'29228e017363979fddcc9352334aab5e'
                },
            }
        },
        desktop:{//桌面程序
            // path:'pages/index/index',
        }
    }
};