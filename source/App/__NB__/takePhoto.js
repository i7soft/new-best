//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :takePhoto.js
//        description : 拍照插件。
//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L = require('./utils/L');
var slideUp='nb-animate-slide-up',slideDown='nb-animate-slide-down';


var isApp=NB && NB.IsApp,isWechat=NB && NB.IsWechat,isMobile=NB.IsMobile,isWeb=NB.IsWeb;//可以根据平台的不同，向用户展示不同的分享界面

//NBConfig 是 NewBest 框架的全局配置
// var themeColor=(NBConfig && NBConfig.themeColor) || '#3cc51f';//主题颜色

function setData(that,data){
    that.setData(data);
}

function triggerEvent(that,eventName,options){
    that.triggerEvent(eventName,options);
}

//使用外部的 css class
var iconFont=['','down-arrow','flash','switch-camera','setting','magicwand','go-back','clock','close'];
var externalClasses=[slideUp,slideDown];
for(var i=0;i<iconFont.length;i++){
    var item=iconFont[i];
    externalClasses.push('nb-icon'+(item?'-'+item:''));
}

var storageKey="nb:takePhoto";

//保存 camera 设置
function saveCameraOption(key,value){
    var options=getCameraOptions();
    options[key]=value;
    wx.setStorage({
        key: storageKey,
        data: options
    });
}

//获取相机设置
function getCameraOptions(){
    
    var options=wx.getStorageSync(storageKey) || {};
    if(typeof options !='object')options={};
   
    return options;
}

function createAnimation(OBJECT){
    return wx.createAnimation(OBJECT);
}

//水平仪动画
var levelAnimation=createAnimation({
    duration: 0,
    transformOrigin:'50% 0'
});

// //倒计时动画
// var countDownAnimation=createAnimation({
//     duration: 200
// });


//弹出菜单动画
var menuAnimationDuration=100;

var menuAnimation=createAnimation({duration: menuAnimationDuration});

function showMenu(that,key){
    menuAnimation.translateY(0).opacity(1).step();
    var data={};
    data[key]=true;
    data[key+'Animation']=menuAnimation.export();
    setData(that,data)
}

function hideMenu(that,key){
    menuAnimation.translateY('-100%').opacity(0).step();
    var data={};
    data[key+'Animation']=menuAnimation.export();
    setData(that,data);
    //动画结束
    setTimeout(function(){
        data={};
        data[key]=false;
        setData(that,data)
    },menuAnimationDuration);
}

var flashMenu=[];
var flashMenuItems=['Auto','Open','Close'];
for(var i=0;i<flashMenuItems.length;i++){
    var item=flashMenuItems[i];
    flashMenu.push(L(item))
}

var clockMenu=[L('Close')];
var clockMenuItems=[3,5,10];
for(var i=0;i<clockMenuItems.length;i++){
    var item=clockMenuItems[i];
    clockMenu.push(item+' '+L('seconds'))
}

function setFlashProp(value){
    var res='auto';
    if(value==1) res='on';
    else if(value==2) res='off';
    return res;
}

function takePhoto(that){
  
    var ctx = wx.createCameraContext(that);
    
    ctx.takePhoto({
        success: function(res) {
          
            triggerEvent(that,'takephoto',{src:res.tempImagePath});
            that.hide();//todo:增加编辑图片功能
        }
    })
}

var countDownValue=0;
var countDown_animationStatus=0;

