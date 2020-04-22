//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :previewImage.js
//        description : 图片预览。
//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');
var NbTouch=require('./utils/Touch');
var fadeIn='nb-animate-fade-in',fadeOut='nb-animate-fade-out';

var GraphicCode=require('./graphicCode/index');

var Common=require("./utils/Common");


var isApp=NB && NB.IsApp,isWechat=NB && NB.IsWechat,isMobile=NB.IsMobile,isWeb=NB.IsWeb,isAndroid=NB.IsAndroid;//可以根据平台的不同，向用户展示不同的分享界面

function push(array,item){
    array.push(item);
}

var math=Math;

function math_abs(value){
    return math.abs(value)
}

function math_round(value,count){
    count=count || 1;
    return math.round(value*count)/count;
}

function getSystemInfoSync(){
    return wx.getSystemInfoSync();
}

function setData(that,data){
    that.setData(data);
}

function triggerEvent(that,eventName,options){
    that.triggerEvent(eventName,options);
}

function createAnimation(OBJECT){
    return wx.createAnimation(OBJECT);
}



var clientWidth,clientHeight;

var imageItemMargin=15;//每个 item 的边距

var frameItemWidth;
var currentFrameLeft=0;//当前 frame 的位置


var currentImageIndex;//当前选中的图片 index
var currentItemIndex;
var imagesCount;//图片个数
var moveDirection;//移动方向，false：左移 true：右移
var urls;//图片的路径数组
var imageCache;//图片数据缓存
var maxItemsIndex=1;
var leftItemIndex,//frame 最左边 item 的 id
rightItemIndex,//frame 最右边 item 的 id
leftItemLeft,//frame 最左边 item 的位置
rightItemLeft;//frame 最右边 item 的位置

var flag_frameMove;

var ts_frameMoveStart;//frame 开始移动的时间戳
var frameMoveStartX;//frame 开始移动的 x 坐标
var ts_frameMovePrev;//记录 frame 移动时上一次的时间戳
var frameMovePrevX;//记录 frame 移动时上一次的 x 坐标

var frameMoveStartY,frameMovePrevY;

var frameFinishNextItemLeft;//frame 移动结束时下一帧应该出现的位置
var frameFinishNextItemSourceIndex;//frame 移动结束时下一帧的图片 id
var frameFinishNextItemIndex;//frame 移动结束时下一帧的 id


var touchList=[],animationList=[];

var flag_autoHideControlBar;
var flag_controlBarIsShow=true;
var flag_willCloseDialog;

var moveDirectionState='';//"":初始状态 v：垂直方向 h:水平方向

var wrapperAnimation,viewAnimation,frameAnimation,controlBarAnimation;

var imagesBuffer={};

var timer_openMenu;
var flag_showActionSheet;
var ts_singleTap=0;
var timer_singleTap;

function getAnimationOptions(duration){
    return {
        duration: duration || 0,
        timingFunction: 'linear'
    };
}

function initConfig(that){

    if(!wrapperAnimation){
        wrapperAnimation=createAnimation(getAnimationOptions());

        viewAnimation=createAnimation(getAnimationOptions());

        controlBarAnimation=createAnimation(getAnimationOptions(350));
    }

    var systemInfo=getSystemInfoSync();
    //需要铺满整个浏览器可视区域，但小程序没有 client 的尺寸信息，可以取 screen 信息
    clientWidth=systemInfo.clientWidth || systemInfo.screenWidth;
    clientHeight=systemInfo.clientHeight || systemInfo.screenHeight;

    flag_frameMoveFinish=true;
    flag_canTouchMove=true;
    frameItemWidth=clientWidth+imageItemMargin*2;
    currentFrameLeft=0;
    leftItemIndex=0;
    rightItemIndex=maxItemsIndex*2;
    isScale=false;
    leftItemLeft=-maxItemsIndex*frameItemWidth;
    rightItemLeft=maxItemsIndex*frameItemWidth;

    currentItemIndex=1;


    if(flag_autoHideControlBar){
        //自动隐藏控制栏
        setTimeout(function(){

            controlBarAnimation.opacity(0).step({duration:350});

            flag_autoHideControlBar=false;
            flag_controlBarIsShow=false;

            setData(that,{
                controlBarAnimation:controlBarAnimation.export()
            })

        },2000);
    }
}