Component({

    externalClasses:externalClasses,

    /**
     * 组件的属性列表
     */
    properties: {
  
        show: {
            type: Number,
            value: 0,
            observer: function (newVal) {
                var that=this;
                // var properties=that.properties;
             
                if(newVal){
                    
                    var cameraOptions=getCameraOptions();
                    
                    var flashSelected=cameraOptions.flash ||0;
                  
                    setData(that,{
                        devicePosition:cameraOptions.devicePosition || 'back',
                        displayGridLines:cameraOptions.gridLines || false,
                        flashSelected:flashSelected,
                        flash:setFlashProp(flashSelected),
                        clockSelected:cameraOptions.clock ||0,
                        animationName:slideUp,
                        _show: true,
                    });
                }
                
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        _show:false,
        animationName:'',
        cameraDone:false,
        flash:'auto',
        showFlash:isApp,//是否启用闪光灯（网页版没有这个功能）
        flashSelected:0,
        clockSelected:0,
        devicePosition:'',
        levelAnimation:{},//水平仪动画
        cameraLevel:false,//是否显示水平仪
        text_displayGridLines:L('Display grid lines'),

        displayGridLines:false,
        flashMenuItems: flashMenu,
        clockMenuItems: clockMenu,
        countDown:false,
        countDownAnimation:'',
        countDownValue:0
    },


    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            if(that.willHide){
                that.willHide=false;
                setData(that,{_show:false})
            }
        },
        hide:function(){
            var that=this;
            that.willHide=true;
            wx.stopDeviceMotionListening();
            setData(that,{animationName:slideDown});
        },
        //相机初始化完成，可以进行拍照
        camera_onInitDone:function(){
            var that=this;
            setData(that,{cameraDone:true});
            wx.onDeviceMotionChange(function(res){
                //旋转水平仪

                var rotate=-res.gamma;
                if(res.beta>90){
                    rotate=res.gamma;
                }

                levelAnimation.rotate(rotate).step();
                setData(that,{levelAnimation:levelAnimation.export()});

            });
            wx.startDeviceMotionListening({interval:'ui', success:function(){
                setData(that,{cameraLevel:true})
            }});
        },
        //切换前后置摄像头
        switchCamera:function(){
            var that=this;
            var devicePosition=that.data.devicePosition=='back'?'front':'back';
            saveCameraOption('devicePosition',devicePosition);
            setData(that,{devicePosition:devicePosition});
        },
        //拍照
        takePhoto:function(){
            var that=this;

            var clockSelected=that.data.clockSelected;
            if(clockSelected==0){
                takePhoto(that);
            }
            else{
                countDownValue=clockMenuItems[clockSelected-1];

                countDown_animationStatus=0;
                setData(that,{
                    countDown:true,
                    countDownAnimation:'countdown-fadeIn',
                    countDownValue:countDownValue
                });
    
            }

          
        },
        countDown_onAnimaitonEnd:function(){
            var that=this;

            if(countDown_animationStatus==0){
                countDown_animationStatus=1;
                setData(that,{
                    countDownAnimation:'countdown-fadeIn countdown-fadeOut',
                });
            }
            else{
                countDownValue--;

                if(countDownValue==0){
                    takePhoto(that);
                    setData(that,{
                        countDown:false
                    });
                }
                else{
                    countDown_animationStatus=0;
                    setData(that,{
                        countDownValue:countDownValue,
                        countDownAnimation:'countdown-fadeIn',
                        
                    });
                }
            }

           
        },
        toggleMenu:function(e){
            var key=e.currentTarget.dataset.key;
            var that=this;
            if(that.data[key]){
                hideMenu(that,key);
            }
            else{
                showMenu(that,key);
            }
        },
        none:function(){
            //do nothing
        },
        switchDisplayGridLines_onChange:function(res){
            var value=res.detail.value;
            saveCameraOption('gridLines',value);
            setData(this,{
                displayGridLines:value
            })
        },
        flash_onChange:function(res){
            var value=res.detail.value;
            saveCameraOption('flash',value);
            
            setData(this,{
                flashSelected:value,
                flash:setFlashProp(value)
            });

            hideMenu(this,'flashMenu');
        },
        clock_onChange:function(res){
            var value=res.detail.value;
            saveCameraOption('clock',value);
            
            setData(this,{
                clockSelected:value
            });

            hideMenu(this,'clockMenu');
        }
    },
    
})