function initItems(that){


    var items=[];

    var l=imagesCount;

    var thatIndex,itemData;

    var i=currentImageIndex-maxItemsIndex;

    var ii=currentImageIndex+maxItemsIndex;
    
    if(urls.length==1){
        currentItemIndex=0;
        i=ii=currentImageIndex;
    }


    var thatIndex=i;

    touchList=[];
    animationList=[];

    while(i<=ii){
        if(i<0){
            thatIndex=l+i%l;
        }
        else if(i>=l){
            thatIndex=i%l;
        }
        else thatIndex=i;

        itemData=imageCache[thatIndex];
        if(!itemData){
            itemData=imageCache[thatIndex]={
                i:thatIndex,
                u:urls[thatIndex],
                w:clientWidth,
                h:clientHeight,
                l:i*frameItemWidth
            }
        }
        else{
            //复制数据
            itemData={};
            for(var x in imageCache[thatIndex]){
                itemData[x]=imageCache[thatIndex][x];
            }
            itemData.l=i*frameItemWidth;
        }
        push(items,itemData);

        
        push(touchList,new NbTouch(that,{
            area:{
                width:clientWidth,
                height:clientHeight
            },
            view:{
                width:clientWidth,
                height:clientHeight,
                scaleMinBuffer:0.1,
                scaleMaxBuffer:2.5,
                scaleDoubleTap:2,
                direction:'all',
                inertia:true,
                outOfBounds:true,
                fixedInCenter:true,
                damping:100,
            },
            bindchange:itemChange
        },touchList.length));

        i++;
    }


    return items;
}


//响应双指事件
function itemChange(e){
    var that=this;
    var detail=e.detail;
    var itemIndex=detail.data;

    // console.log(detail)
    if(detail.source=='init'){
        return;
    }

    var animation=animationList[itemIndex];
    if(!animation){
        animation=animationList[itemIndex]=createAnimation({
            duration: 0,
            transformOrigin:'0 0'
        });
    }

    //重要：必须先设置放大倍数，再设置偏移
    animation.scale(detail.scale).translate3d(detail.x,detail.y,0).step();

    var data={};
    data['_items['+itemIndex+'].a']=animation.export();
    setData(that,data);
}

function getMaxValue(value,maxValue){
    var res=value
    if(value>maxValue) res= 0;
    return res;
}

function getMinValue(value,maxValue){
    var res=value;
    if(value<0) res= maxValue;
    return res;
}

function copy(text){
    wx.setClipboardData({
        data:text,
        success:function(){
            wx.showToast({title:L('Copy successful'),icon:'none'});
        },
        fail:function(){
            wx.showToast({title:L('Copy failed'),icon:'none'});
        }
    })
}

Component({

    externalClasses:[fadeIn,fadeOut,'nb-icon','nb-icon-close','nb-icon-view-module','nb-icon-download','button-hover','icon-loading','nb-loading','nb-loading-icon'],

    /**
     * 组件的属性列表
     */
    properties: {
        
        urls:Array,
        current:String,
        show: {
            type: Number,
            value: 0,
            observer: function (newVal) {
                var that=this;
                var properties=that.properties;
                imageCache=[];//清空图片缓存数据
                if(newVal){

                    flag_autoHideControlBar=true;//开始的时候会自动隐藏控制栏
                    flag_controlBarIsShow=true;

                    initConfig(that);
                 
                    currentImageIndex=0;
                    urls=properties.urls;
                    var l=urls?urls.length:0;

                    if(l==0){
                        wx.showToast({title:L('No images to preview'),icon:'none'});
                        that.hide();
                        return;
                    }

                    
                    for(var i=0;i<l;i++){
                        if(urls[i]==properties.current){
                            currentImageIndex=i;
                            break;
                        }
                    }
 
                 
                    imagesCount=l;
                    var items=initItems(that);

                    var duration={duration:0};

                    frameAnimation=createAnimation(duration);

                    default_frameLeft=-clientWidth-imageItemMargin*3;

                    frameAnimation.translate3d(0,0,0).step();
               
                    viewAnimation.scale(1).translate3d(0,0,0).step(duration);

                    wrapperAnimation.backgroundColor('rgba(0,0,0,1)').step(duration);

                    controlBarAnimation.opacity(1).step(duration);
                    
                    setData(that,{ 
                        _show: newVal,
                        _size:imagesCount,
                        _currentIndex:currentImageIndex,
                        // _hideControlBar:false,
                        animationName:fadeIn,
                        _items:items,//界面上最多显示3个，其他的通过滑动的时候再动态切换
                        frameAnimation:frameAnimation.export(),
                        wrapperAnimation:wrapperAnimation.export(),
                        viewAnimation:viewAnimation.export(),
                        controlBarAnimation:controlBarAnimation.export()
                    });

                    triggerEvent(that,'success');
                }
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        NB:NB,
        _show:0,
        animationName:'',
        frameAnimation:{},
        wrapperAnimation:{},
        viewAnimation:{},
        controlBarAnimation:{},
        // _hideControlBar:false,
        _items:[],
        _margin:imageItemMargin,
        _currentIndex:0,
        _size:0,
        title_downloadImage:L('Download image'),
        _saveImageUrl:'',
        text_longPressSaveImage:L('Please long press the image to save to album'),
        text_copy:L('Copy to clipboard'),
        text_copyLink:L('Copy image link to clipboard'),
        dialogType:'',
        blur:false,
        showDialog:false,
        dialog_animationName:'',
        scanResult:'',
        shareQrcodeSrc:'',
    },


    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            if(that.willHide){
                that.willHide=false;
                that.setData({_show:0})
            }
        },
        hide:function(){
            var that=this;
            that.willHide=true;
            that.setData({animationName:fadeOut,_items:[]});
        },
        //frame 里面图片加载成功事件
        onFrameImageLoad:function(e){
   
        
            var that=this;
            var detail=e.detail;
            var dataset=e.currentTarget.dataset;
 
            
            var itemId=dataset.index;
            var imageIndex=dataset.sourceIndex;

            var itemData=imageCache[imageIndex];

            // if(itemData.w2) return;//w2 图片实际宽度

            var image_width=detail.width;
            var image_height=detail.height;

            var new_width,new_height;

            var image_radio=image_width/image_height;
            var client_radio=clientWidth/clientHeight;

            if(image_radio>client_radio){//计算图片可视尺寸
                new_width=clientWidth;
                new_height=new_width/image_radio;
            }
            else{
                new_height=clientHeight;
                new_width=new_height*image_radio;
            }

            new_width=math_round(new_width,10);
            new_height=math_round(new_height,10);

            var offset_x=math_round((clientWidth-new_width)/2,10),
                offset_y=math_round((clientHeight-new_height)/2,10);//计算图片所在位置

            var scaleValue=math_round(new_width/image_width,1000);//保留两位小数
            
            itemData.w=image_width;
            itemData.h=image_height;
            itemData.o=1;

            var touch=touchList[itemId];
            var touch_view=touch.view;
       
           

            var scaleMin=scaleValue;

            var scaleDoubleTap=1;

            if(image_width<=clientWidth && image_height<=clientHeight){

                scaleValue=scaleMin=1;

                scaleDoubleTap=0;

                offset_x=math_round((clientWidth-image_width)/2,10);
                offset_y=math_round((clientHeight-image_height)/2,10)
            }
      

            var scaleMinBuffer=scaleValue-0.5;

            touch_view.width=image_width;
            touch_view.height=image_height;
            touch_view.scaleValue=scaleValue;
            touch_view.scaleMin=scaleMin;
            touch_view.scaleMax=1;
            touch_view.scaleMaxBuffer=2;
            touch_view.scaleMinBuffer=scaleMinBuffer;
            touch_view.scaleDoubleTap=scaleDoubleTap;



            touch.setValue(offset_x,offset_y,scaleValue,true);


            var data={};
            data['_items['+itemId+'].w']=image_width;
            data['_items['+itemId+'].h']=image_height;
            data['_items['+itemId+'].o']=1;
            setData(that,data);
        },
        waitOpenMenu:function(){
            var that=this;
            if(timer_openMenu)clearTimeout(timer_openMenu);
            timer_openMenu=setTimeout(function(){
                that.onFrameLongPress();
            },350);
        },
        //frame 开始拖放
        onFrameTouchStart:function(e){

            this.waitOpenMenu();
           
            var touches=e.touches;
            if(!touches)touches=e.touches=[e];

            var touchCount=touches.length;

            var touch=touchList[currentItemIndex];
            touch.touchstart(e);
       

            if(touchCount==1){
              
                var detail=e.detail;

                frameMoveStartX=frameMovePrevX=detail.x;
                frameMoveStartY=frameMovePrevY=detail.y;
    
                ts_frameMoveStart=ts_frameMovePrev=e.timeStamp;//结束滑动时用来判断滑动速度
            
            }

            moveDirectionState='';

            return false;
        },
        //frame 正在拖放
        onFrameTouchMove:function(e){

            if(flag_showActionSheet) return;//如果showActionSheet打开中，则不响应此事件

            if(timer_openMenu){
                clearTimeout(timer_openMenu);
                timer_openMenu=null;
            }

            var that=this;
            

            var touches=e.touches;
            if(!touches)touches=e.touches=[e];

            var touchCount=touches.length;

            var touch=touchList[currentItemIndex];
            
          
            var scaleState=touch.getState();

            var state_left=scaleState.left;
            var state_right=scaleState.right;

            var detail=e.detail;

            
            var start_x=frameMoveStartX;

            var now_x= frameMovePrevX=detail.x;

            flag_frameMove=false;

            
            if(touchCount==1 && (!scaleState.scale || (now_x-start_x>0 && state_left) || (now_x-start_x<0 && state_right))){

                var strat_y=frameMoveStartY;
                var now_y=frameMovePrevY=detail.y;
                var data={};

                var v=now_y-strat_y;

                //是否是沿数轴方向移动
                if(moveDirectionState==''){
                    moveDirectionState=(math_abs(now_x-start_x)<math_abs(v))?'v':'h';
                }

                if(moveDirectionState=='v' && !scaleState.scale && !flag_frameMove && v>0){
                    wrapperAnimation.backgroundColor('rgba(0,0,0,'+(1-v/500)+')').step({duration:0});
                    viewAnimation.scale(1-v/1000).translate3d(now_x-start_x,v,0).step({duration:0});

                    data.wrapperAnimation=wrapperAnimation.export();
                    data.viewAnimation=viewAnimation.export();
                    
                }
                else{
                   
                    flag_frameMove=true;

                    var frameLeft=currentFrameLeft+now_x-start_x;
            
    
                    frameAnimation.translate3d(frameLeft,0,0).step();
        
                    data.frameAnimation=frameAnimation.export();
                    ts_frameMovePrev=e.timeStamp;//结束滑动时用来判断滑动速度
                    
                   
                }

               
                setData(that,data);

                
            }
            else{
                touch.touchmove(e);
            }
           
        


            return false;//同时阻止冒泡和默认行为
        },
        //frame 结束拖放
        onFrameTouchEnd:function(e){

            if(timer_openMenu){
                clearTimeout(timer_openMenu);
                timer_openMenu=null;
            }

            var that=this;

            var touch=touchList[currentItemIndex];
            touch.touchend(e);

     
            if(flag_frameMove){

                
            
                var ts_now=e.timeStamp;

                var detail=e.detail;
                var prev_ts=ts_frameMoveStart;
                var start_x=frameMoveStartX;

                var now_x=detail.x;
                

                var offset_x=now_x-start_x;
                var abs_offsetX=math_abs(offset_x);
                var offset_ts=ts_now-prev_ts;

                var frameLeft=currentFrameLeft;

                var offset_x2=now_x-frameMovePrevX;
                var abs_offsetX2=math_abs(offset_x2);
                var offset_ts2=ts_now-ts_frameMovePrev;

                if(urls.length>1){
                    if(abs_offsetX>clientWidth/2 || (offset_ts<250 && abs_offsetX>20) || (offset_ts2<15 && abs_offsetX2==0)){
                        if(offset_x>0) frameLeft+=clientWidth+imageItemMargin*2;//右移
                        else frameLeft-=clientWidth+imageItemMargin*2;//左移
                    }
                }

                moveDirection=offset_x>0;

                var frameAnimation=createAnimation({
                    duration: 100,
                    timingFunction: 'linear',
                });

                

                frameAnimation.translate3d(frameLeft,0,0).step();

                var data={frameAnimation:frameAnimation.export()};

                var prev_itemIndex=currentItemIndex;

                if(currentFrameLeft!=frameLeft){

                    

                
                    currentFrameLeft=frameLeft;
                    //计算下一个 item 的位置
                    var maxIndex=imagesCount-1;
                    if(moveDirection){//右移
                        
                        currentImageIndex=getMinValue(currentImageIndex-1,maxIndex);

                        frameFinishNextItemSourceIndex=getMinValue(currentImageIndex-1,maxIndex);


                        frameFinishNextItemIndex=rightItemIndex;

                        rightItemIndex=getMinValue(rightItemIndex-1,maxItemsIndex*2);

                        leftItemIndex=getMinValue(leftItemIndex-1,maxItemsIndex*2);


                        rightItemLeft-=frameItemWidth;
                        leftItemLeft-=frameItemWidth;
                        frameFinishNextItemLeft=leftItemLeft;

                        currentItemIndex=getMinValue(currentItemIndex-1,maxItemsIndex*2);
                    }
                    else{//左移
        
                        currentImageIndex=getMaxValue(currentImageIndex+1,maxIndex);

                        frameFinishNextItemSourceIndex=getMaxValue(currentImageIndex+1,maxIndex);

                        frameFinishNextItemIndex=leftItemIndex;
                        
                        leftItemIndex=getMaxValue(leftItemIndex+1,maxItemsIndex*2);

                        rightItemIndex=getMaxValue(rightItemIndex+1,maxItemsIndex*2);

                        rightItemLeft+=frameItemWidth;
                        leftItemLeft+=frameItemWidth;

                        frameFinishNextItemLeft=rightItemLeft;

                        currentItemIndex=getMaxValue(currentItemIndex+1,maxItemsIndex*2);
                    }

                    

                    var nextIndex=frameFinishNextItemSourceIndex;
                    var moveItemIndex=frameFinishNextItemIndex;
                    var newLeft=frameFinishNextItemLeft;
                    var itemData=imageCache[nextIndex];
                    if(!itemData){
                        itemData=imageCache[nextIndex]={
                            i:nextIndex,
                            u:urls[nextIndex],
                            w:clientWidth,
                            h:clientHeight,
                            o:0,
                            a:{},
                            l:newLeft
                        };
                    }
                    else{
                        //复制数据
                        itemData={};
                        for(var x in imageCache[nextIndex]){
                            itemData[x]=imageCache[nextIndex][x];
                        }
                        itemData.l=newLeft;
                    }
                    data['_items['+moveItemIndex+']']=itemData;

                   
                }


                data._currentIndex=currentImageIndex;
                setData(that,data);
              
                if(prev_itemIndex!=currentItemIndex){
                    var prev_touch=touchList[prev_itemIndex];
                    prev_touch.setValue(undefined,undefined,prev_touch.view.scaleValue,false);
                }
            }
            else{
                if(moveDirectionState=='v'){//下滑关闭

                    var opacity=1,scale=1;

                    var duration={duration:100};

                    if(frameMovePrevY-frameMoveStartY>100){
                        opacity=0,scale=0;
                        viewAnimation.scale(scale).step(duration);
                    }
                    else{
                        viewAnimation.scale(scale).translate3d(0,0,0).step(duration);
                    }


                    wrapperAnimation.backgroundColor('rgba(0,0,0,'+opacity+')').step(duration);
                    
                    var data={
                        wrapperAnimation:wrapperAnimation.export(),
                        viewAnimation:viewAnimation.export()
                    };

                    if(opacity==0){
                        // that.willHide=true;
                        // data.animationName=fadeOut;
                        // data._items=[];
                        that.hide();
                    }

                    setData(that,data);
                }
            }

            return false;
        },
        //鼠标滚轮事件
        onFrameMouseWheel:function(e){
            touchList[currentItemIndex].mousewheel(e);
        },
        //长按图片
        onFrameLongPress:function(){
            this.onFrameLongPressDetail(currentImageIndex);
        },
        onFrameLongPressDetail:function(urlIndex){

            var that=this;

            var itemList=[L('Send to friend'), L('Save image')];
            var actionList=['share','save'];

            var tempCanvasId='tempCanvas';
            var tempImageSize=300;

            var qrcode_text,barcode_text;

            var url=urls[urlIndex];
            var imageBuffer=imagesBuffer[url];
            if(!imageBuffer)imageBuffer=imagesBuffer[url]={};
            

            //actionSheet 的回调
            var sheetCallback=function(tapIndex){
                var action=actionList[tapIndex];
                if(action=='save'){
                    that.downloadImage();
                }
                else if(action=="qrcode"){

                    if(qrcode_text.toLowerCase().indexOf('http')==0){
                        if(isWeb){
                            window.open(qrcode_text,'_blank');
                        }
                        else{
                            wx.navigateTo({
                                url:'/__NB__/webView?value='+encodeURIComponent(qrcode_text)
                            })
                        }
                    }
                    else{
                        setData(that,{
                            dialogType:'scanResult',
                            blur:true,
                            showDialog:true,
                            scanResult:qrcode_text,
                        })
                        setData(that,{
                            dialog_animationName:fadeIn
                        })
                    }
                   
                }
                else if(action=='barcode'){
                    wx.navigateTo({
                        url:'/__NB__/barCodeDetail?value='+encodeURIComponent(barcode_text)
                    })
                }
                else if(action=='share'){
                    Common.qrcode({
                        text:encodeURI(url),
                        canvasId:'qrcodeCanvas',
                        size:1200,
                        success:function(base64Url){
                            setData(that,{
                                dialogType:'share',
                                blur:true,
                                showDialog:true,
                                shareQrcodeSrc:base64Url
                            });
                            setData(that,{
                                dialog_animationName:fadeIn
                            })
                        }
                    },that);
                }
            };

            //打开 actionSheet
            var openSheet=function(){
                flag_showActionSheet=true;
                wx.showActionSheet({
                    itemList:itemList,
                    success:function(res) {
                        sheetCallback(res.tapIndex)
                    },
                    complete:function(){
                        flag_showActionSheet=false;
                    }
                })

                
            };

            openSheet();//先打开一次

            var next=function(){
                imageBuffer.status=0;//normal

                

                if(urlIndex!=currentImageIndex  || !flag_showActionSheet) return;
                

                //todo:编辑器暂时选择 MIT
                //https://www.npmjs.com/package/ng2-photo-editor
                // itemList.push(L('Edit'));
                // actionList.push('edit');

                openSheet();//再打开一次
                
            };

            if(imageBuffer.status){
                next();
                return;
            }

            var addQrcodeMenuItem=function(){
                itemList.push(L('Identify the QR code in the image'));
                actionList.push('qrcode');
            };

            var addBarcodeMenuItem=function(){
                itemList.push(L('Identify the bar code in the image'));
                actionList.push('barcode');
            };

           

            //尝试识别下二维码
            if(GraphicCode){
              
                
                qrcode_text=imageBuffer.qrcode;
                barcode_text=imageBuffer.barcode
                if(typeof qrcode_text !='undefined'){
                    
                    if(qrcode_text){
                        addQrcodeMenuItem();
                        next();
                    }
                }
                else if(typeof barcode_text !='undefined'){
                    
                    if(barcode_text){
                        addBarcodeMenuItem();
                        next();
                    }
                }
                else{

                    var imageBuffer=imagesBuffer[url]={};
                    imageBuffer.status=1;//busy
                    wx.downloadFile({
                        url:url, 
                        success:function(res) {
                            var tempUrl=res.tempFilePath;

                            //获取图片信息
                            wx.getImageInfo({
                                src: tempUrl,
                                success:function(res) {
                                    var image_width=res.width;
                                    var image_height=res.height;

                                    var drawWidth=tempImageSize;
                                    var drawHeight=tempImageSize;

                                    if(image_width>image_height){
                                        drawHeight=image_height*drawWidth/image_width;
                                    }
                                    else{
                                        drawWidth=image_width*drawHeight/image_height;
                                    }

                                    //缩小图片，提高识别速度
                                    var ctx = wx.createCanvasContext(tempCanvasId,that);
                                    ctx.clearRect(0, 0, tempImageSize, tempImageSize);
                                    ctx.drawImage(tempUrl,0,0,drawWidth,drawHeight);
                                    ctx.draw(false,function(){

                                        //获得图片的 imageData
                                        wx.canvasGetImageData({
                                            canvasId: tempCanvasId,
                                            x: 0,
                                            y: 0,
                                            width: drawWidth,
                                            height: drawHeight,
                                            success:function(res) {
                                             

                                                GraphicCode.scan(res,function(res){
                                                   
                                                    if(res){
                                                        var type=res.type;
                                                        var scan_result=res.result;
                                                        if(type=='QR_CODE'){
                                                            qrcode_text=imageBuffer.qrcode=scan_result;
                                                            
                                                            addQrcodeMenuItem();
                                                        }
                                                        else if(type=='barcode'){
                                                            barcode_text=imageBuffer.barcode=scan_result;
                                                            addBarcodeMenuItem();
                                                        }
                                                        next();
                                                    }
                                                })
                                                
                                            }
                                        },that)
                                    })
                                }
                            });
                        }
                    })
                }
            }
           

            
        },
        //显示/隐藏控制栏
        onControlBarTap:function(e){

            var now=+new Date();

          

            if(now-ts_singleTap<300){
                if(timer_singleTap)clearTimeout(timer_singleTap);
                return;
            }

            ts_singleTap=now;
          
            var that=this;
            if(!flag_autoHideControlBar){

                
                
               
                timer_singleTap=setTimeout(function(){
                    controlBarAnimation.opacity(flag_controlBarIsShow?0:1).step();
   
                    flag_controlBarIsShow=!flag_controlBarIsShow;
            
                    setData(that,{
                        // _hideControlBar:false,
                        controlBarAnimation:controlBarAnimation.export()
                    })
                },500);
               
            }
        },
        //控制栏动画结束
        // onControlBarAnimationEnd:function(){
        //     setData(this,{
        //         _hideControlBar:!flag_controlBarIsShow
        //     })
        // },
        //下载图片
        downloadImage:function(e){

            var that=this;

            var url=urls[currentImageIndex];

            if(isMobile && isWeb){//移动端的浏览器不能直接保存图片到相册，只能通过长按图片来保存
                setData(that,{
                    dialogType:'saveImage',
                    blur:true,
                    showDialog:true,
                })
                setData(that,{
                    _saveImageUrl:url,
                    dialog_animationName:fadeIn
                })
                return;
            }
            else{

                var arr=url.split('/');


                if(url.indexOf('http')==0){
                    //注意：这里需要考虑跨域情况
                    //要跨域，请在“NBConfig.runtime.web.crossDomain”的数组里面增加需要跨域的域名
                    wx.downloadFile({
                        url:url,
                        filePath:wx.env.USER_DATA_PATH+'/'+arr[arr.length-1],
                        success:function(res){
                            that.saveImage(res.tempFilePath);
                        },
                        fail:function(){
                            
                            wx.showToast({
                                title:L('Image save failed'),
                                icon:'none'
                            })
                            
                        
                        }
                    })
                }
                else{
                    //临时路径直接保存
                    that.saveImage(url);
                }
            }

          
            
        },
        saveImage:function(url){
            wx.saveImageToPhotosAlbum({
                filePath:url,
                success:function(res){
                    
                    wx.showToast({
                        title:L('Image save successful')
                    })
                },
                fail:function(){
                    wx.showToast({
                        title:L('Image save failed'),
                        icon:'none'
                    })
                }
            })
        },
        
        none:function(){
            //do nothing
            return false;
        },
        //关闭对话框
        dialog_close:function(){
            flag_willCloseDialog=true;
            setData(this,{
                dialog_animationName:fadeOut,
                blur:false
            })
        },
        //对话框动画完成事件
        dialog_onAnimationEnd:function(){
            var that=this;
            if(flag_willCloseDialog){
                flag_willCloseDialog=false;
                setData(that,{
                    showDialog:false,
                    
                })
            }
        },
       
        //复制扫码结果到剪贴板
        copyScanResult:function(){
            copy(this.data.scanResult);
            
        },
        //复制图片链接到剪贴板
        copyImageLink:function(){
            copy(urls[currentImageIndex]);
        }
    },
    pageLifetimes: {
        
        resize(size) {
            var that=this;
            var items=that.data._items;
            if(items.length==0) return;

            initConfig(that);

            setData(that,{
                _items:[]
            });

            var items=initItems(that);

            frameAnimation=createAnimation({
                duration: 0
            });

            default_frameLeft=-clientWidth-imageItemMargin*3;

         
            frameAnimation.translate3d(0,0,0).step();

            setData(that,{
                _items:items,
                frameAnimation:frameAnimation.export()
            });
        }
    }
})